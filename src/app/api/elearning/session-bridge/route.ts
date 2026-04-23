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

export async function POST(request: Request) {
  if (!hasClerk || !platformEnv.clerkSecretKey) {
    return NextResponse.json(
      { success: false, message: "Clerk is not configured for Ruguna eLearning." },
      { status: 503 }
    );
  }

  const token = getBearerToken(request.headers.get("authorization"));

  if (!token) {
    return NextResponse.json(
      { success: false, message: "A Clerk session token is required." },
      { status: 401 }
    );
  }

  try {
    const payload = (await request
      .clone()
      .json()
      .catch(() => null)) as
      | {
          sessionId?: string | null;
        }
      | null;
    const postedSessionId =
      typeof payload?.sessionId === "string" && payload.sessionId.length > 0
        ? payload.sessionId
        : null;
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
    const requestState = await clerkClient.authenticateRequest(request, {
      acceptsToken: "session_token",
      authorizedParties: getAuthorizedPartyOrigins([requestOrigin]),
      publishableKey: platformEnv.clerkPublishableKey,
      secretKey: platformEnv.clerkSecretKey,
    });
    let authenticatedUserId =
      requestState.isAuthenticated && typeof requestState.toAuth().userId === "string"
        ? requestState.toAuth().userId
        : null;
    let sessionExpiry =
      requestState.isAuthenticated && typeof requestState.toAuth().sessionClaims?.exp === "number"
        ? requestState.toAuth().sessionClaims.exp
        : null;

    if (!authenticatedUserId && !platformEnv.clerkUsesLiveKeys && postedSessionId && isSameOriginBridgeRequest(request)) {
      try {
        const clerkSession = await clerkClient.sessions.getSession(postedSessionId);

        if (clerkSession.status === "active" && typeof clerkSession.userId === "string") {
          authenticatedUserId = clerkSession.userId;
          sessionExpiry = normalizeTimestampToSeconds(clerkSession.expireAt);
        }
      } catch (error) {
        console.error("Clerk preview bridge lookup failed", error);
      }
    }

    if (!authenticatedUserId) {
      const reason = requestState.reason ? `${requestState.reason}` : null;

      return NextResponse.json(
        {
          success: false,
          message:
            typeof requestState.message === "string" && requestState.message.length > 0
              ? requestState.message
              : reason
                ? `Clerk rejected the session token: ${reason}.`
                : "Ruguna could not verify the Clerk session token.",
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
