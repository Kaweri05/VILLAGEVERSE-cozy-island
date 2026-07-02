from fastapi import APIRouter
from app.api import admin, analytics, auth, game, inventory, leaderboards, marketplace, npc, notifications, quests, search, weather

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(inventory.router, prefix="/inventory", tags=["inventory"])
api_router.include_router(search.router, prefix="/search", tags=["search"])
api_router.include_router(game.router, prefix="/game", tags=["game"])
api_router.include_router(npc.router, prefix="/npc", tags=["npc"])
api_router.include_router(quests.router, prefix="/quests", tags=["quests"])
api_router.include_router(marketplace.router, prefix="/marketplace", tags=["marketplace"])
api_router.include_router(leaderboards.router, prefix="/leaderboards", tags=["leaderboards"])
api_router.include_router(weather.router, prefix="/weather", tags=["weather"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
