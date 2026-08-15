import datetime as dt

from fastapi import APIRouter

router = APIRouter(prefix="/game/weather", tags=["weather"])

# Each weather type boosts one resource's gather yield.
WEATHER_TYPES = [
    {"name": "Sunny", "emoji": "☀️", "boosted_resource": "wood", "multiplier": 1.5,
     "flavor": "Warm light filters through the palms — great day for chopping wood."},
    {"name": "Rainy", "emoji": "🌧️", "boosted_resource": "cloth", "multiplier": 1.5,
     "flavor": "Soft rain softens the bamboo fibers — easier to harvest cloth."},
    {"name": "Windy", "emoji": "🌬️", "boosted_resource": "stone", "multiplier": 1.5,
     "flavor": "Strong winds have exposed loose stone at the outcrop."},
    {"name": "Calm", "emoji": "🌤️", "boosted_resource": None, "multiplier": 1.0,
     "flavor": "A quiet, ordinary day on the island."},
]


def get_today_weather() -> dict:
    """Same weather for all players on a given UTC date, rotates daily."""
    day_index = dt.datetime.utcnow().toordinal()
    return WEATHER_TYPES[day_index % len(WEATHER_TYPES)]


@router.get("/today")
async def today_weather():
    weather = get_today_weather()
    return {**weather, "date": dt.datetime.utcnow().date().isoformat()}
