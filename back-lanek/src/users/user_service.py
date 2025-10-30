from src.db_connection import db
from src.users.user_model import User
from werkzeug.security import generate_password_hash


class UserService:
    @staticmethod
    def get_user_by_email(email):
        """
        Obtiene un usuario por su email.
        Args:
            email (str): Email del usuario.
        Returns:
            object: Instancia de usuario o None si no existe.
        """
        return User.query.filter_by(email=email).first()

    @staticmethod
    def get_user_by_id(user_id):
        """
        Obtiene un usuario por su id.
        Args:
            user_id (int): ID del usuario.
        Returns:
            dict: Datos del usuario (name, email) o None si no existe.
        """
        user = User.query.get(user_id)
        if user:
            return {'name': user.name, 'email': user.email}
        return None
    """
    Servicio para operaciones de usuario.
    Ejemplo de uso:
        users = UserService.get_all_users()
        user = UserService.register_user('Juan', 'juan@mail.com', 'secreto123')
    """

    @staticmethod
    def get_all_users():
        """
        Obtiene todos los usuarios registrados en la base de datos.
        Returns:
            list: Lista de diccionarios con los datos de cada usuario.
        """
        return [user.to_dict() for user in User.query.all()]

    @staticmethod
    def register_user(name, email, password):
        """
        Registra un nuevo usuario en la base de datos si el email no existe.
        Args:
            name (str): Nombre del usuario.
            email (str): Email del usuario.
            password (str): Contraseña en texto plano.
        Returns:
            dict: Datos del usuario registrado.
            None: Si el email ya está registrado.
        """
        if User.query.filter_by(email=email).first():
            return None
        hashed_password = generate_password_hash(password)
        user = User(name=name, email=email, password=hashed_password)
        db.session.add(user)
        db.session.commit()
        return user.to_dict()
