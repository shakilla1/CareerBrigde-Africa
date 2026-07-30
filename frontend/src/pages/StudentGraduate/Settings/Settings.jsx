import "./Settings.css";

function Settings() {
  return (
    <section className="settings">

      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your account settings.</p>
      </div>

      <div className="settings-card">

        <button>Change Password</button>

        <button>Notification Preferences</button>

        <button>Delete Account</button>

      </div>

    </section>
  );
}

export default Settings;