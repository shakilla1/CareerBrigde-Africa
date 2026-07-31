from flask_jwt_extended import get_jwt_identity
from app.extensions import db
from app.models.user import User


def current_user():
    """Return the User for the JWT in the request, or None.

    The token stores the identity as a string, so it has to be cast back
    to an int before it is used as a primary key.
    """
    identity = get_jwt_identity()

    if identity is None:
        return None

    try:
        user_id = int(identity)
    except (TypeError, ValueError):
        return None

    return db.session.get(User, user_id)
