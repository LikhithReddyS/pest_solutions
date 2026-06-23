"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/actions/auth";
import { Lock, CheckCircle } from "lucide-react";

export function SettingsForm() {
  const [state, formAction, isPending] = useActionState(changePassword, {
    error: "",
    success: false,
  });

  return (
    <div className="settings-card">
      <div className="card-header">
        <h2>
          <Lock
            size={18}
            style={{ marginRight: 8, verticalAlign: "text-bottom" }}
          />
          Change Password
        </h2>
      </div>

      {state.success && (
        <div
          className="alert alert--success"
          style={{ margin: "16px 24px 0" }}
        >
          <CheckCircle
            size={16}
            style={{ marginRight: 6, verticalAlign: "text-bottom" }}
          />
          Password changed successfully!
        </div>
      )}
      {state.error && (
        <div className="alert alert--error" style={{ margin: "16px 24px 0" }}>
          {state.error}
        </div>
      )}

      <form action={formAction} className="settings-form">
        <div className="form-group">
          <label htmlFor="set-current">Current Password</label>
          <input
            id="set-current"
            name="currentPassword"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Enter current password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="set-new">New Password</label>
          <input
            id="set-new"
            name="newPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="At least 6 characters"
          />
        </div>
        <div className="form-group">
          <label htmlFor="set-confirm">Confirm New Password</label>
          <input
            id="set-confirm"
            name="confirmPassword"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Re-enter new password"
          />
        </div>
        <button
          type="submit"
          className="btn btn--primary"
          disabled={isPending}
          style={{ alignSelf: "flex-start" }}
        >
          {isPending ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
