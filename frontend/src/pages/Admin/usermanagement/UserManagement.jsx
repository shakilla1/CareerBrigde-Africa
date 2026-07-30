import { useEffect, useState } from "react";
import { getUsers, updateUserStatus } from "../../../services/adminService";
import "../../../styles/admin.css";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (user) => {
    setBusyId(user.id);
    setError("");

    const newStatus = user.status === "active" ? "suspended" : "active";

    try {
      await updateUserStatus(user.id, newStatus);
      await loadUsers();
    } catch (err) {
      setError(err.response?.data?.error || "Could not update this user.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <section className="user-management">

      <div className="page-header">
        <h1>User Management</h1>
        <p>Manage students, graduates, employers and administrators.</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      <table className="admin-table">

        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {users.length === 0 ? (
            <tr>
              <td colSpan="5">No users found.</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.full_name}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>{user.status}</td>
                <td>
                  <button
                    onClick={() => handleToggleStatus(user)}
                    disabled={busyId === user.id || user.role === "admin"}
                  >
                    {user.status === "active" ? "Suspend" : "Activate"}
                  </button>
                </td>
              </tr>
            ))
          )}

        </tbody>

      </table>

    </section>
  );
}

export default UserManagement;