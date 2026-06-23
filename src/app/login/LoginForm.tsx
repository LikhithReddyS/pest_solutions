"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";
import { Bug, LogIn } from "lucide-react";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, { error: "" });

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-icon">
            <Bug size={28} />
          </div>
          <h1>Amarnath Pest Solutions</h1>
          <p>Admin Dashboard</p>
        </div>

        {state.error && <div className="login-alert">{state.error}</div>}

        <form action={formAction} className="login-form">
          <div className="form-group">
            <label htmlFor="login-user">Username</label>
            <input
              id="login-user"
              name="username"
              type="text"
              required
              autoComplete="username"
              placeholder="Enter your username"
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-pass">Password</label>
            <input
              id="login-pass"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn--primary" disabled={isPending}>
            {isPending ? (
              "Signing in..."
            ) : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Authorized administrators only</p>
        </div>
      </div>
    </div>
  );
}
