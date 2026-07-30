import "./Dashboard.css";

import DashboardCard from "../../../components/dashboard/DashboardCard/DashboardCard";
import RecentOpportunityCard from "../../../components/dashboard/RecentOpportunityCard/RecentOpportunityCard";

import dashboardCards from "../../../data/dashboardCards";
import recentOpportunities from "../../../data/recentOpportunities";

function Dashboard() {
  return (
    <section className="dashboard">

      <div className="dashboard__header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back. Here's an overview of your career journey.</p>
        </div>
      </div>

      <div className="dashboard__cards">
        {dashboardCards.map((card) => (
          <DashboardCard
            key={card.id}
            title={card.title}
            value={card.value}
          />
        ))}
      </div>

      <section className="dashboard__section">
        <h2>Recent Opportunities</h2>

        {recentOpportunities.map((opportunity) => (
          <RecentOpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
          />
        ))}
      </section>

    </section>
  );
}

export default Dashboard;