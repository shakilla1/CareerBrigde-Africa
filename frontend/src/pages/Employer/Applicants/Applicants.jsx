import { useEffect, useState } from "react";
import {
  getMyOpportunities,
  getApplicantsForOpportunity,
} from "../../../services/opportunityService";
import { updateApplicationStatus } from "../../../services/applicationService";

import "./Applicants.css";

const STATUS_OPTIONS = ["submitted", "under_review", "interviewing", "offered", "rejected"];

function Applicants() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const loadApplicants = async () => {
    try {
      const myOpportunities = await getMyOpportunities();

      const applicantLists = await Promise.all(
        myOpportunities.map((opportunity) => getApplicantsForOpportunity(opportunity.id))
      );

      setApplications(applicantLists.flat());
    } catch (err) {
      setError("Could not load applicants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplicants();
  }, []);

  const handleStatusChange = async (applicationId, newStatus) => {
    setBusyId(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      await loadApplicants();
    } catch (err) {
      setError("Could not update this application.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <p>Loading applicants...</p>;
  }

  return (
    <section className="applicants">

      <div className="page-header">
        <h1>Applicants</h1>
        <p>Review candidates who applied to your opportunities.</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      <table className="applicants-table">

        <thead>
          <tr>
            <th>Applicant</th>
            <th>Position</th>
            <th>Applied</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {applications.length === 0 ? (
            <tr>
              <td colSpan="4">No applicants yet.</td>
            </tr>
          ) : (
            applications.map((application) => (
              <tr key={application.id}>
                <td>
                  {application.applicant?.full_name || "Unknown"}
                  <br />
                  <span className="applicants__email">{application.applicant?.email}</span>
                </td>
                <td>{application.opportunity?.title}</td>
                <td>{new Date(application.applied_at).toLocaleDateString()}</td>
                <td>
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusChange(application.id, e.target.value)}
                    disabled={busyId === application.id}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))
          )}

        </tbody>

      </table>

    </section>
  );
}

export default Applicants;