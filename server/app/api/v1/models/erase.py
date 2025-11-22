from pydantic import BaseModel
from app.api.v1.models.input import InputModel
from app.api.v1.models.output import OutputModel


class EraseIn(BaseModel):
    target: InputModel
    erase: InputModel
    output: OutputModel
