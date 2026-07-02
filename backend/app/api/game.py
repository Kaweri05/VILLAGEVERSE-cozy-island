from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth.security import get_current_user
from app.db.database import get_db
from app.models.game_models import Analytics, InventoryItem, Product, Quest, Recommendation, User, WeatherSnapshot
from app.schemas.game import AnalyticsOut, InventoryItemCreate, InventoryItemOut, ProductOut, QuestOut, RecommendationOut, SearchRequest, SearchResult, Token, UserCreate, UserOut, WeatherOut
from app.auth.security import authenticate_user, create_access_token, get_password_hash
from app.services.game_service import GameService

router = APIRouter()


@router.post("/register", response_model=UserOut)
async def register_user(payload: UserCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == payload.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        full_name=payload.full_name,
        email=str(payload.email),
        hashed_password=get_password_hash(payload.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return UserOut.model_validate(user)


@router.post("/token", response_model=Token)
async def login(payload: dict, db: AsyncSession = Depends(get_db)):
    email = payload.get("email")
    password = payload.get("password")
    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password are required")
    user = await authenticate_user(email, password, db)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token = create_access_token(subject=user.email)
    return Token(access_token=access_token)


@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)


@router.get("/inventory", response_model=List[InventoryItemOut])
async def list_inventory(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(InventoryItem).where(InventoryItem.owner_id == current_user.id))
    return [InventoryItemOut.model_validate(item) for item in result.scalars().all()]


@router.post("/inventory", response_model=InventoryItemOut)
async def add_inventory_item(payload: InventoryItemCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    item = InventoryItem(owner_id=current_user.id, **payload.model_dump())
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return InventoryItemOut.model_validate(item)


@router.get("/marketplace", response_model=List[ProductOut])
async def list_marketplace(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product))
    return [ProductOut.model_validate(product) for product in result.scalars().all()]


@router.get("/search", response_model=List[SearchResult])
async def search_items(query: str):
    sample = [
        {"item": "Sunset Berry Jam", "description": "Sweet preserve made from island berries.", "score": 0.95},
        {"item": "Moonlit Herb", "description": "A calming herb used in crafting and cooking.", "score": 0.88},
    ]
    return [SearchResult(**entry) for entry in sample if query.lower() in entry["item"].lower() or query.lower() in entry["description"].lower()]


@router.get("/weather", response_model=WeatherOut)
async def get_weather(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(WeatherSnapshot).order_by(WeatherSnapshot.id.desc()).limit(1))
    snapshot = result.scalar_one_or_none()
    if not snapshot:
        snapshot = WeatherSnapshot(condition="sunny", temperature=72, wind_speed=6)
        db.add(snapshot)
        await db.commit()
        await db.refresh(snapshot)
    return WeatherOut.model_validate(snapshot)


@router.get("/quests", response_model=List[QuestOut])
async def list_quests(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Quest).where(Quest.active.is_(True)))
    return [QuestOut.model_validate(quest) for quest in result.scalars().all()]


@router.get("/recommendations", response_model=List[RecommendationOut])
async def list_recommendations(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Recommendation).where(Recommendation.user_id == current_user.id))
    items = result.scalars().all()
    if not items:
        db.add(Recommendation(user_id=current_user.id, title="Moonlit Lantern", description="A cozy lamp for your porch", score=0.91))
        await db.commit()
        items = [Recommendation(user_id=current_user.id, title="Moonlit Lantern", description="A cozy lamp for your porch", score=0.91)]
    return [RecommendationOut.model_validate(item) for item in items]


@router.get("/analytics", response_model=List[AnalyticsOut])
async def get_analytics(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Analytics).where(Analytics.user_id == current_user.id).order_by(Analytics.id.desc()))
    return [AnalyticsOut.model_validate(entry) for entry in result.scalars().all()]


@router.get("/ai/tips")
async def daily_ai_tips() -> dict:
    return {"tips": GameService.generate_daily_tips()}


@router.get("/ai/predict-price")
async def predict_price(item_name: str) -> dict:
    return {"item": item_name, "predicted_price": GameService.predict_market_price(item_name)}


@router.get("/ai/recommendations")
async def ai_recommendations(current_user: User = Depends(get_current_user)) -> dict:
    return {"recommendations": GameService.recommend_items(current_user.level)}
