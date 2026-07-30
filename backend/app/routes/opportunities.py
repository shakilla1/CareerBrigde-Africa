from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.opportunity import Opportunity
from app.models.saved_opportunity import SavedOpportunity
from app.models.application import Application
from app.models.notification import Notification

opportunities_bp = Blueprint("opportunities", __name__)


def get_current_user():
    identity = get_jwt_identity()
    return User.query.get(identity) if identity else None


@opportunities_bp.route("", methods=["GET"])
def list_opportunities():
    query = Opportunity.query.filter_by(status="open")

    search = request.args.get("query")
    location = request.args.get("location")
    employment_type = request.args.get("type")

    if search:
        query = query.filter(Opportunity.title.ilike(f"%{search}%"))
    if location:
        query = query.filter(Opportunity.location.ilike(f"%{location}%"))
    if employment_type:
        query = query.filter_by(employment_type=employment_type)

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    paginated = query.order_by(Opportunity.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        "opportunities": [o.to_dict() for o in paginated.items],
        "total": paginated.total,
        "page": page,
        "pages": paginated.pages,
    }), 200


@opportunities_bp.route("/<int:opportunity_id>", methods=["GET"])
def get_opportunity(opportunity_id):
    opportunity = Opportunity.query.get(opportunity_id)

    if not opportunity:
        return jsonify({"error": "opportunity not found"}), 404

    return jsonify(opportunity.to_dict()), 200


