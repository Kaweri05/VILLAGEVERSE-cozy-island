from fastapi import APIRouter

from app.api.game import router as game_router
from app.api.camp import router as camp_router
from app.api.shop import router as shop_router
from app.api.quests import router as quests_router
from app.api.weather import router as weather_router
from app.api.events import router as events_router
from app.api.craft import router as craft_router
from app.api.companion import router as companion_router

api_router = APIRouter()
api_router.include_router(game_router)
api_router.include_router(camp_router)
api_router.include_router(shop_router)
api_router.include_router(quests_router)
api_router.include_router(weather_router)
api_router.include_router(events_router)
api_router.include_router(craft_router)
api_router.include_router(companion_router)
