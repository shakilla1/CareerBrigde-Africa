import { useEffect, useState } from "react";
import {
  getReports,
  resolveReport,
  dismissReport,
} from "../../../services/adminService";
import "../../../styles/admin.css";

function ReportedItems() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const loadReports = async () => {
    try {
      const data = await getReports();
      setReports(data);
    } catch (err) {
      setError("Could not load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleAction = async (report, action) => {
    setBusyId(report.id);
    setError("");

    try {
      if (action === "resolve") {
        await resolveReport(report.id);
      } else {
        await dismissReport(report.id);
      }
      await loadReports();
    } catch (err) {
      setError("Could not update this report.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <p>Loading reports...</p>;
  }

  return (
    <section className="reported-items">

      <div className="page-header">
        <h1>Reported Items</h1>
        <p>Review reports submitted by platform users.</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      <table className="admin-table">

        <thead>

          <tr>
            <th>Item</th>
            <th>Reason</th>
            <th>Reported By</th>
            <th>Status</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {reports.length === 0 ? (
            <tr>
              <td colSpan="5">No reports have been submitted.</td>
            </tr>
          ) : (
            reports.map((report) => (
              <tr key={report.id}>
                <td>{report.category}</td>
                <td>{report.reason}</td>
                <td>{report.reporter_name}</td>
                <td>{report.status}</td>
                <td>
                  <button
                    onClick={() => handleAction(report, "resolve")}
                    disabled={busyId === report.id || report.status !== "new"}
                  >
                    Resolve
                  </button>

                  <button
                    onClick={() => handleAction(report, "dismiss")}
                    disabled={busyId === report.id || report.status !== "new"}
                  >
                    Dismiss
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

export default ReportedItems;
