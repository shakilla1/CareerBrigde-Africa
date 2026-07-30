import "../../../styles/admin.css";

function Profile() {
  return (
    <section className="admin-profile">

      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your administrator account.</p>
      </div>

      <form className="profile-form">

        <input
          type="text"
          placeholder="Full Name"
        />

        <input
          type="email"
          placeholder="Email Address"
        />

        <input
          type="text"
          placeholder="Phone Number"
        />

        <button type="submit">
          Save Changes
        </button>

      </form>

    </section>
  );
}

export default Profile;