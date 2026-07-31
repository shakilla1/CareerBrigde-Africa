import { useEffect, useState } from "react";
import "./ManageOpportunities.css";

import {
  getMyOpportunities,
  updateOpportunity,
  deleteOpportunity,
} from "../../../services/opportunityService";

function ManageOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [message, setMessage] = useState("");

  const loadOpportunities = async () => {
    try {
      const data = await getMyOpportunities();
      setOpportunities(data);
    } catch (error) {
      setMessage("Could not load your opportunities.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  const handleToggleStatus = async (opportunity) => {
    const newStatus = opportunity.status === "open" ? "closed" : "open";

    setBusyId(opportunity.id);
    setMessage("");

    try {
      await updateOpportunity(opportunity.id, { status: newStatus });
      await loadOpportunities();
      setMessage(
        newStatus === "open"
          ? "Opportunity reopened."
          : "Opportunity closed to new applications."
      );
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Could not update this opportunity."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (opportunity) => {
    setBusyId(opportunity.id);
    setMessage("");

    try {
      await deleteOpportunity(opportunity.id);
      setOpportunities((previous) =>
        previous.filter((item) => item.id !== opportunity.id)
      );
      setMessage("Opportunity deleted.");
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Could not delete this opportunity."
      );
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <p>Loading your opportunities...</p>;
  }

  return (
    <section className="manage-opportunities">

      <div className="page-header">
        <h1>Manage Opportunities</h1>
        <p>View and update your posted opportunities.</p>
      </div>

      {message && <p className="form-success">{message}</p>}

      <table className="opportunities-table">

        <thead>

          <tr>
            <th>Opportunity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {opportunities.length === 0 ? (
            <tr>
              <td colSpan="3">
                You have not posted any opportunities yet.
              </td>
            </tr>
          ) : (
            opportunities.map((opportunity) => (
              <tr key={opportunity.id}>
                <td>{opportunity.title}</td>
                <td>{opportunity.status}</td>
                <td>
                  <button
                    onClick={() => handleToggleStatus(opportunity)}
                    disabled={busyId === opportunity.id}
                  >
                    {opportunity.status === "open" ? "Close" : "Reopen"}
                  </button>

                  <button
                    onClick={() => handleDelete(opportunity)}
                    disabled={busyId === opportunity.id}
                  >
                    Delete
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

export default ManageOpportunities;
