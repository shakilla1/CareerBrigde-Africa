from datetime import datetime
from app.extensions import db


class Opportunity(db.Model):
    __tablename__ = "opportunities"

    id = db.Column(db.Integer, primary_key=True)
    employer_id = db.Column(db.Integer, db.ForeignKey("employer_profiles.id"), nullable=False)

    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    location = db.Column(db.String(150))
    employment_type = db.Column(db.String(30))
    category = db.Column(db.String(100))
    salary_min = db.Column(db.Integer)
    salary_max = db.Column(db.Integer)
    required_skills = db.Column(db.Text)
    deadline = db.Column(db.Date)
    status = db.Column(db.String(20), default="open")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    applications = db.relationship(
    "Application",
    backref="opportunity",
    cascade="all, delete-orphan",
    lazy=True,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "location": self.location,
            "employment_type": self.employment_type,
            "category": self.category,
            "salary_min": self.salary_min,
            "salary_max": self.salary_max,
            "required_skills": self.required_skills,
            "deadline": self.deadline.isoformat() if self.deadline else None,
            "status": self.status,
            "company_name": self.employer.company_name if self.employer else None,
        }