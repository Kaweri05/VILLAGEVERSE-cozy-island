import datetime as dt

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.game_models import Player, DailyReward

router = APIRouter(prefix="/game", tags=["game"])

# Coins awarded per consecutive day, capped at day 7 (then it loops).
STREAK_REWARDS = [50, 75, 100, 125, 150, 200, 300]


async def _get_or_create_player(db: AsyncSession, username: str) -> Player:
    result = await db.execute(select(Player).where(Player.username == username))
    player = result.scalar_one_or_none()
    if player is None:
        player = Player(username=username)
        db.add(player)
        await db.flush()
    return player


@router.get("/daily-reward/status")
async def daily_reward_status(username: str, db: AsyncSession = Depends(get_db)):
    """Check whether the player can claim today's reward and what their streak is."""
    player = await _get_or_create_player(db, username)

    result = await db.execute(select(DailyReward).where(DailyReward.player_id == player.id))
    reward = result.scalar_one_or_none()

    if reward is None or reward.last_claimed_at is None:
        can_claim = True
        streak = 0
    else:
        now = dt.datetime.utcnow()
        hours_since = (now - reward.last_claimed_at).total_seconds() / 3600
        can_claim = hours_since >= 20  # allow claiming once a rough "day" has passed
        streak = reward.streak

    await db.commit()
    next_reward = STREAK_REWARDS[streak % len(STREAK_REWARDS)]
    return {
        "username": username,
        "current_streak": streak,
        "can_claim": can_claim,
        "next_reward_coins": next_reward,
    }


@router.post("/daily-reward/claim")
async def claim_daily_reward(username: str, db: AsyncSession = Depends(get_db)):
    """Claim today's login reward. Streak grows if claimed within ~20-44h of the last claim,
    otherwise it resets to day 1."""
    player = await _get_or_create_player(db, username)

    result = await db.execute(select(DailyReward).where(DailyReward.player_id == player.id))
    reward = result.scalar_one_or_none()
    now = dt.datetime.utcnow()

    if reward is None:
        reward = DailyReward(player_id=player.id, streak=0)
        db.add(reward)
        await db.flush()

    if reward.last_claimed_at is not None:
        hours_since = (now - reward.last_claimed_at).total_seconds() / 3600
        if hours_since < 20:
            raise HTTPException(status_code=429, detail="Daily reward already claimed. Come back tomorrow!")
        elif hours_since > 44:
            reward.streak = 0  # streak broken, missed a day

    coins_awarded = STREAK_REWARDS[reward.streak % len(STREAK_REWARDS)]
    player.coins += coins_awarded
    reward.streak += 1
    reward.last_claimed_at = now

    await db.commit()

    return {
        "username": username,
        "coins_awarded": coins_awarded,
        "new_streak": reward.streak,
        "total_coins": player.coins,
    }
