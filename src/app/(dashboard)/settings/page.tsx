import { SettingsForm } from "./SettingsForm";

export default function SettingsPage() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your admin account</p>
        </div>
      </div>
      <SettingsForm />
    </div>
  );
}
