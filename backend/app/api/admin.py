from fastapi import APIRouter, Depends
from app.auth.security import get_current_user
from app.models.game_models import User

router = APIRouter()


@router.get("/")
async def admin_dashboard(current_user: User = Depends(get_current_user)) -> dict:
    return {
        "user": current_user.full_name,
        "role": "admin" if current_user.email.endswith("@admin.com") else "player",
        "metrics": {
            "active_users": 1248,
            "marketplace_sales": 42000,
            "average_happiness": 91,
        },
    }
