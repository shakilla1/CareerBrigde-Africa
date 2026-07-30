import "../../../styles/admin.css";

function Settings() {
  return (
    <section className="admin-settings">

      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your administrator preferences.</p>
      </div>

      <div className="settings-card">

        <button>Change Password</button>

        <button>Manage Notifications</button>

        <button>System Preferences</button>

      </div>

    </section>
  );
}

export default Settings;