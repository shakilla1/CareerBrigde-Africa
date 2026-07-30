import "./Profile.css";

function Profile() {
  return (
    <section className="profile">

      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your personal information.</p>
      </div>

      <form className="profile-form">

        <input type="text" placeholder="Full Name" />

        <input type="email" placeholder="Email Address" />

        <input type="text" placeholder="Phone Number" />

        <textarea placeholder="Professional Summary"></textarea>

        <button type="submit">
          Save Changes
        </button>

      </form>

    </section>
  );
}

export default Profile;