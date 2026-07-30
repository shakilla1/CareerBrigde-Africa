from datetime import datetime
from app.extensions import db


class SavedOpportunity(db.Model):
    __tablename__ = "saved_opportunities"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("student_profiles.id"), nullable=False)
    opportunity_id = db.Column(db.Integer, db.ForeignKey("opportunities.id"), nullable=False)
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)

    opportunity = db.relationship("Opportunity")

    def to_dict(self):
        return {
            "id": self.id,
            "saved_at": self.saved_at.isoformat(),
            "opportunity": self.opportunity.to_dict() if self.opportunity else None,
        }