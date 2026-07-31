from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.utils.current_user import current_user
from app.models.application import Application
from app.models.notification import Notification

applications_bp = Blueprint("applications", __name__)

VALID_STATUSES = ("submitted", "under_review", "interviewing", "offered", "rejected", "withdrawn")


def get_current_user():
    return current_user()


@applications_bp.route("", methods=["GET"])
@jwt_required()
def list_my_applications():
    user = get_current_user()

    if not user or user.role != "student" or not user.student_profile:
        return jsonify({"error": "only students can view their applications"}), 403

    applications = Application.query.filter_by(student_id=user.student_profile.id).order_by(
        Application.applied_at.desc()
    ).all()

    return jsonify([a.to_dict() for a in applications]), 200


@applications_bp.route("/<int:application_id>", methods=["GET"])
@jwt_required()
def get_application(application_id):
    user = get_current_user()
    application = Application.query.get(application_id)

    if not application:
        return jsonify({"error": "application not found"}), 404

    is_owner = user.student_profile and application.student_id == user.student_profile.id
    is_employer_of_posting = (
        user.employer_profile
        and application.opportunity.employer_id == user.employer_profile.id
    )

    if not (is_owner or is_employer_of_posting):
        return jsonify({"error": "not authorized to view this application"}), 403

    return jsonify(application.to_dict()), 200


@applications_bp.route("/<int:application_id>/withdraw", methods=["PUT"])
@jwt_required()
def withdraw_application(application_id):
    user = get_current_user()
    application = Application.query.get(application_id)

    if not application:
        return jsonify({"error": "application not found"}), 404

    if not user.student_profile or application.student_id != user.student_profile.id:
        return jsonify({"error": "not authorized to withdraw this application"}), 403

    application.status = "withdrawn"
    db.session.commit()

    return jsonify(application.to_dict()), 200


@applications_bp.route("/<int:application_id>/status", methods=["PUT"])
@jwt_required()
def update_application_status(application_id):
    user = get_current_user()
    application = Application.query.get(application_id)

    if not application:
        return jsonify({"error": "application not found"}), 404

    opportunity = application.opportunity
    if not user.employer_profile or opportunity.employer_id != user.employer_profile.id:
        return jsonify({"error": "not authorized to update this application"}), 403

    data = request.get_json() or {}
    new_status = data.get("status")

    if new_status not in VALID_STATUSES:
        return jsonify({"error": f"status must be one of {', '.join(VALID_STATUSES)}"}), 400

    application.status = new_status
    db.session.add(application)

    student_user = User.query.filter_by(
        id=application.student_profile.user_id
    ).first() if application.student_profile else None

    if student_user:
        notification = Notification(
            user_id=student_user.id,
            message=f"Your application for {opportunity.title} is now {new_status.replace('_', ' ')}",
        )
        db.session.add(notification)

    db.session.commit()

    return jsonify(application.to_dict()), 200