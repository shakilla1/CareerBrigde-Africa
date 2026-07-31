import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

import DashboardCard from "../../../components/dashboard/DashboardCard/DashboardCard";
import RecentOpportunityCard from "../../../components/dashboard/RecentOpportunityCard/RecentOpportunityCard";

import { getDashboardSummary } from "../../../services/profileService";
import { getOpportunities } from "../../../services/opportunityService";

function Dashboard() {
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [recentOpportunities, setRecentOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [summary, opportunityData] = await Promise.all([
          getDashboardSummary(),
          getOpportunities({ perPage: 3 }),
        ]);

        setCards([
          { id: 1, title: "Applications", value: summary.applications },
          { id: 2, title: "Saved Opportunities", value: summary.saved_opportunities },
          { id: 3, title: "Available Opportunities", value: summary.available_opportunities },
          { id: 4, title: "Mentorship Resources", value: summary.mentorship_resources },
          { id: 5, title: "Profile Completion", value: `${summary.profile_completion}%` },
        ]);

        const list = opportunityData.opportunities || opportunityData || [];

        setRecentOpportunities(
          list.map((opportunity) => ({
            id: opportunity.id,
            title: opportunity.title,
            company: opportunity.company_name,
            location: opportunity.location,
            type: opportunity.employment_type,
          }))
        );
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <section className="dashboard">

      <div className="dashboard__header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back. Here's an overview of your career journey.</p>
        </div>
      </div>

      <div className="dashboard__cards">
        {loading ? (
          <p>Loading your dashboard...</p>
        ) : (
          cards.map((card) => (
            <DashboardCard
              key={card.id}
              title={card.title}
              value={card.value}
            />
          ))
        )}
      </div>

      <section className="dashboard__section">
        <h2>Recent Opportunities</h2>

        {!loading && recentOpportunities.length === 0 && (
          <p>No opportunities have been posted yet.</p>
        )}

        {recentOpportunities.map((opportunity) => (
          <RecentOpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            onView={() => navigate(`/student/opportunities/${opportunity.id}`)}
          />
        ))}
      </section>

    </section>
  );
}

export default Dashboard;
