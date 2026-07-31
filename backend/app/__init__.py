from flask import Flask
from config import config
from app.extensions import db, jwt, cors, migrate
from app.models import *
from app.cli import create_admin
from app.seed import seed_data
import os


def create_app(env="development"):
    app = Flask(__name__)
    app.config.from_object(config[env])

    db.init_app(app)
    jwt.init_app(app)

    cors.init_app(
        app,
        resources={
            r"/api/*": {
                "origins": [
                "http://localhost:5173",
                "https://career-brigde-africa-8wtm-five.vercel.app",

              ]
            }
        },
        supports_credentials=True,
    )

    migrate.init_app(app, db)
    app.cli.add_command(create_admin)
    app.cli.add_command(seed_data)

    register_blueprints(app)

    return app


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