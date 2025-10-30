from src.db_connection import db
from src.emission.emission_model import EmissionRecord


class EmissionService:
    @staticmethod
    def get_by_id(record_id, user_id):
        return EmissionRecord.query.filter_by(id=record_id, user_id=user_id).first()

    @staticmethod
    def update(record_id, user_id, source_id, amount, title, description):
        record = EmissionRecord.query.filter_by(
            id=record_id, user_id=user_id).first()
        if not record:
            return None
        record.source_id = source_id
        record.amount = amount
        record.title = title
        record.description = description
        # Recalcular emission_factor y co2e
        from src.emission_source.emission_source_service import get_emission_factor_by_id
        emission_factor = get_emission_factor_by_id(source_id)
        record.calculated_co2e = float(amount) * float(emission_factor)
        db.session.commit()
        return record

    @staticmethod
    def delete(record_id, user_id):
        record = EmissionRecord.query.filter_by(
            id=record_id, user_id=user_id).first()
        if not record:
            return False
        db.session.delete(record)
        db.session.commit()
        return True
    # Servicio para operaciones sobre registros de emisiones.

    @staticmethod
    def create(user_id, source_id, amount, emission_factor, title, description, recorded_at=None):
        calculated_co2e = float(amount) * float(emission_factor)
        record = EmissionRecord(
            user_id=user_id,
            source_id=source_id,
            amount=amount,
            calculated_co2e=calculated_co2e,
            title=title,
            description=description,
            recorded_at=recorded_at
        )
        db.session.add(record)
        db.session.commit()
        return record

    @staticmethod
    def get_by_user(user_id):
        return EmissionRecord.query.filter_by(user_id=user_id).all()

    @staticmethod
    def get_all():
        return EmissionRecord.query.all()
