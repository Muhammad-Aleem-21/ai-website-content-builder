import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "token";
const secret = () => new TextEncoder().encode(process.env.JWT_SECRET);

// Create a signed token and store it in an httpOnly cookie
// (JavaScript in the browser cannot read it, which protects against XSS theft).
export async function createSession(userId) {
  const token = await new SignJWT({})
    .setSubject(userId)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

// Returns the logged-in user's id, or null.
export async function getUserId() {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret());
    return payload.sub ?? null;
  } catch {
    return null;
  }
}