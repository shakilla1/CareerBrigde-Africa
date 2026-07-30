import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getOpportunityById,
  saveOpportunity,
  unsaveOpportunity,
  getSavedOpportunities,
} from "../../../services/opportunityService";
import {
  applyToOpportunity,
  getMyApplications,
} from "../../../services/applicationService";

import "./OpportunityDetails.css";

function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [opportunity, setOpportunity] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [opportunityData, savedData, applicationsData] = await Promise.all([
          getOpportunityById(id),
          getSavedOpportunities(),
          getMyApplications(),
        ]);

        setOpportunity(opportunityData);
        setIsSaved(savedData.some((entry) => entry.opportunity.id === Number(id)));
        setHasApplied(
          applicationsData.some(
            (application) =>
              application.opportunity.id === Number(id) && application.status !== "withdrawn"
          )
        );
      } catch (err) {
        setError("Could not load this opportunity.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleSaveToggle = async () => {
    setBusy(true);
    setError("");

    try {
      if (isSaved) {
        await unsaveOpportunity(id);
        setIsSaved(false);
      } else {
        await saveOpportunity(id);
        setIsSaved(true);
      }
    } catch (err) {
      setError("Could not update saved opportunities.");
    } finally {
      setBusy(false);
    }
  };

  const handleApply = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSuccess("");

    try {
      await applyToOpportunity(id, coverLetter);
      setHasApplied(true);
      setSuccess("Application submitted successfully.");
    } catch (err) {
      setError(err.response?.data?.error || "Could not submit application.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <p>Loading opportunity...</p>;
  }

  if (!opportunity) {
    return <p>Opportunity not found.</p>;
  }

  return (
    <section className="opportunity-details">

      <Link to="/student/opportunities" className="opportunity-details__back">
        Back to opportunities
      </Link>

      <div className="opportunity-details__header">
        <h1>{opportunity.title}</h1>
        <h2>{opportunity.company_name}</h2>

        <div className="opportunity-details__tags">
          <span>{opportunity.location}</span>
          <span>{opportunity.employment_type}</span>
          {opportunity.category && <span>{opportunity.category}</span>}
        </div>
      </div>

      <div className="opportunity-details__body">

        <div className="opportunity-details__section">
          <h3>Description</h3>
          <p>{opportunity.description}</p>
        </div>

        {opportunity.required_skills && (
          <div className="opportunity-details__section">
            <h3>Required Skills</h3>
            <p>{opportunity.required_skills}</p>
          </div>
        )}

        {(opportunity.salary_min || opportunity.salary_max) && (
          <div className="opportunity-details__section">
            <h3>Salary Range</h3>
            <p>
              {opportunity.salary_min} - {opportunity.salary_max}
            </p>
          </div>
        )}

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <div className="opportunity-details__actions">

          <button
            className="opportunity-details__save"
            onClick={handleSaveToggle}
            disabled={busy}
          >
            {isSaved ? "Saved" : "Save Opportunity"}
          </button>

        </div>

        {hasApplied ? (
          <p className="opportunity-details__applied">
            You have already applied to this opportunity.
          </p>
        ) : (
          <form className="opportunity-details__apply-form" onSubmit={handleApply}>
            <h3>Apply for this opportunity</h3>

            <textarea
              placeholder="Add a short cover letter (optional)"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            ></textarea>

            <button type="submit" disabled={busy}>
              {busy ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        )}

      </div>

    </section>
  );
}

export default OpportunityDetails;