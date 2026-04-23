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

    if (!requestState.isAuthenticated) {
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

    const authObject = requestState.toAuth();
    const userId = typeof authObject.userId === "string" ? authObject.userId : null;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "The Clerk token did not include a user id." },
        { status: 401 }
      );
    }

    const user = await clerkClient.users.getUser(userId);
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
      typeof authObject.sessionClaims?.exp === "number"
        ? authObject.sessionClaims.exp
        : Math.floor(Date.now() / 1000) + 60 * 60 * 8;

    const stored = await setClerkBridgeSession({
      userId,
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
