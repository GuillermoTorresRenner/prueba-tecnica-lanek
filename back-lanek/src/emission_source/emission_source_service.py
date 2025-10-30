from src.emission_source.emission_source_model import EmissionSource


def get_emission_factor_by_id(source_id):
    source = EmissionSource.query.get(source_id)
    if source:
        return source.emission_factor
    return None


def get_all_sources():
    return EmissionSource.query.all()
