import datetime as dt

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.game_models import Player, PlayerQuest
from app.api.events import get_current_event
from app.api.companion import get_active_bonus

router = APIRouter(prefix="/game/quests", tags=["quests"])

QUEST_CATALOG = [
    {"id": 1, "title": "Morning Bloom Hunt", "detail": "Collect three flowers across the meadow.",
     "entry_cost": 50, "reward_coins": 150, "duration_seconds": 30},
    {"id": 2, "title": "Moonlit Fish Run", "detail": "Catch a rare fish before sundown.",
     "entry_cost": 100, "reward_coins": 300, "duration_seconds": 60},
    {"id": 3, "title": "Crafting Calm", "detail": "Complete a new home decor project.",
     "entry_cost": 80, "reward_coins": 220, "duration_seconds": 45},
]
QUEST_BY_ID = {q["id"]: q for q in QUEST_CATALOG}


async def _get_or_create_player(db: AsyncSession, username: str) -> Player:
    result = await db.execute(select(Player).where(Player.username == username))
    player = result.scalar_one_or_none()
    if player is None:
        player = Player(username=username, coins=1000)
        db.add(player)
        await db.flush()
    return player


@router.get("/status")
async def quests_status(username: str, db: AsyncSession = Depends(get_db)):
    player = await _get_or_create_player(db, username)
    result = await db.execute(select(PlayerQuest).where(PlayerQuest.player_id == player.id))
    rows = {row.quest_id: row for row in result.scalars().all()}
    await db.commit()

    now = dt.datetime.utcnow()
    quests = []
    for q in QUEST_CATALOG:
        row = rows.get(q["id"])
        if row is None or row.status == "not_started":
            state, seconds_left = "not_started", None
        elif row.status == "completed":
            state, seconds_left = "completed", None
        else:
            elapsed = (now - row.started_at).total_seconds()
            remaining = max(0, q["duration_seconds"] - elapsed)
            state = "ready_to_claim" if remaining <= 0 else "in_progress"
            seconds_left = round(remaining) if remaining > 0 else 0
        quests.append({**q, "state": state, "seconds_left": seconds_left})

    return {"username": username, "coins": player.coins, "quests": quests, "event": get_current_event()}


@router.post("/start")
async def start_quest(username: str, quest_id: int, db: AsyncSession = Depends(get_db)):
    if quest_id not in QUEST_BY_ID:
        raise HTTPException(status_code=404, detail="Quest not found.")
    quest = QUEST_BY_ID[quest_id]

    player = await _get_or_create_player(db, username)
    result = await db.execute(
        select(PlayerQuest).where(PlayerQuest.player_id == player.id, PlayerQuest.quest_id == quest_id)
    )
    row = result.scalar_one_or_none()

    if row is not None and row.status == "completed":
        raise HTTPException(status_code=400, detail="Quest already completed.")
    if row is not None and row.status == "in_progress":
        raise HTTPException(status_code=400, detail="Quest already in progress.")

    if player.coins < quest["entry_cost"]:
        raise HTTPException(
            status_code=400,
            detail={"message": "Not enough coins to start this quest.",
                    "have": player.coins, "need": quest["entry_cost"]},
        )

    player.coins -= quest["entry_cost"]

    now = dt.datetime.utcnow()
    if row is None:
        row = PlayerQuest(player_id=player.id, quest_id=quest_id, status="in_progress", started_at=now)
        db.add(row)
    else:
        row.status = "in_progress"
        row.started_at = now

    await db.commit()
    return {"username": username, "quest_id": quest_id, "state": "in_progress",
            "coins_spent": quest["entry_cost"], "remaining_coins": player.coins,
            "seconds_left": quest["duration_seconds"]}


@router.post("/claim")
async def claim_quest(username: str, quest_id: int, db: AsyncSession = Depends(get_db)):
    if quest_id not in QUEST_BY_ID:
        raise HTTPException(status_code=404, detail="Quest not found.")

    player = await _get_or_create_player(db, username)
    result = await db.execute(
        select(PlayerQuest).where(PlayerQuest.player_id == player.id, PlayerQuest.quest_id == quest_id)
    )
    row = result.scalar_one_or_none()

    if row is None or row.status != "in_progress":
        raise HTTPException(status_code=400, detail="Quest is not in progress.")

    elapsed = (dt.datetime.utcnow() - row.started_at).total_seconds()
    quest = QUEST_BY_ID[quest_id]
    if elapsed < quest["duration_seconds"]:
        wait = round(quest["duration_seconds"] - elapsed)
        raise HTTPException(status_code=400, detail=f"Quest not finished yet. {wait}s remaining.")

    row.status = "completed"
    row.completed_at = dt.datetime.utcnow()

    event = get_current_event()
    event_multiplier = event["multiplier"] if event["active"] else 1.0
    companion_multiplier = await get_active_bonus(db, player.id, "quest_reward")

    reward = round(quest["reward_coins"] * event_multiplier * companion_multiplier)
    player.coins += reward

    await db.commit()
    return {"username": username, "quest_id": quest_id, "state": "completed",
            "coins_awarded": reward, "total_coins": player.coins,
            "lucky_hour_active": event["active"]}
