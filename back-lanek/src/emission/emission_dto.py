from marshmallow import Schema, fields


class EmissionRecordDTO(Schema):
    user_id = fields.Int(required=True)
    source_id = fields.Int(required=True)
    amount = fields.Float(required=True)
    emission_factor = fields.Float(required=True)
    recorded_at = fields.DateTime(required=False)
