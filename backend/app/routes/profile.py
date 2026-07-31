import os
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from werkzeug.utils import secure_filename
from app.extensions import db
from app.models.user import User
from app.utils.current_user import current_user
from app.models.student_profile import StudentProfile, EducationEntry
from app.models.employer_profile import EmployerProfile

profile_bp = Blueprint("profile", __name__)

ALLOWED_RESUME_EXTENSIONS = {"pdf", "doc", "docx"}


def allowed_file(filename, allowed_extensions):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed_extensions


def get_current_user():
    return current_user()


@profile_bp.route("", methods=["GET"])
@jwt_required()
def get_profile():
    user = get_current_user()

    if not user:
        return jsonify({"error": "user not found"}), 404

    data = user.to_dict()

    if user.role == "student":
        data["profile"] = user.student_profile.to_dict() if user.student_profile else None
    elif user.role == "employer":
        data["profile"] = user.employer_profile.to_dict() if user.employer_profile else None

    return jsonify(data), 200


@profile_bp.route("", methods=["PUT"])
@jwt_required()
def update_profile():
    user = get_current_user()

    if not user:
        return jsonify({"error": "user not found"}), 404

    data = request.get_json() or {}

    if "full_name" in data:
        user.full_name = data["full_name"]

    if user.role == "student" and user.student_profile:
        profile = user.student_profile
        if "skills" in data:
            profile.skills = data["skills"]
        if "career_interests" in data:
            profile.career_interests = data["career_interests"]

    elif user.role == "employer" and user.employer_profile:
        profile = user.employer_profile
        if "company_name" in data:
            profile.company_name = data["company_name"]
        if "industry" in data:
            profile.industry = data["industry"]
        if "location" in data:
            profile.location = data["location"]
        if "about" in data:
            profile.about = data["about"]

    db.session.commit()

    return jsonify({"message": "profile updated"}), 200


@profile_bp.route("/education", methods=["POST"])
@jwt_required()
def add_education():
    user = get_current_user()

    if not user or user.role != "student":
        return jsonify({"error": "only students can add education entries"}), 403

    data = request.get_json() or {}
    institution = data.get("institution")

    if not institution:
        return jsonify({"error": "institution is required"}), 400

    entry = EducationEntry(
        student_profile_id=user.student_profile.id,
        institution=institution,
        field_of_study=data.get("field_of_study"),
        start_year=data.get("start_year"),
        end_year=data.get("end_year"),
    )
    db.session.add(entry)
    db.session.commit()

    return jsonify(entry.to_dict()), 201


@profile_bp.route("/education/<int:entry_id>", methods=["PUT"])
@jwt_required()
def update_education(entry_id):
    user = get_current_user()
    entry = EducationEntry.query.get(entry_id)

    if not entry or entry.student_profile_id != user.student_profile.id:
        return jsonify({"error": "education entry not found"}), 404

    data = request.get_json() or {}

    if "institution" in data:
        entry.institution = data["institution"]
    if "field_of_study" in data:
        entry.field_of_study = data["field_of_study"]
    if "start_year" in data:
        entry.start_year = data["start_year"]
    if "end_year" in data:
        entry.end_year = data["end_year"]

    db.session.commit()

    return jsonify(entry.to_dict()), 200


@profile_bp.route("/education/<int:entry_id>", methods=["DELETE"])
@jwt_required()
def delete_education(entry_id):
    user = get_current_user()
    entry = EducationEntry.query.get(entry_id)

    if not entry or entry.student_profile_id != user.student_profile.id:
        return jsonify({"error": "education entry not found"}), 404

    db.session.delete(entry)
    db.session.commit()

    return jsonify({"message": "education entry deleted"}), 200


@profile_bp.route("/resume", methods=["POST"])
@jwt_required()
def upload_resume():
    user = get_current_user()

    if not user or user.role != "student":
        return jsonify({"error": "only students can upload a resume"}), 403

    if "file" not in request.files:
        return jsonify({"error": "no file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "no file selected"}), 400

    if not allowed_file(file.filename, ALLOWED_RESUME_EXTENSIONS):
        return jsonify({"error": "only pdf, doc, and docx files are allowed"}), 400

    os.makedirs(current_app.config["UPLOAD_FOLDER"], exist_ok=True)

    filename = secure_filename(f"resume_{user.id}_{file.filename}")
    filepath = os.path.join(current_app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    user.student_profile.resume_path = filename
    user.student_profile.resume_uploaded_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "resume uploaded", "resume_path": filename}), 200


@profile_bp.route("/resume", methods=["GET"])
@jwt_required()
def get_resume():
    user = get_current_user()

    if not user or not user.student_profile or not user.student_profile.resume_path:
        return jsonify({"error": "no resume uploaded"}), 404

    return send_from_directory(
        current_app.config["UPLOAD_FOLDER"], user.student_profile.resume_path
    )


@profile_bp.route("/resume", methods=["DELETE"])
@jwt_required()
def delete_resume():
    user = get_current_user()

    if not user or not user.student_profile or not user.student_profile.resume_path:
        return jsonify({"error": "no resume to delete"}), 404

    filepath = os.path.join(current_app.config["UPLOAD_FOLDER"], user.student_profile.resume_path)

    if os.path.exists(filepath):
        os.remove(filepath)

    user.student_profile.resume_path = None
    user.student_profile.resume_uploaded_at = None
    db.session.commit()

    return jsonify({"message": "resume deleted"}), 200

@profile_bp.route("/dashboard", methods=["GET"])
@jwt_required()
def dashboard_summary():
    """Real counters for the dashboard cards, per role."""
    from app.models.opportunity import Opportunity
    from app.models.application import Application
    from app.models.saved_opportunity import SavedOpportunity
    from app.models.mentorship_resource import MentorshipResource

    user = get_current_user()

    if not user:
        return jsonify({"error": "user not found"}), 404

    if user.role == "student":
        profile = user.student_profile

        applications = 0
        saved = 0
        profile_strength = 0

        if profile:
            applications = Application.query.filter_by(student_id=profile.id).count()
            saved = SavedOpportunity.query.filter_by(student_id=profile.id).count()
            profile_strength = profile.profile_strength()

        return jsonify({
            "role": "student",
            "applications": applications,
            "saved_opportunities": saved,
            "available_opportunities": Opportunity.query.filter_by(status="open").count(),
            "mentorship_resources": MentorshipResource.query.count(),
            "profile_completion": profile_strength,
        }), 200

    if user.role == "employer":
        profile = user.employer_profile

        if not profile:
            return jsonify({"error": "employer profile not found"}), 404

        opportunity_ids = [
            row.id for row in Opportunity.query.filter_by(employer_id=profile.id).all()
        ]

        applications_received = 0
        shortlisted = 0

        if opportunity_ids:
            applications_received = Application.query.filter(
                Application.opportunity_id.in_(opportunity_ids)
            ).count()

            shortlisted = Application.query.filter(
                Application.opportunity_id.in_(opportunity_ids),
                Application.status.in_(("interviewing", "offered")),
            ).count()

        return jsonify({
            "role": "employer",
            "posted_opportunities": len(opportunity_ids),
            "open_positions": Opportunity.query.filter_by(
                employer_id=profile.id, status="open"
            ).count(),
            "applications_received": applications_received,
            "shortlisted": shortlisted,
            "verification_status": profile.verification_status,
        }), 200

    return jsonify({"role": user.role}), 200
