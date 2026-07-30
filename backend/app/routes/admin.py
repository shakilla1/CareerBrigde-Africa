from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.employer_profile import EmployerProfile

admin_bp = Blueprint("admin", __name__)

VALID_STATUSES = ("active", "suspended")


def get_current_admin():
    identity = get_jwt_identity()
    user = User.query.get(identity)
    if not user or user.role != "admin":
        return None
    return user


@admin_bp.route("/employer-verifications", methods=["GET"])
@jwt_required()
def list_employer_verifications():
    if not get_current_admin():
        return jsonify({"error": "admin access required"}), 403

    employers = EmployerProfile.query.all()

    result = []
    for employer in employers:
        result.append({
            "id": employer.id,
            "company_name": employer.company_name,
            "contact_name": employer.user.full_name if employer.user else None,
            "contact_email": employer.user.email if employer.user else None,
            "verification_status": employer.verification_status,
        })

    return jsonify(result), 200


@admin_bp.route("/employer-verifications/<int:employer_id>/approve", methods=["PUT"])
@jwt_required()
def approve_employer(employer_id):
    if not get_current_admin():
        return jsonify({"error": "admin access required"}), 403

    employer = EmployerProfile.query.get(employer_id)
    if not employer:
        return jsonify({"error": "employer not found"}), 404

    employer.verification_status = "approved"
    employer.verified_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "employer approved"}), 200


@admin_bp.route("/employer-verifications/<int:employer_id>/reject", methods=["PUT"])
@jwt_required()
def reject_employer(employer_id):
    if not get_current_admin():
        return jsonify({"error": "admin access required"}), 403

    employer = EmployerProfile.query.get(employer_id)
    if not employer:
        return jsonify({"error": "employer not found"}), 404

    employer.verification_status = "rejected"
    db.session.commit()

    return jsonify({"message": "employer rejected"}), 200


@admin_bp.route("/users", methods=["GET"])
@jwt_required()
def list_users():
    if not get_current_admin():
        return jsonify({"error": "admin access required"}), 403

    users = User.query.order_by(User.created_at.desc()).all()

    return jsonify([user.to_dict() for user in users]), 200


@admin_bp.route("/users/<int:user_id>/status", methods=["PUT"])
@jwt_required()
def update_user_status(user_id):
    admin = get_current_admin()
    if not admin:
        return jsonify({"error": "admin access required"}), 403

    if admin.id == user_id:
        return jsonify({"error": "you cannot change your own status"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "user not found"}), 404

    data = request.get_json() or {}
    new_status = data.get("status")

    if new_status not in VALID_STATUSES:
        return jsonify({"error": f"status must be one of {', '.join(VALID_STATUSES)}"}), 400

    user.status = new_status
    db.session.commit()

    return jsonify(user.to_dict()), 200