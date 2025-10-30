from src.db_connection import db
from src.emission_source.emission_source_model import EmissionSource


def seed_emission_sources():
    data = [
        {"name": "Electricidad (promedio Chile)", "unit": "kWh",
         "emission_factor": 0.35, "reference": "AChEE / Chile 2023"},
        {"name": "Gasolina", "unit": "L",
            "emission_factor": 2.31, "reference": "IPCC / DEFRA"},
        {"name": "Diésel", "unit": "L", "emission_factor": 2.68, "reference": "IPCC"},
        {"name": "Gas Natural", "unit": "m³",
            "emission_factor": 2.00, "reference": "IPCC"},
        {"name": "Transporte público (bus)", "unit": "km",
         "emission_factor": 0.10, "reference": "AEMA / DEFAULT EU"},
        {"name": "Transporte público (metro/tren)", "unit": "km",
         "emission_factor": 0.04, "reference": "AEMA"},
        {"name": "Auto particular (nafta)", "unit": "km",
         "emission_factor": 0.192, "reference": "DEFRA"},
        {"name": "Auto particular (diésel)", "unit": "km",
         "emission_factor": 0.171, "reference": "DEFRA"},
        {"name": "Vuelo (corto alcance)", "unit": "pasajero-km",
         "emission_factor": 0.285, "reference": "IPCC / ICAO"},
        {"name": "Vuelo (largo alcance)", "unit": "pasajero-km",
         "emission_factor": 0.150, "reference": "IPCC / ICAO"},
        {"name": "Residuos domiciliarios", "unit": "kg",
            "emission_factor": 0.70, "reference": "IPCC (metano en rellenos)"},
        {"name": "Papel", "unit": "kg", "emission_factor": 1.30, "reference": "AEMA"},
        {"name": "Plástico", "unit": "kg",
            "emission_factor": 2.50, "reference": "AEMA"},
    ]
    for item in data:
        exists = EmissionSource.query.filter_by(name=item["name"]).first()
        if not exists:
            source = EmissionSource(
                name=item["name"],
                unit=item["unit"],
                emission_factor=item["emission_factor"],
                reference=item["reference"]
            )
            db.session.add(source)
    db.session.commit()


if __name__ == "__main__":
    from src.app import create_app
    app = create_app()
    with app.app_context():
        seed_emission_sources()
        print("Datos de fuentes de emisión insertados.")
