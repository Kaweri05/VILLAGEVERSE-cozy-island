from fastapi import APIRouter, Depends
from app.auth.security import get_current_user
from app.models.game_models import User

router = APIRouter()


@router.get("/")
async def list_notifications(current_user: User = Depends(get_current_user)) -> list[dict]:
    return [
        {"id": 1, "title": "New quest unlocked", "body": f"Welcome back, {current_user.full_name}!"},
        {"id": 2, "title": "Seasonal event live", "body": "Moonlight market is now open."},
    ]
