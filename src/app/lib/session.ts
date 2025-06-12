import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

type User = {
    id : string;
    name: string;
    email: string;
    password: string;
    role: string;
};

type SessionPayload = {
  user: User;
  expiresAt: string;
};

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error("SESSION_SECRET is not defined in environment variables.");
}
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined
): Promise<SessionPayload | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as SessionPayload;
  } catch (err) {
    console.log("Failed to verify session", err);
  }
  return null;
}

export async function createSession(user: User): Promise<void> {
  const expiresAt = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toISOString();
  const session = await encrypt({ user, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: new Date(expiresAt),
    sameSite: "lax",
    path: "/",
  });
}

export async function verifySession(): Promise<{ user: User | null }> {
  const cookieStore = await cookies();
  const session = cookieStore
    ? cookieStore.get("session")?.value
    : (await cookies()).get("session")?.value;

  const payload = await decrypt(session);

  if (!session || !payload || new Date(payload.expiresAt) < new Date()) {
    return { user: null };
  }

  return {
    user: payload.user,
  };
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}


export async function verifySessionCookieFromRequest(request: NextRequest): Promise<string | null> {
  const session = request.cookies.get("session")?.value || null;
  if (!session) {
    return null;
  }
  const payload = await decrypt(session);
  if (!session || !payload || new Date(payload.expiresAt) < new Date()) {
    return null;
  }
  return session;
}