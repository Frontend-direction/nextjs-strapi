import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_COOKIE = "sessionToken";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const JWT_DURATION = 14 * 24 * 60 * 60 * 1000; // 2 weeks

export type AuthenticatedUser = {
  email: string;
};

export function deleteSessionCookie() {
  cookies().delete(JWT_COOKIE);
}

export async function getUserFromSession(): Promise<
  AuthenticatedUser | undefined
> {
  const sessionToken = cookies().get(JWT_COOKIE)?.value;
  if (sessionToken) {
    try {
      const { payload } = await jwtVerify<AuthenticatedUser>(
        sessionToken,
        JWT_SECRET
      );
      return payload;
    } catch (error) {
      console.warn("Invalid JWT", error);
    }
  }
}

export async function setSessionCookie(user: AuthenticatedUser) {
  const expirationTime = new Date(Date.now() + JWT_DURATION);
  const sessionToken = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expirationTime)
    .sign(JWT_SECRET);
  cookies().set(JWT_COOKIE, sessionToken, {
    expires: expirationTime,
    httpOnly: true,
    sameSite: "lax",
  });
}
