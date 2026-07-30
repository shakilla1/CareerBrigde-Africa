import "./Dashboard.css";

import DashboardCard from "../../../components/dashboard/DashboardCard/DashboardCard";

function Dashboard() {
  const dashboardCards = [
    {
      id: 1,
      title: "Posted Opportunities",
      value: "3",
    },
    {
      id: 2,
      title: "Applications Received",
      value: "2",
    },
    {
      id: 3,
      title: "Shortlisted Candidates",
      value: "1",
    },
    {
      id: 4,
      title: "Open Positions",
      value: "3",
    },
  ];

  return (
    <section className="dashboard">

      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Monitor your recruitment activities.</p>
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

    </section>
  );
}

export default Dashboard;