from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    coins: int = 0
    xp: int = 0
    level: int = 1
    island_rating: float = 0.0
    village_happiness: float = 0.0
    created_at: datetime


class InventoryItemCreate(BaseModel):
    name: str
    category: str
    quantity: int = 1
    rarity: str = "common"
    notes: Optional[str] = None
    favorite: bool = False
    reserved: bool = False


class InventoryItemOut(InventoryItemCreate):
    id: int
    owner_id: int


class ProductOut(BaseModel):
    id: int
    name: str
    category: str
    price: int
    stock: int
    rarity: str
    description: Optional[str] = None
    image_url: Optional[str] = None


class SearchRequest(BaseModel):
    query: str


class SearchResult(BaseModel):
    item: str
    description: str
    score: float


class QuestOut(BaseModel):
    id: int
    title: str
    description: str
    reward_coins: int
    reward_xp: int
    active: bool


class WeatherOut(BaseModel):
    condition: str
    temperature: int
    wind_speed: int


class RecommendationOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    score: float


class AnalyticsOut(BaseModel):
    id: int
    action: str
    detail: Optional[str]
    created_at: datetime
