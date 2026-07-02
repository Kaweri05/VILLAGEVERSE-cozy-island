import os
from motor.motor_asyncio import AsyncIOMotorClient
from app.utils.settings import Settings

_settings = Settings()
_client: AsyncIOMotorClient | None = None


def get_app_settings() -> Settings:
    return _settings


def get_database():
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(_settings.mongo_uri)
    return _client[_settings.mongo_db]
