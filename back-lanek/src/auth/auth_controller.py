from flask import Blueprint, request, jsonify, make_response
from src.users.user_dto import RegisterUserSchema
from src.users.user_service import UserService
from src.auth.auth_service import AuthService
from src.auth.jwt_required import jwt_required

auth_bp = Blueprint('auth_bp', __name__)


@auth_bp.route('/auth/me', methods=['GET'])
@jwt_required
def me():
    """
    Devuelve los datos del usuario autenticado (name y email).
    ---
    tags:
        - Autenticación
    security:
        - Bearer: []
    responses:
        200:
            description: Datos del usuario
            schema:
                type: object
                properties:
                    name:
                        type: string
                        example: "user"
                    email:
                        type: string
                        example: "user@user.com"
        401:
            description: No autenticado
    """
    user_id = getattr(request, 'user_id', None)
    if not user_id:
        return jsonify({'error': 'No autenticado'}), 401
    user = UserService.get_user_by_id(user_id)
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    return jsonify(user), 200


@auth_bp.route('/auth/logout', methods=['POST'])
def logout():
    """
    Cierra la sesión del usuario eliminando la cookie JWT.
    ---
    tags:
        - Autenticación
    responses:
        200:
            description: Logout exitoso
    """
    resp = make_response(jsonify({'message': 'Logout exitoso'}))
    resp.set_cookie('lanek_jwt', '', expires=0,
                    httponly=True, samesite='Strict')
    return resp


@auth_bp.route('/auth/register', methods=['POST'])
def register():
    """
    Registra un nuevo usuario.
    ---
    tags:
        - Autenticación
    consumes:
        - application/json
    parameters:
        - in: body
          name: body
          required: true
          schema:
            type: object
            properties:
              name:
                type: string
                example: "Juan"
              email:
                type: string
                example: "juan@mail.com"
              password:
                type: string
                example: "secreto123"
    responses:
        201:
            description: Usuario creado
        400:
            description: Datos inválidos o email duplicado
    """
    data = request.get_json()
    schema = RegisterUserSchema()
    errors = schema.validate(data)
    if errors:
        return jsonify(errors), 400
    user = UserService.register_user(
        data['name'], data['email'], data['password'])
    if user is None:
        return jsonify({'error': 'El email ya está registrado'}), 400
    response = {
        'message': 'Registro exitoso',
        'code': 201,
        'user': {
            'name': user['name'],
            'email': user['email']
        }
    }
    return jsonify(response), 201


@auth_bp.route('/auth/login', methods=['POST'])
def login():
    """
    Inicia sesión y devuelve un JWT en una cookie.
    ---
    tags:
        - Autenticación
    consumes:
        - application/json
    parameters:
        - in: body
          name: body
          required: true
          schema:
            type: object
            properties:
              email:
                type: string
                example: "juan@mail.com"
              password:
                type: string
                example: "secreto123"
    responses:
        200:
            description: Login exitoso
        400:
            description: Faltan datos
        401:
            description: Credenciales inválidas
    """
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Faltan datos'}), 400
    token = AuthService.login(email, password)
    if not token:
        return jsonify({'error': 'Credenciales inválidas'}), 401
    user = UserService.get_user_by_email(email)
    response = {
        'message': 'Login exitoso',
        'code': 200,
        'user': {
            'name': user.name if user else None,
            'email': user.email if user else None
        }
    }
    resp = make_response(jsonify(response))
    resp.set_cookie('lanek_jwt', token, httponly=True, samesite='Strict')
    return resp
