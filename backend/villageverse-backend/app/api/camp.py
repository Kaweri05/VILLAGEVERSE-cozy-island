import datetime as dt
import random

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.game_models import Player, PlayerCamp

router = APIRouter(prefix="/game/camp", tags=["camp"])

# Each node has a respawn cooldown and a random yield range.
RESOURCE_NODES = {
    "wood": {"cooldown_seconds": 30, "min": 5, "max": 15, "label": "Palm Grove"},
    "stone": {"cooldown_seconds": 45, "min": 3, "max": 10, "label": "Rocky Outcrop"},
    "cloth": {"cooldown_seconds": 60, "min": 2, "max": 8, "label": "Bamboo Thicket"},
}

# Resources required to reach each camp level.
CAMP_UPGRADE_COSTS = {
    2: {"wood": 50, "stone": 30},
    3: {"wood": 120, "stone": 80, "cloth": 40},
    4: {"wood": 250, "stone": 180, "cloth": 100},
    5: {"wood": 400, "stone": 320, "cloth": 200},
}


async def _get_or_create_camp(db: AsyncSession, username: str) -> PlayerCamp:
    result = await db.execute(select(Player).where(Player.username == username))
    player = result.scalar_one_or_none()
    if player is None:
        player = Player(username=username)
        db.add(player)
        await db.flush()

    result = await db.execute(select(PlayerCamp).where(PlayerCamp.player_id == player.id))
    camp = result.scalar_one_or_none()
    if camp is None:
        camp = PlayerCamp(player_id=player.id)
        db.add(camp)
        await db.flush()
    return camp


@router.get("/status")
async def camp_status(username: str, db: AsyncSession = Depends(get_db)):
    camp = await _get_or_create_camp(db, username)
    await db.commit()

    now = dt.datetime.utcnow()
    nodes = {}
    for resource, cfg in RESOURCE_NODES.items():
        last = camp.last_gather.get(resource)
        if last is None:
            ready, seconds_left = True, 0
        else:
            elapsed = (now - dt.datetime.fromisoformat(last)).total_seconds()
            ready = elapsed >= cfg["cooldown_seconds"]
            seconds_left = max(0, round(cfg["cooldown_seconds"] - elapsed))
        nodes[resource] = {"label": cfg["label"], "ready": ready, "seconds_left": seconds_left}

    next_level = camp.camp_level + 1
    upgrade_cost = CAMP_UPGRADE_COSTS.get(next_level)

    return {
        "username": username,
        "camp_level": camp.camp_level,
        "resources": {"wood": camp.wood, "stone": camp.stone, "cloth": camp.cloth},
        "gather_nodes": nodes,
        "next_upgrade": {"level": next_level, "cost": upgrade_cost} if upgrade_cost else None,
    }


@router.post("/gather")
async def gather_resource(username: str, resource: str, db: AsyncSession = Depends(get_db)):
    if resource not in RESOURCE_NODES:
        raise HTTPException(status_code=400, detail=f"Unknown resource. Choose from {list(RESOURCE_NODES)}.")

    camp = await _get_or_create_camp(db, username)
    cfg = RESOURCE_NODES[resource]
    now = dt.datetime.utcnow()

    last = camp.last_gather.get(resource)
    if last is not None:
        elapsed = (now - dt.datetime.fromisoformat(last)).total_seconds()
        if elapsed < cfg["cooldown_seconds"]:
            wait = round(cfg["cooldown_seconds"] - elapsed)
            raise HTTPException(status_code=429, detail=f"{cfg['label']} needs {wait}s to respawn.")

    # Higher camp level = slightly better yield.
    amount = random.randint(cfg["min"], cfg["max"]) + (camp.camp_level - 1) * 2
    setattr(camp, resource, getattr(camp, resource) + amount)
    camp.last_gather = {**camp.last_gather, resource: now.isoformat()}

    await db.commit()

    return {
        "username": username,
        "resource": resource,
        "amount_gained": amount,
        "totals": {"wood": camp.wood, "stone": camp.stone, "cloth": camp.cloth},
    }


@router.post("/upgrade")
async def upgrade_camp(username: str, db: AsyncSession = Depends(get_db)):
    camp = await _get_or_create_camp(db, username)
    next_level = camp.camp_level + 1
    cost = CAMP_UPGRADE_COSTS.get(next_level)

    if cost is None:
        raise HTTPException(status_code=400, detail="Camp is already at max level.")

    missing = {r: need - getattr(camp, r) for r, need in cost.items() if getattr(camp, r) < need}
    if missing:
        raise HTTPException(status_code=400, detail={"message": "Not enough resources.", "missing": missing})

    for resource, need in cost.items():
        setattr(camp, resource, getattr(camp, resource) - need)
    camp.camp_level = next_level

    await db.commit()

    return {
        "username": username,
        "new_camp_level": camp.camp_level,
        "remaining_resources": {"wood": camp.wood, "stone": camp.stone, "cloth": camp.cloth},
    }
