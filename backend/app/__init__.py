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
                    os.environ.get("FRONTEND_URL")
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