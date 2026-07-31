import { useEffect, useState } from "react";
import "./Dashboard.css";

import DashboardCard from "../../../components/dashboard/DashboardCard/DashboardCard";
import { getDashboardSummary } from "../../../services/profileService";

function Dashboard() {
  const [dashboardCards, setDashboardCards] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const summary = await getDashboardSummary();

        setVerificationStatus(summary.verification_status);

        setDashboardCards([
          { id: 1, title: "Posted Opportunities", value: summary.posted_opportunities },
          { id: 2, title: "Applications Received", value: summary.applications_received },
          { id: 3, title: "Shortlisted Candidates", value: summary.shortlisted },
          { id: 4, title: "Open Positions", value: summary.open_positions },
        ]);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, []);

  return (
    <section className="dashboard">

      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Monitor your recruitment activities.</p>
      </div>

      {!loading && verificationStatus && verificationStatus !== "approved" && (
        <p className="form-error">
          Your company account is {verificationStatus}. An administrator has to
          approve it before you can publish opportunities.
        </p>
      )}

      <div className="dashboard__cards">
        {loading ? (
          <p>Loading your dashboard...</p>
        ) : (
          dashboardCards.map((card) => (
            <DashboardCard
              key={card.id}
              title={card.title}
              value={card.value}
            />
          ))
        )}
      </div>

    </section>
  );
}

export default Dashboard;
