import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-change-me"
);

export async function createToken(userId: number, username: string) {
  return new SignJWT({ userId, username })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAuth(): Promise<{
  userId: number;
  username: string;
} | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: number; username: string };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}
