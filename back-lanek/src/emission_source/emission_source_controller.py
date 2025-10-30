from flask import Blueprint, jsonify
from src.emission_source.emission_source_service import get_all_sources

emission_source_bp = Blueprint(
    'emission_source', __name__)


@emission_source_bp.route('/', methods=['GET'])
def get_sources():
    sources = get_all_sources()
    result = [
        {
            'id': s.id,
            'name': s.name,
            'emission_factor': s.emission_factor
        } for s in sources
    ]
    return jsonify(result), 200
