import "./RecentOpportunityCard.css";

function RecentOpportunityCard({ opportunity, onView }) {
  return (
    <div className="recent-opportunity-card">

      <div>
        <h3>{opportunity.title}</h3>

        <p>{opportunity.company}</p>

        <span>
          {opportunity.location} • {opportunity.type}
        </span>
      </div>

      <button onClick={onView}>
        View
      </button>

    </div>
  );
}

export default RecentOpportunityCard;
