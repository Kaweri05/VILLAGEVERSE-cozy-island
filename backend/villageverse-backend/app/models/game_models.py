import datetime as dt

from sqlalchemy import String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Player(Base):
    __tablename__ = "players"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    coins: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[dt.datetime] = mapped_column(DateTime, default=dt.datetime.utcnow)

    daily_reward: Mapped["DailyReward"] = relationship(
        back_populates="player", uselist=False, cascade="all, delete-orphan"
    )


class DailyReward(Base):
    """NEW FEATURE: tracks each player's daily login streak and reward claims."""

    __tablename__ = "daily_rewards"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    player_id: Mapped[int] = mapped_column(ForeignKey("players.id"), unique=True)
    streak: Mapped[int] = mapped_column(Integer, default=0)
    last_claimed_at: Mapped[dt.datetime | None] = mapped_column(DateTime, nullable=True)

    player: Mapped["Player"] = relationship(back_populates="daily_reward")


class PlayerCamp(Base):
    """NEW FEATURE: pirate camp — gather resources, upgrade the camp level."""

    __tablename__ = "player_camps"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    player_id: Mapped[int] = mapped_column(ForeignKey("players.id"), unique=True)
    camp_level: Mapped[int] = mapped_column(Integer, default=1)
    wood: Mapped[int] = mapped_column(Integer, default=0)
    stone: Mapped[int] = mapped_column(Integer, default=0)
    cloth: Mapped[int] = mapped_column(Integer, default=0)
    # {"wood": "2026-07-01T12:00:00", "stone": "...", ...}
    last_gather: Mapped[dict] = mapped_column(JSON, default=dict)

    player: Mapped["Player"] = relationship()


class PlayerInventoryItem(Base):
    """NEW FEATURE: tracks shop items a player owns."""

    __tablename__ = "player_inventory_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    player_id: Mapped[int] = mapped_column(ForeignKey("players.id"))
    item_id: Mapped[int] = mapped_column(Integer)
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    purchased_at: Mapped[dt.datetime] = mapped_column(DateTime, default=dt.datetime.utcnow)
