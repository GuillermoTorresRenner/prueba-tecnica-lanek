from marshmallow import Schema, fields, validate


class RegisterUserSchema(Schema):
    """
    Esquema de validación para el registro de usuario.
    Ejemplo de uso:
        schema = RegisterUserSchema()
        errors = schema.validate({
            'name': 'Juan',
            'email': 'juan@mail.com',
            'password': 'secreto123'
        })
        if errors:
            # manejar errores
    """
    name = fields.Str(required=True, validate=validate.Length(min=2))
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))
