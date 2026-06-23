"use server";

import { prisma } from "@/lib/prisma";
import { createToken, verifyPassword, hashPassword, verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Login action — validates credentials, sets JWT cookie, and redirects to dashboard.
 * Compatible with useActionState (accepts prevState as first arg).
 */
export async function login(
  _prevState: { error: string },
  formData: FormData
): Promise<{ error: string }> {
  const username = (formData.get("username") as string)?.trim();
  const password = (formData.get("password") as string)?.trim();

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  const count = await prisma.user.count();
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return { error: `Invalid username or password. (DB has ${count} users)` };
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return { error: "Invalid username or password." };
  }

  const token = await createToken(user.id, user.username);
  const cookieStore = await cookies();
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  redirect("/");
}

/**
 * Logout — clears the auth cookie and redirects to login.
 */
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  redirect("/login");
}

/**
 * Change password for the current admin.
 */
export async function changePassword(
  _prevState: { error: string; success: boolean },
  formData: FormData
): Promise<{ error: string; success: boolean }> {
  const auth = await verifyAuth();
  if (!auth) return { error: "Unauthorized.", success: false };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "All fields are required.", success: false };
  }

  if (newPassword.length < 6) {
    return { error: "New password must be at least 6 characters.", success: false };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Passwords do not match.", success: false };
  }

  const user = await prisma.user.findUnique({ where: { id: auth.userId } });
  if (!user) return { error: "User not found.", success: false };

  const isValid = await verifyPassword(currentPassword, user.password);
  if (!isValid) {
    return { error: "Current password is incorrect.", success: false };
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: auth.userId },
    data: { password: hashed },
  });

  return { error: "", success: true };
}
