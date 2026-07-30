from datetime import datetime
from app.extensions import db


class StudentProfile(db.Model):
    __tablename__ = "student_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    skills = db.Column(db.Text)
    career_interests = db.Column(db.Text)
    resume_path = db.Column(db.String(255))
    resume_uploaded_at = db.Column(db.DateTime)

    education_history = db.relationship(
    "EducationEntry",
    backref="student_profile",
    cascade="all, delete-orphan",
    lazy=True,
    )

    applications = db.relationship(
    "Application",
    backref="student_profile",
    cascade="all, delete-orphan",
    lazy=True,
    )

    def profile_strength(self):
        fields_to_check = [self.skills, self.career_interests, self.resume_path]
        completed = sum(1 for field in fields_to_check if field)
        has_education = len(self.education_history) > 0
        total_points = len(fields_to_check) + 1
        earned_points = completed + (1 if has_education else 0)
        return round((earned_points / total_points) * 100)

    def to_dict(self):
        return {
            "id": self.id,
            "skills": self.skills,
            "career_interests": self.career_interests,
            "resume_path": self.resume_path,
            "profile_strength": self.profile_strength(),
            "education_history": [entry.to_dict() for entry in self.education_history],
        }


class EducationEntry(db.Model):
    __tablename__ = "education_entries"

    id = db.Column(db.Integer, primary_key=True)
    student_profile_id = db.Column(
        db.Integer, db.ForeignKey("student_profiles.id"), nullable=False
    )
    institution = db.Column(db.String(150), nullable=False)
    field_of_study = db.Column(db.String(150))
    start_year = db.Column(db.Integer)
    end_year = db.Column(db.Integer)

    def to_dict(self):
        return {
            "id": self.id,
            "institution": self.institution,
            "field_of_study": self.field_of_study,
            "start_year": self.start_year,
            "end_year": self.end_year,
        }