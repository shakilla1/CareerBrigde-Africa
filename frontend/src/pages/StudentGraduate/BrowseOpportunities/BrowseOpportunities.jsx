import { useEffect, useState } from "react";
import {
  getOpportunities,
  saveOpportunity,
} from "../../../services/opportunityService";

import {
  applyToOpportunity,
} from "../../../services/applicationService";

import { useNavigate } from "react-router-dom";

import "./BrowseOpportunities.css";

function BrowseOpportunities() {

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const fetchOpportunities = async () => {

  try {

    setLoading(true);

    const data = await getOpportunities({
      query: search,
      location: location,
    });

    setOpportunities(
      data.opportunities || data
    );

  } catch(error){

    console.error(error);

  } finally {

    setLoading(false);

  }

  };

  useEffect(() => {

    fetchOpportunities();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (id) => {

    try {

      setProcessingId(id);

      await saveOpportunity(id);

      setMessage("Opportunity saved successfully.");

    } catch (error) {

      setMessage(
        error.response?.data?.error ||
        "Failed to save opportunity."
      );

    } finally {

      setProcessingId(null);

    }

  };

  const handleApply = async (id) => {

    try {

      setProcessingId(id);

      await applyToOpportunity(id, "");

      setMessage("Application submitted successfully.");

    } catch (error) {

      setMessage(
        error.response?.data?.error ||
        "Failed to submit application."
      );

    } finally {

      setProcessingId(null);

    }

  };

  if (loading) {
    return (
      <p>Loading opportunities...</p>
    );
  }

  return (
    <section className="browse-opportunities">

      <div className="browse-opportunities__header">

        <h1>Browse Opportunities</h1>

        <p>
          Find internships, jobs and career opportunities.
        </p>
      <div className="search-container">

      <input
      type="text"
      placeholder="Search opportunities..."
      value={search}
      onChange={(e)=>setSearch(e.target.value)}
      />


      <input
      type="text"
      placeholder="Location..."
      value={location}
      onChange={(e)=>setLocation(e.target.value)}
      />


      <button onClick={fetchOpportunities}>
      Search
      </button>

      </div>
        {message && (
          <div className="browse-message">
            {message}
          </div>
        )}

      </div>

      <div className="browse-opportunities__grid">

        {opportunities.length === 0 ? (

          <p>No opportunities available yet.</p>

        ) : (

          opportunities.map((opportunity) => (

            <div
              key={opportunity.id}
              className="opportunity-card"
            >

              <h2>{opportunity.title}</h2>

              <p>{opportunity.description}</p>

              <span>{opportunity.location}</span>

              <span>{opportunity.employment_type}</span>

              <div className="opportunity-actions">

                <button onClick={() => navigate(`/student/opportunities/${opportunity.id}`)}>
                   View Details
                </button>

                <button
                  onClick={() => handleSave(opportunity.id)}
                  disabled={processingId === opportunity.id}
                >
                  {processingId === opportunity.id ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={() => handleApply(opportunity.id)}
                  disabled={processingId === opportunity.id}
                >
                  {processingId === opportunity.id ? "Applying..." : "Apply"}
                </button>

              </div>

            </div>

          ))

        )}

      </div>

    </section>
  );
}

export default BrowseOpportunities;