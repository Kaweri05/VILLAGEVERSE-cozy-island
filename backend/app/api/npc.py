from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.security import get_current_user
from app.db.database import get_db
from app.models.game_models import User, Villager

router = APIRouter()


@router.get("/villagers")
async def get_villagers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Villager))
    villagers = result.scalars().all()
    return [{"id": villager.id, "name": villager.name, "role": villager.role, "friendship_level": villager.friendship_level, "mood": villager.mood} for villager in villagers]


@router.post("/chat")
async def chat_with_npc(message: str, current_user: User = Depends(get_current_user)) -> dict:
    return {
        "reply": f"{current_user.full_name}, your island companion hears: {message}",
        "mood": "friendly",
    }
