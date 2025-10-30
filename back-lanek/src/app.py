"""
Archivo principal de la aplicación Flask Lanek.
Configura la app, la base de datos y registra los blueprints.
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from src.auth.auth_controller import auth_bp
from src.emission.emission_controller import emission_bp
from src.emission_source.emission_source_model import EmissionSource
from src.emission_source.emission_source_seeder import seed_emission_sources
from src.users.user_seeder import seed_default_user
from src.emission.emission_seeder import seed_emissions_for_default_user
from src.db_connection import db
from flasgger import Swagger
from dotenv import load_dotenv
from src.emission_source.emission_source_controller import emission_source_bp

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))


def create_app():
    """
    Crea y configura la instancia de la aplicación Flask.
    """
    app = Flask(__name__)
    swagger_template = {
        'swagger': '2.0',
        'info': {
            'title': 'API Lanek - Gestión de Emisiones',
            'description': 'Documentación interactiva para la API de Lanek. Consulta, registra y gestiona usuarios y emisiones.',
            'version': '1.0.0',
            'contact': {
                'responsibleOrganization': 'Lanek',
                'responsibleDeveloper': 'Guillermo Torres Renner',
                'email': 'contacto@guillermotorresdev.com',
                'url': 'https://guillermotorresdev.com'
            }
        },
        'basePath': 'http://localhost:5000/api',
        'schemes': ['http'],
        'securityDefinitions': {
            'Bearer': {
                'type': 'apiKey',
                'name': 'Authorization',
                'in': 'header',
                'description': 'Introduce el token JWT con el prefijo Bearer. Ejemplo: Bearer {token}'
            }
        },
        'security': [
            {'Bearer': []}
        ]
    }
    Swagger(app, template=swagger_template)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL') or (
        f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}"
        f"@{os.getenv('POSTGRES_HOST')}:{os.getenv('POSTGRES_PORT')}/{os.getenv('POSTGRES_DB')}"
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    CORS(app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
    )
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(emission_source_bp, url_prefix='/api/emission-source')
    app.register_blueprint(emission_bp, url_prefix='/api/emission')

    @app.route('/')
    def home():
        """Endpoint raíz de la API Lanek."""
        return '¡Bienvenido a la API Lanek!'

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'No encontrado'}), 404

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({'error': 'Error interno del servidor'}), 500

    return app


if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
        # Ejecutar seeder solo si no hay datos
        if EmissionSource.query.count() == 0:
            seed_emission_sources()
        seed_default_user()
        seed_emissions_for_default_user()
    app.run(host='0.0.0.0', port=5000)
