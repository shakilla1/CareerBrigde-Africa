import "./RecentOpportunityCard.css";

function RecentOpportunityCard({ opportunity }) {
  return (
    <div className="recent-opportunity-card">

      <div>
        <h3>{opportunity.title}</h3>

        <p>{opportunity.company}</p>

        <span>
          {opportunity.location} • {opportunity.type}
        </span>
      </div>

      <button>
        View
      </button>

    </div>
  );
}

export default RecentOpportunityCard;