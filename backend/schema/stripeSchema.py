from schema.enums import FormatEnum

class CreateSessionSchema:
    format: FormatEnum
    user_id: str
    name: str
    email: str
    