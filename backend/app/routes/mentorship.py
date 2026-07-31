from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models.mentorship_resource import MentorshipResource
from app.utils.current_user import current_user

mentorship_bp = Blueprint("mentorship", __name__)

RESOURCE_TYPES = ("video", "article")


@mentorship_bp.route("", methods=["GET"])
def list_resources():
    """Anyone can read the mentorship library."""
    query = MentorshipResource.query

    category = request.args.get("category")
    resource_type = request.args.get("type")

    if category:
        query = query.filter_by(category=category)

    if resource_type:
        query = query.filter_by(resource_type=resource_type)

    resources = query.order_by(MentorshipResource.created_at.desc()).all()

    return jsonify([resource.to_dict() for resource in resources]), 200


@mentorship_bp.route("/<int:resource_id>", methods=["GET"])
def get_resource(resource_id):
    resource = db.session.get(MentorshipResource, resource_id)

    if not resource:
        return jsonify({"error": "resource not found"}), 404

    return jsonify(resource.to_dict()), 200


@mentorship_bp.route("", methods=["POST"])
@jwt_required()
def create_resource():
    user = current_user()

    if not user or user.role != "admin":
        return jsonify({"error": "admin access required"}), 403

    data = request.get_json() or {}

    title = (data.get("title") or "").strip()
    content = (data.get("link") or data.get("content") or "").strip()
    resource_type = (data.get("resource_type") or "article").strip().lower()

    if not title:
        return jsonify({"error": "title is required"}), 400

    if resource_type not in RESOURCE_TYPES:
        return jsonify({
            "error": f"resource_type must be one of {', '.join(RESOURCE_TYPES)}"
        }), 400

    resource = MentorshipResource(
        title=title,
        category=(data.get("category") or "").strip() or None,
        content=content or None,
        resource_type=resource_type,
        published_by=user.id,
    )

    db.session.add(resource)
    db.session.commit()

    return jsonify(resource.to_dict()), 201


@mentorship_bp.route("/<int:resource_id>", methods=["PUT"])
@jwt_required()
def update_resource(resource_id):
    user = current_user()

    if not user or user.role != "admin":
        return jsonify({"error": "admin access required"}), 403

    resource = db.session.get(MentorshipResource, resource_id)

    if not resource:
        return jsonify({"error": "resource not found"}), 404

    data = request.get_json() or {}

    if "link" in data:
        resource.content = data["link"]

    for field in ("title", "category", "content", "resource_type"):
        if field in data:
            setattr(resource, field, data[field])

    db.session.commit()

    return jsonify(resource.to_dict()), 200


@mentorship_bp.route("/<int:resource_id>", methods=["DELETE"])
@jwt_required()
def delete_resource(resource_id):
    user = current_user()

    if not user or user.role != "admin":
        return jsonify({"error": "admin access required"}), 403

    resource = db.session.get(MentorshipResource, resource_id)

    if not resource:
        return jsonify({"error": "resource not found"}), 404

    db.session.delete(resource)
    db.session.commit()

    return jsonify({"message": "resource deleted"}), 200
