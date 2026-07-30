import "./Statistics.css";

function Statistics() {
  const statistics = [
    {
      id: 1,
      value: "500+",
      label: "Job Opportunities",
    },
    {
      id: 2,
      value: "120+",
      label: "Mentorship Resources",
    },
    {
      id: 3,
      value: "50+",
      label: "Partner Employers",
    },
    {
      id: 4,
      value: "300+",
      label: "Students & Graduates",
    },
  ];

  return (
    <section className="statistics">
      <div className="statistics__container">
        {statistics.map((item) => (
          <div key={item.id} className="statistics__card">
            <h2>{item.value}</h2>
            <p>{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Statistics;