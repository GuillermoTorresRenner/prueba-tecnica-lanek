from src.db_connection import db
from datetime import datetime


class EmissionRecord(db.Model):
    """
    Modelo para registros de emisiones de usuario.
    """
    __tablename__ = 'emission_records'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    source_id = db.Column(db.Integer, db.ForeignKey(
        'emission_sources.id'), nullable=False)
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    calculated_co2e = db.Column(db.Numeric(12, 2), nullable=False)
    title = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text, nullable=False)
    recorded_at = db.Column(db.DateTime, nullable=False,
                            default=datetime.utcnow)
    created_at = db.Column(db.DateTime, nullable=False,
                           default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'source_id': self.source_id,
            'amount': float(self.amount),
            'calculated_co2e': float(self.calculated_co2e),
            'title': self.title,
            'description': self.description,
            'recorded_at': self.recorded_at.isoformat() if self.recorded_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
