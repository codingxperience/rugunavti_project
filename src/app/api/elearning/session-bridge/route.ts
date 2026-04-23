import { createClerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { normalizeRole } from "@/lib/platform/auth";
import { setClerkBridgeSession } from "@/lib/platform/bridge-session";
import { getAuthorizedPartyOrigins, hasClerk, platformEnv } from "@/lib/platform/env";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getBearerToken(value: string | null) {
  if (!value?.startsWith("Bearer ")) {
    return null;
  }

  return value.slice("Bearer ".length).trim() || null;
}

function getPrimaryEmail(user: Awaited<ReturnType<ReturnType<typeof createClerkClient>["users"]["getUser"]>>) {
  const primary = user.emailAddresses?.find((email) => email.id === user.primaryEmailAddressId);
  return primary?.emailAddress ?? user.emailAddresses?.[0]?.emailAddress ?? null;
}

function normalizeTimestampToSeconds(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return Math.floor(Date.now() / 1000) + 60 * 60 * 8;
  }

  return value > 1_000_000_000_000 ? Math.floor(value / 1000) : Math.floor(value);
}

function normalizeClerkOpaqueId(
  value: string | null | undefined,
  prefix: "sess_" | "user_"
) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith(prefix)) {
    return null;
  }

  if (!/^[A-Za-z0-9_]+$/.test(trimmed)) {
    return null;
  }

  return trimmed;
}

function isSameOriginBridgeRequest(request: Request) {
  if (!platformEnv.siteOrigin) {
    return false;
  }

  const requestOrigin = request.headers.get("origin");

  if (!requestOrigin) {
    return false;
  }

  return requestOrigin.replace(/\/$/, "") === platformEnv.siteOrigin.replace(/\/$/, "");
}

function decodeUnverifiedSessionHints(token: string | null) {
  if (!token) {
    return {
      sessionId: null,
      userId: null,
      exp: null,
    };
  }

  const [, payload] = token.split(".");

  if (!payload) {
    return {
      sessionId: null,
      userId: null,
      exp: null,
    };
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      sid?: string;
      sub?: string;
      exp?: number;
    };

    return {
      sessionId: typeof decoded.sid === "string" ? decoded.sid : null,
      userId: typeof decoded.sub === "string" ? decoded.sub : null,
      exp: typeof decoded.exp === "number" ? decoded.exp : null,
    };
  } catch {
    return {
      sessionId: null,
      userId: null,
      exp: null,
    };
  }
}

function isUsablePreviewSessionStatus(status: string) {
  return !["ended", "expired", "removed", "replaced", "revoked", "abandoned"].includes(status);
}

export async function POST(request: Request) {
  if (!hasClerk || !platformEnv.clerkSecretKey) {
    return NextResponse.json(
      { success: false, message: "Clerk is not configured for Ruguna eLearning." },
      { status: 503 }
    );
  }

  try {
    const token = getBearerToken(request.headers.get("authorization"));
    const payload = (await request
      .clone()
      .json()
      .catch(() => null)) as
      | {
          sessionId?: string | null;
        }
      | null;
    const tokenHints = decodeUnverifiedSessionHints(token);
    const postedSessionId = normalizeClerkOpaqueId(payload?.sessionId, "sess_");
    const tokenSessionId = normalizeClerkOpaqueId(tokenHints.sessionId, "sess_");
    const candidateSessionId = tokenSessionId ?? postedSessionId;
    const requestOrigin = (() => {
      try {
        return new URL(request.url).origin;
      } catch {
        return null;
      }
    })();
    const clerkClient = createClerkClient({
      secretKey: platformEnv.clerkSecretKey,
      publishableKey: platformEnv.clerkPublishableKey,
    });
    let authenticatedUserId: string | null = null;
    let sessionExpiry: number | null = null;
    let rejectionMessage: string | null = null;

    if (!platformEnv.clerkUsesLiveKeys && candidateSessionId && isSameOriginBridgeRequest(request)) {
      try {
        const clerkSession = await clerkClient.sessions.getSession(candidateSessionId);

        if (isUsablePreviewSessionStatus(clerkSession.status) && typeof clerkSession.userId === "string") {
          authenticatedUserId = clerkSession.userId;
          sessionExpiry = normalizeTimestampToSeconds(clerkSession.expireAt);
        }
      } catch (error) {
        console.error("Clerk preview bridge lookup failed", error);
        rejectionMessage =
          error instanceof Error && error.message
            ? error.message
            : "Clerk preview bridge lookup failed.";
      }
    }

    if (!authenticatedUserId) {
      if (!token) {
        return NextResponse.json(
          {
            success: false,
            message:
              rejectionMessage ??
              "A Clerk session token is required before Ruguna can create the learning session.",
          },
          { status: 401 }
        );
      }

      const requestState = await clerkClient.authenticateRequest(request, {
        acceptsToken: "session_token",
        authorizedParties: getAuthorizedPartyOrigins([requestOrigin]),
        publishableKey: platformEnv.clerkPublishableKey,
        secretKey: platformEnv.clerkSecretKey,
      });

      authenticatedUserId = normalizeClerkOpaqueId(
        requestState.isAuthenticated ? requestState.toAuth().userId : null,
        "user_"
      );
      sessionExpiry =
        requestState.isAuthenticated && typeof requestState.toAuth().sessionClaims?.exp === "number"
          ? requestState.toAuth().sessionClaims.exp
          : tokenHints.exp;

      if (!requestState.isAuthenticated && !authenticatedUserId) {
        const reason = requestState.reason ? `${requestState.reason}` : null;

        return NextResponse.json(
          {
            success: false,
            message:
              rejectionMessage ??
              (typeof requestState.message === "string" && requestState.message.length > 0
                ? requestState.message
                : reason
                  ? `Clerk rejected the session token: ${reason}.`
                  : "Ruguna could not verify the Clerk session token."),
          },
          { status: 401 }
        );
      }
    }

    if (!authenticatedUserId) {
      return NextResponse.json(
        {
          success: false,
          message: rejectionMessage ?? "Ruguna could not determine the active Clerk user.",
        },
        { status: 401 }
      );
    }

    const user = await clerkClient.users.getUser(authenticatedUserId);
    const role =
      normalizeRole(
        typeof user.publicMetadata?.role === "string" ? user.publicMetadata.role : null
      ) ?? "student";
    const email = getPrimaryEmail(user);
    const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.username ||
      email ||
      "Ruguna User";
    const exp =
      typeof sessionExpiry === "number"
        ? sessionExpiry
        : Math.floor(Date.now() / 1000) + 60 * 60 * 8;

    const stored = await setClerkBridgeSession({
      userId: authenticatedUserId,
      role,
      email,
      name,
      exp,
    });

    if (!stored) {
      return NextResponse.json(
        { success: false, message: "Ruguna could not create the bridge session." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      role,
      expiresAt: exp,
    });
  } catch (error) {
    console.error("Clerk bridge session creation failed", error);

    return NextResponse.json(
      { success: false, message: "Ruguna could not verify the Clerk session token." },
      { status: 401 }
    );
  }
}
