
from src.users.user_service import UserService
from src.users.user_model import User
from werkzeug.security import check_password_hash
import jwt
import os
from datetime import datetime, timedelta
from src.user_login.user_login_model import UserLogin
from src.db_connection import db


class AuthService:
    """
    Servicio de autenticación para login y generación de JWT.
    """
    @staticmethod
    def login(email, password):
        """
        Verifica credenciales y genera un JWT si son válidas.
        Además registra el login en la tabla user_logins.
        Args:
            email (str): Email del usuario.
            password (str): Contraseña en texto plano.
        Returns:
            str: JWT si es válido, None si no.
        """
    # ...existing code...
        user_obj = User.query.filter_by(email=email).first()
        if not user_obj:
            return None
        if not check_password_hash(user_obj.password, password):
            return None
        # Registrar el login
        login_record = UserLogin(user_id=user_obj.id)
        db.session.add(login_record)
        db.session.commit()
        payload = {
            'user_id': user_obj.id,
            'exp': datetime.utcnow() + timedelta(hours=2)
        }
        secret = os.getenv('JWT_SECRET', 'lanek_secret')
        token = jwt.encode(payload, secret, algorithm='HS256')
        if isinstance(token, bytes):
            token = token.decode('utf-8')
        return token
