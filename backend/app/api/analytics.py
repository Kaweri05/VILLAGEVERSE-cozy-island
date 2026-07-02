from fastapi import APIRouter, Depends
from app.auth.security import get_current_user
from app.models.game_models import User

router = APIRouter()


@router.get("/")
async def analytics(current_user: User = Depends(get_current_user)) -> dict:
    return {
        "user": current_user.full_name,
        "xp": current_user.xp,
        "level": current_user.level,
        "island_rating": current_user.island_rating,
        "village_happiness": current_user.village_happiness,
    }
