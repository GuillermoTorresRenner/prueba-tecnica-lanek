from flask import Blueprint, jsonify, request
from users.user_service import UserService
from users.user_dto import RegisterUserSchema

user_bp = Blueprint('user_bp', __name__)


@user_bp.route('/users', methods=['GET'])
def list_users():
    """Endpoint para obtener todos los usuarios."""
    return jsonify(UserService.get_all_users())


@user_bp.route('/register', methods=['POST'])
def register():
    """Endpoint para registrar un usuario."""
    data = request.get_json()
    schema = RegisterUserSchema()
    errors = schema.validate(data)
    if errors:
        return jsonify(errors), 400
    user = UserService.register_user(
        data['name'], data['email'], data['password'])
    if user is None:
        return jsonify({'error': 'El email ya está registrado'}), 400
    return jsonify(user), 201
