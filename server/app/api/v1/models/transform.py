from typing import Literal, Union, List
from pydantic import BaseModel
from app.api.v1.models.input import InputModel
from app.api.v1.models.output import OutputModel


class BufferParams(BaseModel):
    distance: float
    units: Literal["meters", "kilometers", "feet", "miles"]


class BufferTransformation(BaseModel):
    type: Literal["buffer"]
    params: BufferParams


class UnionTransformation(BaseModel):
    type: Literal["union"]


TransformationModel = Union[BufferTransformation, UnionTransformation]


class TransformIn(BaseModel):
    input: InputModel
    transformations: List[TransformationModel] = []
    output: OutputModel
