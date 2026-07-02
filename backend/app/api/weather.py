from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def weather() -> dict:
    return {"condition": "sunny", "temperature": 74, "wind_speed": 6}
