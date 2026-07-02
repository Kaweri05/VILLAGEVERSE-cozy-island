from fastapi import APIRouter, Depends
from app.auth.security import get_current_user
from app.models.game_models import User

router = APIRouter()


@router.get("/")
async def quests(current_user: User = Depends(get_current_user)) -> list[dict]:
    return [
        {"id": 1, "title": "Morning Bloom Hunt", "reward_coins": 150, "reward_xp": 80, "status": "active"},
        {"id": 2, "title": "Moonlit Fish Run", "reward_coins": 300, "reward_xp": 120, "status": "active"},
    ]
