from datetime import datetime
from app.extensions import db


class EmployerProfile(db.Model):
    __tablename__ = "employer_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    company_name = db.Column(db.String(150), nullable=False)
    industry = db.Column(db.String(100))
    location = db.Column(db.String(150))
    about = db.Column(db.Text)
    logo_path = db.Column(db.String(255))

    verification_document_path = db.Column(db.String(255))
    verification_status = db.Column(db.String(20), default="pending")
    verified_at = db.Column(db.DateTime)

    opportunities = db.relationship(
    "Opportunity",
    backref="employer",
    cascade="all, delete-orphan",
    lazy=True,
    )
    def to_dict(self):
        return {
            "id": self.id,
            "company_name": self.company_name,
            "industry": self.industry,
            "location": self.location,
            "about": self.about,
            "logo_path": self.logo_path,
            "verification_status": self.verification_status,
        }