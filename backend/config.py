import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))

DEFAULT_DATABASE_URL = "mysql+pymysql://root:password@localhost/careerbridge_africa"


def normalise_database_url(url):
    """Make common hosted database URLs work without hand editing.

    Render, Heroku and several others hand out Postgres URLs beginning with
    "postgres://". SQLAlchemy dropped support for that prefix, so it has to be
    rewritten. Plain "postgresql://" is also given an explicit driver so the
    connection does not depend on which Postgres library happens to be
    installed first.
    """
    if not url:
        return DEFAULT_DATABASE_URL

    url = url.strip()

    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql+psycopg2://", 1)
    elif url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg2://", 1)
    elif url.startswith("mysql://"):
        url = url.replace("mysql://", "mysql+pymysql://", 1)

    return url


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "change-this-in-production")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "change-this-too")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    SQLALCHEMY_DATABASE_URI = normalise_database_url(
        os.environ.get("DATABASE_URL")
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Free database tiers close idle connections without telling the client.
    # Without these settings the first request after a quiet period fails with
    # "server has gone away" or "connection already closed".
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 280,
    }

    UPLOAD_FOLDER = os.path.join(basedir, "uploads")
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "default": DevelopmentConfig,
}
