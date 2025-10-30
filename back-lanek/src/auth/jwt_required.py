from functools import wraps
from flask import request, jsonify
import jwt
import os


def jwt_required(f):
    """
    Decorador para proteger endpoints con JWT.
    Obtiene el user_id del token y lo agrega a request.user_id.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method in ['OPTIONS', 'HEAD']:
            return '', 200
        token = request.cookies.get('lanek_jwt')
        if not token:
            return jsonify({'error': 'Token faltante'}), 401
        try:
            payload = jwt.decode(token, os.getenv('JWT_SECRET', 'lanek_secret'), algorithms=['HS256'])
            request.user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expirado'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token inválido'}), 401
        return f(*args, **kwargs)
    return decorated_function
