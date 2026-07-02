from fastapi import APIRouter

from app.api.game import router as game_router
from app.api.camp import router as camp_router
from app.api.shop import router as shop_router

api_router = APIRouter()
api_router.include_router(game_router)
api_router.include_router(camp_router)
api_router.include_router(shop_router)
