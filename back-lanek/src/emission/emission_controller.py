
from flask import Blueprint, request, jsonify
from src.emission.emission_service import EmissionService
from src.auth.jwt_required import jwt_required
from src.emission_source.emission_source_service import get_emission_factor_by_id

emission_bp = Blueprint('emission_bp', __name__)

@emission_bp.route('/<int:record_id>', methods=['DELETE'])
@jwt_required
def delete_emission(record_id):
    """
    Elimina un registro de emisión del usuario autenticado.
    ---
    tags:
        - Emisiones
    parameters:
        - in: path
          name: record_id
          required: true
          type: integer
    responses:
        200:
            description: Registro eliminado correctamente
        404:
            description: Registro no encontrado
        401:
            description: No autorizado
    """
    user_id = request.user_id  # extraído del JWT
    success = EmissionService.delete(record_id, user_id)
    if not success:
        return jsonify({'error': 'Registro no encontrado'}), 404
    return jsonify({'message': 'Registro eliminado correctamente'}), 200



@emission_bp.route('/', methods=['POST'])
@jwt_required
def create_emission():
    """
    Crea un nuevo registro de emisión para el usuario autenticado.
    ---
    tags:
        - Emisiones
    consumes:
        - application/json
    parameters:
        - in: body
          name: body
          required: true
          schema:
            type: object
            properties:
                source_id:
                    type: integer
                    example: 1
                amount:
                    type: number
                    example: 100
                title:
                    type: string
                    example: Título de la emisión
                description:
                    type: string
                    example: Descripción de la emisión
    responses:
        201:
            description: Registro creado
        400:
            description: Datos inválidos
    """
    data = request.get_json()
    user_id = request.user_id  # extraído del JWT
    source_id = data.get('source_id')
    amount = data.get('amount')
    title = data.get('title')
    description = data.get('description')
    if not source_id or not amount or not title or not description:
        return jsonify({'error': 'source_id, amount, title y description son requeridos'}), 400
    emission_factor = get_emission_factor_by_id(source_id)
    record = EmissionService.create(
        user_id, source_id, amount, emission_factor, title, description
    )
    return jsonify(record.to_dict()), 201



@emission_bp.route('/<int:record_id>', methods=['PUT'])
@jwt_required
def update_emission(record_id):
    """
    Actualiza un registro de emisión del usuario autenticado.
    ---
    tags:
        - Emisiones
    consumes:
        - application/json
    parameters:
        - in: path
            name: record_id
            required: true
            type: integer
        - in: body
            name: body
            required: true
            schema:
                type: object
                properties:
                    source_id:
                        type: integer
                        example: 1
                    amount:
                        type: number
                        example: 100
                    title:
                        type: string
                        example: Título de la emisión
                    description:
                        type: string
                        example: Descripción de la emisión
    responses:
        200:
            description: Registro actualizado
        404:
            description: Registro no encontrado
        400:
            description: Datos inválidos
    """
    data = request.get_json()
    user_id = request.user_id  # extraído del JWT
    source_id = data.get('source_id')
    amount = data.get('amount')
    title = data.get('title')
    description = data.get('description')
    if not source_id or not amount or not title or not description:
        return jsonify({'error': 'source_id, amount, title y description son requeridos'}), 400
    record = EmissionService.update(
        record_id, user_id, source_id, amount, title, description)
    if not record:
        return jsonify({'error': 'Registro no encontrado'}), 404
    return jsonify(record.to_dict()), 200


@emission_bp.route('/', methods=['GET'])
@jwt_required
def get_user_emissions():
    """
    Devuelve todos los registros de emisión del usuario autenticado.
    ---
    tags:
        - Emisiones
    responses:
        200:
            description: Lista de registros
            schema:
                type: array
                items:
                    type: object
        401:
            description: No autorizado
    """
    user_id = request.user_id  # extraído del JWT
    records = EmissionService.get_by_user(user_id)
    return jsonify([r.to_dict() for r in records])
