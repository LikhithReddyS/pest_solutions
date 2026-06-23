import { verifyAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  // If already authenticated, redirect to dashboard
  const auth = await verifyAuth();
  if (auth) redirect("/");

  return <LoginForm />;
}
