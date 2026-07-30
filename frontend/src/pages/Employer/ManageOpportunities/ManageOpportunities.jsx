import "./ManageOpportunities.css";

const opportunities = [
  {
    id: 1,
    title: "Frontend Developer",
    location: "Kigali",
    status: "Open",
    applicants: 2,
  },
  {
    id: 2,
    title: "Backend Developer",
    location: "Remote",
    status: "Closed",
    applicants: 1,
  },
  {
    id: 3,
    title: "UI/UX Designer",
    location: "Kigali",
    status: "Open",
    applicants: 0,
  },
];

function ManageOpportunities() {
  return (
    <section className="manage-opportunities">

      <div className="page-header">
        <h1>Manage Opportunities</h1>
        <p>View and update your posted opportunities.</p>
      </div>

      <table className="opportunities-table">

        <thead>

          <tr>
            <th>Opportunity</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          {opportunities.map((opportunity) => (

            <tr key={opportunity.id}>
              <td>{opportunity.title}</td>
              <td>{opportunity.status}</td>
            </tr>

          ))}

        </tbody>

      </table>

    </section>
  );
}

export default ManageOpportunities;