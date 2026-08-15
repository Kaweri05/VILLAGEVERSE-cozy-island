from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.game_models import Player, PlayerCamp, PlayerInventoryItem

router = APIRouter(prefix="/game/craft", tags=["craft"])

# Crafted items use their own id range (starting at 1000) so they never
# collide with the shop catalog's ids (1-33) in PlayerInventoryItem.
RECIPES = [
    {"result_item_id": 1001, "name": "Handwoven Basket", "emoji": "🧺",
     "cost": {"wood": 20, "cloth": 15}, "description": "A sturdy basket for carrying finds."},
    {"result_item_id": 1002, "name": "Stone Torch", "emoji": "🔥",
     "cost": {"wood": 10, "stone": 25}, "description": "Lights up the camp at night."},
    {"result_item_id": 1003, "name": "Sailcloth Tent", "emoji": "⛺",
     "cost": {"wood": 40, "cloth": 40, "stone": 10}, "description": "Shelter fit for an island explorer."},
]
RECIPE_BY_ID = {r["result_item_id"]: r for r in RECIPES}


async def _get_or_create_player(db: AsyncSession, username: str) -> Player:
    result = await db.execute(select(Player).where(Player.username == username))
    player = result.scalar_one_or_none()
    if player is None:
        player = Player(username=username, coins=1000)
        db.add(player)
        await db.flush()
    return player


async def _get_camp(db: AsyncSession, player_id: int) -> PlayerCamp:
    result = await db.execute(select(PlayerCamp).where(PlayerCamp.player_id == player_id))
    camp = result.scalar_one_or_none()
    if camp is None:
        camp = PlayerCamp(player_id=player_id)
        db.add(camp)
        await db.flush()
    return camp


@router.get("/recipes")
async def list_recipes(username: str, db: AsyncSession = Depends(get_db)):
    player = await _get_or_create_player(db, username)
    camp = await _get_camp(db, player.id)
    await db.commit()

    recipes = []
    for r in RECIPES:
        can_afford = all(getattr(camp, res) >= amt for res, amt in r["cost"].items())
        recipes.append({**r, "can_afford": can_afford})

    return {
        "username": username,
        "resources": {"wood": camp.wood, "stone": camp.stone, "cloth": camp.cloth},
        "recipes": recipes,
    }


@router.post("/make")
async def craft_item(username: str, result_item_id: int, db: AsyncSession = Depends(get_db)):
    if result_item_id not in RECIPE_BY_ID:
        raise HTTPException(status_code=404, detail="Recipe not found.")
    recipe = RECIPE_BY_ID[result_item_id]

    player = await _get_or_create_player(db, username)
    camp = await _get_camp(db, player.id)

    missing = {res: amt - getattr(camp, res) for res, amt in recipe["cost"].items() if getattr(camp, res) < amt}
    if missing:
        raise HTTPException(status_code=400, detail={"message": "Not enough resources.", "missing": missing})

    for res, amt in recipe["cost"].items():
        setattr(camp, res, getattr(camp, res) - amt)

    result = await db.execute(
        select(PlayerInventoryItem).where(
            PlayerInventoryItem.player_id == player.id,
            PlayerInventoryItem.item_id == result_item_id,
        )
    )
    owned = result.scalar_one_or_none()
    if owned is None:
        owned = PlayerInventoryItem(player_id=player.id, item_id=result_item_id, quantity=1)
        db.add(owned)
    else:
        owned.quantity += 1

    await db.commit()
    return {
        "username": username,
        "crafted": recipe["name"],
        "quantity_owned": owned.quantity,
        "remaining_resources": {"wood": camp.wood, "stone": camp.stone, "cloth": camp.cloth},
    }
