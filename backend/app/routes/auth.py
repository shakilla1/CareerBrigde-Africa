from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)

from app.extensions import db
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.models.employer_profile import EmployerProfile
from app.utils.validators import (
    validate_email,
    validate_password,
    validate_full_name,
    validate_company_name,
)

auth_bp = Blueprint("auth", __name__)

ALLOWED_ROLES = ("student", "employer")


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}

    full_name = data.get("full_name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    role = data.get("role", "").strip().lower()

    if not all([full_name, email, password, role]):
        return jsonify({
            "error": "full_name, email, password and role are required"
        }), 400

    if role not in ALLOWED_ROLES:
        return jsonify({
            "error": "role must be either student or employer"
        }), 400

    if not validate_full_name(full_name):
        return jsonify({
            "error": "Please enter a valid full name."
        }), 400

    if not validate_email(email):
        return jsonify({
            "error": "Please enter a valid email address."
        }), 400

    valid_password, password_message = validate_password(password)

    if not valid_password:
        return jsonify({
            "error": password_message
        }), 400

    company_name = None

    if role == "employer":
        company_name = data.get("company_name", "").strip()

        if not validate_company_name(company_name):
            return jsonify({
                "error": "Please enter a valid company name."
            }), 400

    if User.query.filter_by(email=email).first():
        return jsonify({
            "error": "An account with this email already exists."
        }), 409

    user = User(
        full_name=full_name,
        email=email,
        role=role,
    )

    user.set_password(password)

    db.session.add(user)
    db.session.flush()

    if role == "student":
        profile = StudentProfile(user_id=user.id)
    else:
        profile = EmployerProfile(
            user_id=user.id,
            company_name=company_name,
        )

    db.session.add(profile)
    db.session.commit()

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
    )

    refresh_token = create_refresh_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
    )

    return jsonify({
        "message": "Account created successfully.",
        "user": user.to_dict(),
        "access_token": access_token,
        "refresh_token": refresh_token,
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({
            "error": "Email and password are required."
        }), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({
            "error": "Invalid email or password."
        }), 401

    if user.status == "suspended":
        return jsonify({
            "error": "This account has been suspended."
        }), 403

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
    )

    refresh_token = create_refresh_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
    )

    return jsonify({
        "message": "Login successful.",
        "user": user.to_dict(),
        "access_token": access_token,
        "refresh_token": refresh_token,
    }), 200


@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()

    user = db.session.get(User, int(identity))

    if not user:
        return jsonify({
            "error": "User not found."
        }), 404

    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role},
    )

    return jsonify({
        "access_token": access_token
    }), 200


@auth_bp.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    return jsonify({
        "message": "Logged out successfully."
    }), 200


@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    return jsonify({
        "error": "Not implemented yet."
    }), 501


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    return jsonify({
        "error": "Not implemented yet."
    }), 501