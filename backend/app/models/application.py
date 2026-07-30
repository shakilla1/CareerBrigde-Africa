from datetime import datetime
from app.extensions import db


class Application(db.Model):
    __tablename__ = "applications"

    __table_args__ = (
       db.UniqueConstraint(
          "student_id",
          "opportunity_id",
          name="unique_application",
        ),
    )

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("student_profiles.id"), nullable=False)
    opportunity_id = db.Column(db.Integer, db.ForeignKey("opportunities.id"), nullable=False)

    cover_letter = db.Column(db.Text)
    status = db.Column(db.String(30), default="submitted")
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        applicant = None
        if self.student_profile and self.student_profile.user:
            applicant = {
                "id": self.student_profile.user.id,
                "full_name": self.student_profile.user.full_name,
                "email": self.student_profile.user.email,
                "skills": self.student_profile.skills,
                "resume_path": self.student_profile.resume_path,
            }

        return {
            "id": self.id,
            "status": self.status,
            "cover_letter": self.cover_letter,
            "applied_at": self.applied_at.isoformat(),
            "opportunity": self.opportunity.to_dict() if self.opportunity else None,
            "applicant": applicant,
        }