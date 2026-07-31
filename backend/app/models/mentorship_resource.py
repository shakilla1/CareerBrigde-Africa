from datetime import datetime
from app.extensions import db


class MentorshipResource(db.Model):
    __tablename__ = "mentorship_resources"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    category = db.Column(db.String(50))
    content = db.Column(db.Text)
    resource_type = db.Column(db.String(30))
    published_by = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "category": self.category,
            "content": self.content,
            "link": self.content,
            "resource_type": self.resource_type,
            "created_at": self.created_at.isoformat(),
        }