import { useEffect, useState } from "react";
import {
  getEmployerVerifications,
  approveEmployer,
  rejectEmployer,
} from "../../../services/adminService";
import "../../../styles/admin.css";

function EmployerVerification() {
  const [employers, setEmployers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const loadEmployers = async () => {
    try {
      const data = await getEmployerVerifications();
      setEmployers(data);
    } catch (err) {
      setError("Could not load employers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployers();
  }, []);

  const handleApprove = async (id) => {
    setBusyId(id);
    try {
      await approveEmployer(id);
      await loadEmployers();
    } catch (err) {
      setError("Could not approve this employer.");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (id) => {
    setBusyId(id);
    try {
      await rejectEmployer(id);
      await loadEmployers();
    } catch (err) {
      setError("Could not reject this employer.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <p>Loading employers...</p>;
  }

  return (
    <section className="employer-verification">

      <div className="page-header">
        <h1>Employer Verification</h1>
        <p>Review and verify employer accounts before they can post opportunities.</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      <table className="admin-table">

        <thead>
          <tr>
            <th>Company</th>
            <th>Contact Person</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {employers.length === 0 ? (
            <tr>
              <td colSpan="4">No employers found.</td>
            </tr>
          ) : (
            employers.map((employer) => (
              <tr key={employer.id}>
                <td>{employer.company_name}</td>
                <td>{employer.contact_name}</td>
                <td>{employer.verification_status}</td>
                <td>
                  <button
                    onClick={() => handleApprove(employer.id)}
                    disabled={busyId === employer.id || employer.verification_status === "approved"}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(employer.id)}
                    disabled={busyId === employer.id || employer.verification_status === "rejected"}
                  >
                    Reject
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

export default EmployerVerification;