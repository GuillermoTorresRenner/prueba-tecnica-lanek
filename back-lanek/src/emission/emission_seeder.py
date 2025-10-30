from src.db_connection import db
from src.emission.emission_service import EmissionService
from src.users.user_model import User
from src.emission_source.emission_source_model import EmissionSource
from datetime import datetime, timedelta


def seed_emissions_for_default_user():
    """
    Crea 50 registros de emisiones para el usuario por defecto si no existen.
    """
    user = User.query.filter_by(email="user@user.com").first()
    if not user:
        return
    # Verifica si ya existen registros
    from src.emission.emission_model import EmissionRecord
    if EmissionRecord.query.filter_by(user_id=user.id).count() >= 50:
        return
    sources = EmissionSource.query.all()
    if not sources:
        return
    for i in range(50):
        source = sources[i % len(sources)]
        amount = 10 + i
        emission_factor = source.emission_factor if source else 1.0
        title = f"Emisión de prueba {i+1}" if source else "Emisión migrada"
        description = f"Registro automático de emisión para el usuario por defecto, fuente: {getattr(source, 'name', 'desconocida')}, cantidad: {amount}" if source else "Registro migrado sin fuente."
        EmissionService.create(
            user.id,
            source.id if source else 1,
            amount,
            emission_factor,
            title,
            description,
            datetime.utcnow() + timedelta(days=i)
        )
    db.session.commit()
