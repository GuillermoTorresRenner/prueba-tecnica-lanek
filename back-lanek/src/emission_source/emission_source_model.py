from src.db_connection import db


class EmissionSource(db.Model):
    """
    Modelo para fuentes de emisión con factor y fuente de referencia.
    """
    __tablename__ = 'emission_sources'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, nullable=False)
    unit = db.Column(db.String(32), nullable=False)
    emission_factor = db.Column(db.Numeric(12, 3), nullable=False)
    reference = db.Column(db.String(128), nullable=False)
