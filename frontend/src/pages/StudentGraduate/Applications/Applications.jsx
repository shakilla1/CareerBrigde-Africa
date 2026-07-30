import { useEffect, useState } from "react";
import {
  getMyApplications,
  withdrawApplication,
} from "../../../services/applicationService";

import "./Applications.css";

function Applications() {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {

    try {

      const data = await getMyApplications();

      setApplications(data);

    } catch (error) {

      setMessage("Failed to load applications.");

    } finally {

      setLoading(false);

    }

  };

  const handleWithdraw = async (id) => {

    try {

      setProcessingId(id);

      await withdrawApplication(id);

      setApplications((previous) =>
        previous.map((application) =>
          application.id === id
            ? { ...application, status: "Withdrawn" }
            : application
        )
      );

      setMessage("Application withdrawn successfully.");

    } catch (error) {

      setMessage(
        error.response?.data?.error ||
        "Failed to withdraw application."
      );

    } finally {

      setProcessingId(null);

    }

  };

  if (loading) {
    return <p>Loading applications...</p>;
  }

  return (

    <section className="applications">

      <div className="page-header">

        <h1>Applications</h1>

        <p>
          Track the status of your submitted applications.
        </p>

      </div>

      {message && (
        <div className="browse-message">
          {message}
        </div>
      )}

      <table className="applications-table">

        <thead>

          <tr>

            <th>Position</th>

            <th>Company</th>

            <th>Status</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {applications.length === 0 ? (

            <tr>

              <td colSpan="4">

                No applications submitted.

              </td>

            </tr>

          ) : (

            applications.map((application) => (

              <tr key={application.id}>

                <td>

                  {application.opportunity.title}

                </td>

                <td>

                  {application.opportunity.company_name}

                </td>

                <td>

                  {application.status}

                </td>

                <td>

                  {application.status === "submitted" && (

                    <button
                      onClick={() =>
                        handleWithdraw(application.id)
                      }
                      disabled={
                        processingId === application.id
                      }
                    >

                      {processingId === application.id
                        ? "Withdrawing..."
                        : "Withdraw"}

                    </button>

                  )}

                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </section>

  );

}

export default Applications;