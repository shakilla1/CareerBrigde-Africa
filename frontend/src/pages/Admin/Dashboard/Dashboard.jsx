import { useEffect, useState } from "react";
import "./Dashboard.css";

import DashboardCard from "../../../components/dashboard/DashboardCard/DashboardCard";
import { getPlatformStats } from "../../../services/adminService";

function Dashboard() {
  const [dashboardCards, setDashboardCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getPlatformStats();

        setDashboardCards([
          { id: 1, title: "Users", value: stats.total_users },
          { id: 2, title: "Pending Employer Verifications", value: stats.pending_verifications },
          { id: 3, title: "Mentorship Resources", value: stats.mentorship_resources },
          { id: 4, title: "Reported Items", value: stats.open_reports },
          { id: 5, title: "Open Opportunities", value: stats.open_opportunities },
          { id: 6, title: "Applications", value: stats.total_applications },
        ]);
      } catch (err) {
        setError("Could not load platform statistics.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <section className="dashboard">

      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of platform activities.</p>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="dashboard__cards">

        {loading ? (
          <p>Loading statistics...</p>
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
