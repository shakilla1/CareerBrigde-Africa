import { useState } from "react";
import ChangePasswordForm from "../../../components/common/ChangePasswordForm/ChangePasswordForm";
import "./Settings.css";

function Settings() {
  const [notice, setNotice] = useState("");

  return (
    <section className="settings">

      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account settings.</p>
      </div>

      <div className="settings-card">

        <ChangePasswordForm />

        <button onClick={() => setNotice("Notification preferences are planned for the next release.")}>
          Notification Preferences
        </button>

        <button onClick={() => setNotice("To close your account, please contact an administrator.")}>
          Delete Account
        </button>

        {notice && <p className="form-success">{notice}</p>}

      </div>

    </section>
  );
}

export default Settings;
