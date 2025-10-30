from src.users.user_service import UserService
from src.db_connection import db


def seed_default_user():
    """
    Crea el usuario por defecto si no existe.
    """
    from src.users.user_model import User
    if not User.query.filter_by(email="user@user.com").first():
        UserService.register_user("user", "user@user.com", "user")
        db.session.commit()
