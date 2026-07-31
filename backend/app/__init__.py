import os

from flask import Flask, jsonify
from sqlalchemy import text

from config import config
from app.extensions import db, jwt, cors, migrate
from app.models import *
from app.cli import create_admin
from app.seed import seed_data


def create_app(env="development"):
    app = Flask(__name__)
    app.config.from_object(config.get(env, config["default"]))

    db.init_app(app)
    jwt.init_app(app)

    # Local dev, the deployed Vercel site, and any Vercel preview build.
    allowed_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://career-brigde-africa-8wtm-five.vercel.app",
    ]

    extra_origins = os.environ.get("FRONTEND_ORIGINS", "")
    for origin in extra_origins.split(","):
        origin = origin.strip()
        if origin and origin not in allowed_origins:
            allowed_origins.append(origin)

    # Preview deployments get a different subdomain on every push.
    allowed_origins.append(r"https://.*\.vercel\.app")

    cors.init_app(
        app,
        resources={r"/api/*": {"origins": allowed_origins}},
        supports_credentials=True,
    )

    migrate.init_app(app, db)
    app.cli.add_command(create_admin)
    app.cli.add_command(seed_data)

    register_blueprints(app)
    register_health_routes(app)
    register_error_handlers(app)

    if os.environ.get("AUTO_CREATE_TABLES", "1") == "1":
        create_tables_if_missing(app)

    return app


def create_tables_if_missing(app):
    """Create any tables that do not exist yet.

    On a fresh deploy the database is empty and nobody has run
    `flask db upgrade`, which makes every request fail with a 500.
    This only creates missing tables, it never drops or alters data.
    """
    with app.app_context():
        try:
            db.create_all()
        except Exception as error:  # noqa: BLE001 - must not stop the app booting
            app.logger.error("Could not create tables: %s", error)


def register_health_routes(app):
    @app.route("/")
    def index():
        return jsonify({
            "service": "CareerBridge Africa API",
            "status": "running",
            "docs": "All endpoints live under /api",
        }), 200

    @app.route("/api/health")
    def health():
        database_ok = True
        database_error = None

        try:
            db.session.execute(text("SELECT 1"))
        except Exception as error:  # noqa: BLE001
            database_ok = False
            database_error = str(error)

        return jsonify({
            "status": "ok" if database_ok else "degraded",
            "database": "connected" if database_ok else "unreachable",
            "database_error": database_error,
        }), 200 if database_ok else 503


def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found(_error):
        return jsonify({"error": "This endpoint does not exist."}), 404

    @app.errorhandler(405)
    def method_not_allowed(_error):
        return jsonify({"error": "Method not allowed for this endpoint."}), 405

    @app.errorhandler(500)
    def server_error(_error):
        db.session.rollback()
        return jsonify({"error": "Something went wrong on the server."}), 500


def register_blueprints(app):
    from app.routes.auth import auth_bp
    from app.routes.profile import profile_bp
    from app.routes.opportunities import opportunities_bp
    from app.routes.applications import applications_bp
    from app.routes.mentorship import mentorship_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(profile_bp, url_prefix="/api/profile")
    app.register_blueprint(opportunities_bp, url_prefix="/api/opportunities")
    app.register_blueprint(applications_bp, url_prefix="/api/applications")
    app.register_blueprint(mentorship_bp, url_prefix="/api/mentorship")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
