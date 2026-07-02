from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.models.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(200), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    coins = Column(Integer, default=0)
    xp = Column(Integer, default=0)
    level = Column(Integer, default=1)
    island_rating = Column(Float, default=0.0)
    village_happiness = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    inventory = relationship("InventoryItem", back_populates="owner", cascade="all, delete-orphan")
    quests = relationship("QuestProgress", back_populates="user", cascade="all, delete-orphan")
    analytics = relationship("Analytics", back_populates="user", cascade="all, delete-orphan")


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    category = Column(String(80), nullable=False)
    quantity = Column(Integer, default=1)
    rarity = Column(String(40), default="common")
    notes = Column(Text, nullable=True)
    favorite = Column(Boolean, default=False)
    reserved = Column(Boolean, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="inventory")


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    category = Column(String(80), nullable=False)
    price = Column(Integer, nullable=False)
    stock = Column(Integer, default=0)
    rarity = Column(String(40), default="common")
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), unique=True, nullable=False)


class Villager(Base):
    __tablename__ = "villagers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), nullable=False)
    role = Column(String(80), nullable=False)
    friendship_level = Column(Integer, default=0)
    mood = Column(String(40), default="friendly")


class Quest(Base):
    __tablename__ = "quests"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(120), nullable=False)
    description = Column(Text, nullable=False)
    reward_coins = Column(Integer, default=0)
    reward_xp = Column(Integer, default=0)
    active = Column(Boolean, default=True)


class QuestProgress(Base):
    __tablename__ = "quest_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    quest_id = Column(Integer, ForeignKey("quests.id"), nullable=False)
    completed = Column(Boolean, default=False)
    progress = Column(Integer, default=0)

    user = relationship("User", back_populates="quests")


class Achievement(Base):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    description = Column(Text, nullable=True)
    reward_coins = Column(Integer, default=0)


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    description = Column(Text, nullable=True)
    active = Column(Boolean, default=True)
    event_type = Column(String(40), default="seasonal")


class WeatherSnapshot(Base):
    __tablename__ = "weather_snapshots"

    id = Column(Integer, primary_key=True, index=True)
    condition = Column(String(40), default="sunny")
    temperature = Column(Integer, default=72)
    wind_speed = Column(Integer, default=0)


class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action = Column(String(120), nullable=False)
    detail = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="analytics")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(120), nullable=False)
    description = Column(Text, nullable=True)
    score = Column(Float, default=0.0)
