import { useState } from "react";
import ChangePasswordForm from "../../../components/common/ChangePasswordForm/ChangePasswordForm";
import "../../../styles/admin.css";

function Settings() {
  const [notice, setNotice] = useState("");

  return (
    <section className="admin-settings">

      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your administrator preferences.</p>
      </div>

      <div className="settings-card">

        <ChangePasswordForm />

        <button onClick={() => setNotice("Notification settings are planned for the next release.")}>
          Manage Notifications
        </button>

        <button onClick={() => setNotice("System preferences are planned for the next release.")}>
          System Preferences
        </button>

        {notice && <p className="form-success">{notice}</p>}

      </div>

    </section>
  );
}

export default Settings;
