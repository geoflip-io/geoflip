from pydantic import UUID4, ConfigDict


router = APIRouter()
logger = logging.getLogger("api")


class EraseQuedOut(BaseModel):
    job_id: UUID4
    status: Literal["queued"]
    message: str

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "job_id": "4fdf9052-261d-4ff0-9521-6de863e785c4",
                "status": "queued",
                "message": "Erase job has been accepted",
            }
        }
    )


@router.post(
    "/erase",
    status_code=200,
    response_model=EraseQuedOut,
    tags=["Erase"],
    responses={
        400: {
            "description": "Bad Request",
            "content": {
                "application/json": {"example": {"detail": "input is invalid"}}
            },
        }
    },
)
async def create_transformation(
    request: Request,
    current_user: Annotated[User, Depends(get_current_user)],
    config: Annotated[str, Form(...)],
    input_file: UploadFile,
):
    start_time = datetime.datetime.now()

    # Step 1: Parse and validate config
    try:
        transform = TransformIn.model_validate(json.loads(config))
    except ValidationError as e:
        logger.warning(f"Validation failed for config: {e}")
        raise HTTPException(status_code=400, detail="input is invalid")
    except Exception as e:
        logger.warning(f"Bad request: {e}")
        raise HTTPException(status_code=400, detail=f"Bad request {e}")

    input_format: str = transform.input.format
    input_epsg: int = transform.input.epsg
    job_id: str = str(uuid.uuid4())
    input_file_path: str = None
    output_format: str = transform.output.format
    output_epsg: int = transform.output.epsg
    output_to_file: bool = transform.output.to_file
    payload_size_bytes = 0
