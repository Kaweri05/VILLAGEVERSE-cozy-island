from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.game_models import Player, PlayerCompanion

router = APIRouter(prefix="/game/companion", tags=["companion"])

# Companions are bought directly with coins (separate from the main shop)
# and give a passive percentage bonus once equipped.
COMPANIONS = [
    {"id": 1, "name": "Scout Parrot", "emoji": "🦜", "price": 400,
     "bonus_type": "gather", "bonus_percent": 15, "description": "+15% resources gathered at camp."},
    {"id": 2, "name": "Lucky Crab", "emoji": "🦀", "price": 350,
     "bonus_type": "quest_reward", "bonus_percent": 20, "description": "+20% coins from completed quests."},
    {"id": 3, "name": "Island Fox", "emoji": "🦊", "price": 600,
     "bonus_type": "gather", "bonus_percent": 25, "description": "+25% resources gathered at camp."},
]
COMPANION_BY_ID = {c["id"]: c for c in COMPANIONS}


async def _get_or_create_player(db: AsyncSession, username: str) -> Player:
    result = await db.execute(select(Player).where(Player.username == username))
    player = result.scalar_one_or_none()
    if player is None:
        player = Player(username=username, coins=1000)
        db.add(player)
        await db.flush()
    return player


async def get_active_bonus(db: AsyncSession, player_id: int, bonus_type: str) -> float:
    """Returns a multiplier (1.0 = no bonus) for the given bonus_type, used by camp/quests."""
    result = await db.execute(select(PlayerCompanion).where(PlayerCompanion.player_id == player_id))
    row = result.scalar_one_or_none()
    if row is None:
        return 1.0
    companion = COMPANION_BY_ID.get(row.companion_id)
    if companion is None or companion["bonus_type"] != bonus_type:
        return 1.0
    return 1.0 + companion["bonus_percent"] / 100


@router.get("/status")
async def companion_status(username: str, db: AsyncSession = Depends(get_db)):
    player = await _get_or_create_player(db, username)
    result = await db.execute(select(PlayerCompanion).where(PlayerCompanion.player_id == player.id))
    equipped = result.scalar_one_or_none()
    await db.commit()

    return {
        "username": username,
        "coins": player.coins,
        "equipped_companion_id": equipped.companion_id if equipped else None,
        "companions": COMPANIONS,
    }


@router.post("/buy-and-equip")
async def buy_and_equip(username: str, companion_id: int, db: AsyncSession = Depends(get_db)):
    if companion_id not in COMPANION_BY_ID:
        raise HTTPException(status_code=404, detail="Companion not found.")
    companion = COMPANION_BY_ID[companion_id]

    player = await _get_or_create_player(db, username)
    result = await db.execute(select(PlayerCompanion).where(PlayerCompanion.player_id == player.id))
    row = result.scalar_one_or_none()

    already_owned = row is not None and row.companion_id == companion_id
    if not already_owned:
        if player.coins < companion["price"]:
            raise HTTPException(
                status_code=400,
                detail={"message": "Not enough coins.", "have": player.coins, "need": companion["price"]},
            )
        player.coins -= companion["price"]

    if row is None:
        row = PlayerCompanion(player_id=player.id, companion_id=companion_id)
        db.add(row)
    else:
        row.companion_id = companion_id

    await db.commit()
    return {"username": username, "equipped_companion_id": companion_id, "remaining_coins": player.coins}
