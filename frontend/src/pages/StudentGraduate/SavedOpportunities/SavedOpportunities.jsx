import { useEffect, useState } from "react";

import {
  getSavedOpportunities,
  unsaveOpportunity,
} from "../../../services/opportunityService";

import "./SavedOpportunities.css";

function SavedOpportunities() {

  const [savedOpportunities, setSavedOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {

    fetchSavedOpportunities();

  }, []);

  const fetchSavedOpportunities = async () => {

    try {

      const data = await getSavedOpportunities();

      setSavedOpportunities(data);

    } catch (error) {

      console.error(error);

      setMessage("Failed to load saved opportunities.");

    } finally {

      setLoading(false);

    }

  };

  const handleRemove = async (opportunityId) => {

    try {

      setProcessingId(opportunityId);

      await unsaveOpportunity(opportunityId);

      setSavedOpportunities((previous) =>
        previous.filter(
          (item) => item.opportunity.id !== opportunityId
        )
      );

      setMessage("Opportunity removed successfully.");

    } catch (error) {

      setMessage(
        error.response?.data?.error ||
        "Failed to remove opportunity."
      );

    } finally {

      setProcessingId(null);

    }

  };

  if (loading) {
    return <p>Loading saved opportunities...</p>;
  }

  return (

    <section className="saved-opportunities">

      <div className="page-header">

        <h1>Saved Opportunities</h1>

        <p>Your bookmarked opportunities.</p>

      </div>

      {message && (

        <div className="browse-message">

          {message}

        </div>

      )}

      <div className="saved-grid">

        {savedOpportunities.length === 0 ? (

          <p>You haven't saved any opportunities yet.</p>

        ) : (

          savedOpportunities.map((saved) => (

            <div
              key={saved.id}
              className="opportunity-card"
            >

              <h2>

                {saved.opportunity.title}

              </h2>

              <p>

                {saved.opportunity.description}

              </p>

              <p>

                <strong>Location:</strong>{" "}
                {saved.opportunity.location}

              </p>

              <p>

                <strong>Type:</strong>{" "}
                {saved.opportunity.employment_type}

              </p>

              <button
                onClick={() =>
                  handleRemove(saved.opportunity.id)
                }
                disabled={
                  processingId === saved.opportunity.id
                }
              >

                {processingId === saved.opportunity.id
                  ? "Removing..."
                  : "Remove"}

              </button>

            </div>

          ))

        )}

      </div>

    </section>

  );

}

export default SavedOpportunities;