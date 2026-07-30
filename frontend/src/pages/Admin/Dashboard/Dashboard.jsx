import "./Dashboard.css";

import DashboardCard from "../../../components/dashboard/DashboardCard/DashboardCard";

function Dashboard() {

  const dashboardCards = [
    {
      id: 1,
      title: "Users",
      value: "620",
    },
    {
      id: 2,
      title: "Pending Employer Verifications",
      value: "14",
    },
    {
      id: 3,
      title: "Mentorship Resources",
      value: "45",
    },
    {
      id: 4,
      title: "Reported Items",
      value: "9",
    },
  ];

  return (
    <section className="dashboard">

      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of platform activities.</p>
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