from datetime import datetime
from app.extensions import db


class Report(db.Model):
    __tablename__ = "reports"

    id = db.Column(db.Integer, primary_key=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    category = db.Column(db.String(50))
    reason = db.Column(db.Text)
    target_type = db.Column(db.String(30))
    target_id = db.Column(db.Integer)
    status = db.Column(db.String(20), default="new")
    flagged_at = db.Column(db.DateTime, default=datetime.utcnow)

    reporter = db.relationship("User")

    def to_dict(self):
        return {
            "id": self.id,
            "category": self.category,
            "reason": self.reason,
            "target_type": self.target_type,
            "target_id": self.target_id,
            "status": self.status,
            "flagged_at": self.flagged_at.isoformat(),
            "reporter_name": self.reporter.full_name if self.reporter else None,
        }