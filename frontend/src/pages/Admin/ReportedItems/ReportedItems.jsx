import "../../../styles/admin.css";

const reports = [
  {
    id: 1,
    item: "Job Posting",
    reason: "Fraudulent information",
    reportedBy: "Student",
  },
  {
    id: 2,
    item: "Employer Profile",
    reason: "Spam",
    reportedBy: "Graduate",
  },
];

function ReportedItems() {
  return (
    <section className="reported-items">

      <div className="page-header">
        <h1>Reported Items</h1>
        <p>Review reports submitted by platform users.</p>
      </div>

      <table className="admin-table">

        <thead>

          <tr>
            <th>Item</th>
            <th>Reason</th>
            <th>Reported By</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.item}</td>
              <td>{report.reason}</td>
              <td>{report.reportedBy}</td>
              <td>
                <button>Review</button>
              </td>
            </tr>
          ))}

        </tbody>

      </table>

    </section>
  );
}

export default ReportedItems;