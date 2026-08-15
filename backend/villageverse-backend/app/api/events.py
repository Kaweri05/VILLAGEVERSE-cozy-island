import datetime as dt

from fastapi import APIRouter

router = APIRouter(prefix="/game/events", tags=["events"])

# Every 4th hour (UTC) is a "Lucky Hour" — quest rewards pay double.
# Deterministic and global, so every player sees the same event at the same time.
LUCKY_HOUR_INTERVAL = 4
LUCKY_HOUR_MULTIPLIER = 2.0


def get_current_event() -> dict:
    now = dt.datetime.utcnow()
    is_lucky = now.hour % LUCKY_HOUR_INTERVAL == 0
    minutes_into_hour = now.minute
    minutes_left = 60 - minutes_into_hour if is_lucky else None

    if is_lucky:
        return {
            "active": True, "name": "Lucky Hour", "emoji": "🍀",
            "multiplier": LUCKY_HOUR_MULTIPLIER,
            "flavor": "Quest rewards are doubled this hour!",
            "minutes_left": minutes_left,
        }
    # minutes until the next lucky hour starts
    hours_until = LUCKY_HOUR_INTERVAL - (now.hour % LUCKY_HOUR_INTERVAL)
    minutes_until = hours_until * 60 - now.minute
    return {
        "active": False, "name": None, "emoji": None,
        "multiplier": 1.0, "flavor": "No event right now.",
        "minutes_until_next": minutes_until,
    }


@router.get("/current")
async def current_event():
    return get_current_event()