@opportunities_bp.route("", methods=["POST"])
@jwt_required()
def create_opportunity():
    user = get_current_user()

    if not user or user.role != "employer":
        return jsonify({"error": "only employers can post opportunities"}), 403

    if not user.employer_profile:
        return jsonify({"error": "employer profile not found"}), 404

    if user.employer_profile.verification_status != "approved":
        return jsonify({"error": "your account must be verified before posting opportunities"}), 403

    data = request.get_json() or {}
    title = data.get("title")
    description = data.get("description")

    if not title or not description:
        return jsonify({"error": "title and description are required"}), 400

    deadline = None
    if data.get("deadline"):
        try:
            deadline = datetime.strptime(data["deadline"], "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "deadline must be in YYYY-MM-DD format"}), 400

    opportunity = Opportunity(
        employer_id=user.employer_profile.id,
        title=title,
        description=description,
        location=data.get("location"),
        employment_type=data.get("employment_type"),
        category=data.get("category"),
        salary_min=data.get("salary_min"),
        salary_max=data.get("salary_max"),
        required_skills=data.get("required_skills"),
        deadline=deadline,
    )
    db.session.add(opportunity)
    db.session.commit()

    return jsonify(opportunity.to_dict()), 201


@opportunities_bp.route("/<int:opportunity_id>", methods=["PUT"])
@jwt_required()
def update_opportunity(opportunity_id):
    user = get_current_user()
    opportunity = Opportunity.query.get(opportunity_id)

    if not opportunity:
        return jsonify({"error": "opportunity not found"}), 404

    if not user.employer_profile or opportunity.employer_id != user.employer_profile.id:
        return jsonify({"error": "you do not have permission to edit this opportunity"}), 403

    data = request.get_json() or {}

    for field in ("title", "description", "location", "employment_type", "category",
                  "salary_min", "salary_max", "required_skills", "status"):
        if field in data:
            setattr(opportunity, field, data[field])

    if "deadline" in data and data["deadline"]:
        try:
            opportunity.deadline = datetime.strptime(data["deadline"], "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "deadline must be in YYYY-MM-DD format"}), 400

    db.session.commit()

    return jsonify(opportunity.to_dict()), 200


@opportunities_bp.route("/<int:opportunity_id>", methods=["DELETE"])
@jwt_required()
def delete_opportunity(opportunity_id):
    user = get_current_user()
    opportunity = Opportunity.query.get(opportunity_id)

    if not opportunity:
        return jsonify({"error": "opportunity not found"}), 404

    if not user.employer_profile or opportunity.employer_id != user.employer_profile.id:
        return jsonify({"error": "you do not have permission to delete this opportunity"}), 403

    db.session.delete(opportunity)
    db.session.commit()

    return jsonify({"message": "opportunity deleted"}), 200


@opportunities_bp.route("/mine", methods=["GET"])
@jwt_required()
def my_opportunities():
    user = get_current_user()

    if not user or user.role != "employer" or not user.employer_profile:
        return jsonify({"error": "only employers can view their own postings"}), 403

    opportunities = Opportunity.query.filter_by(employer_id=user.employer_profile.id).order_by(
        Opportunity.created_at.desc()
    ).all()

    return jsonify([o.to_dict() for o in opportunities]), 200


@opportunities_bp.route("/saved", methods=["GET"])
@jwt_required()
def list_saved_opportunities():
    user = get_current_user()

    if not user or user.role != "student" or not user.student_profile:
        return jsonify({"error": "only students can save opportunities"}), 403

    saved = SavedOpportunity.query.filter_by(student_id=user.student_profile.id).all()

    return jsonify([s.to_dict() for s in saved]), 200


@opportunities_bp.route("/<int:opportunity_id>/save", methods=["POST"])
@jwt_required()
def save_opportunity(opportunity_id):
    user = get_current_user()

    if not user or user.role != "student" or not user.student_profile:
        return jsonify({"error": "only students can save opportunities"}), 403

    opportunity = Opportunity.query.get(opportunity_id)
    if not opportunity:
        return jsonify({"error": "opportunity not found"}), 404

    existing = SavedOpportunity.query.filter_by(
        student_id=user.student_profile.id, opportunity_id=opportunity_id
    ).first()

    if existing:
        return jsonify({"message": "already saved"}), 200

    saved = SavedOpportunity(student_id=user.student_profile.id, opportunity_id=opportunity_id)
    db.session.add(saved)
    db.session.commit()

    return jsonify(saved.to_dict()), 201


@opportunities_bp.route("/<int:opportunity_id>/save", methods=["DELETE"])
@jwt_required()
def unsave_opportunity(opportunity_id):
    user = get_current_user()

    if not user or not user.student_profile:
        return jsonify({"error": "not authorized"}), 403

    saved = SavedOpportunity.query.filter_by(
        student_id=user.student_profile.id, opportunity_id=opportunity_id
    ).first()

    if not saved:
        return jsonify({"error": "not found in saved opportunities"}), 404

    db.session.delete(saved)
    db.session.commit()

    return jsonify({"message": "removed from saved opportunities"}), 200


@opportunities_bp.route("/<int:opportunity_id>/apply", methods=["POST"])
@jwt_required()
def apply_to_opportunity(opportunity_id):
    user = get_current_user()

    if not user or user.role != "student" or not user.student_profile:
        return jsonify({"error": "only students can apply to opportunities"}), 403

    opportunity = Opportunity.query.get(opportunity_id)
    if not opportunity:
        return jsonify({"error": "opportunity not found"}), 404

    if opportunity.status != "open":
        return jsonify({"error": "this opportunity is no longer accepting applications"}), 400

    existing = Application.query.filter_by(
        student_id=user.student_profile.id, opportunity_id=opportunity_id
    ).first()

    if existing:
        return jsonify({"error": "you have already applied to this opportunity"}), 409

    data = request.get_json() or {}

    application = Application(
        student_id=user.student_profile.id,
        opportunity_id=opportunity_id,
        cover_letter=data.get("cover_letter"),
    )
    db.session.add(application)

    employer_user = User.query.filter_by(
        id=opportunity.employer.user_id
    ).first() if opportunity.employer else None

    if employer_user:
        notification = Notification(
            user_id=employer_user.id,
            message=f"New application received for {opportunity.title}",
        )
        db.session.add(notification)

    db.session.commit()

    return jsonify(application.to_dict()), 201


@opportunities_bp.route("/<int:opportunity_id>/applicants", methods=["GET"])
@jwt_required()
def get_applicants(opportunity_id):
    user = get_current_user()
    opportunity = Opportunity.query.get(opportunity_id)

    if not opportunity:
        return jsonify({"error": "opportunity not found"}), 404

    if not user.employer_profile or opportunity.employer_id != user.employer_profile.id:
        return jsonify({"error": "not authorized to view these applicants"}), 403

    applications = Application.query.filter_by(opportunity_id=opportunity_id).order_by(
        Application.applied_at.desc()
    ).all()

    return jsonify([a.to_dict() for a in applications]), 200