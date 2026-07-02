from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "VillageVerse Backend"
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/villageverse"
    database_echo: bool = False
    jwt_secret: str = "supersecretkey"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60

    class Config:
        env_file = ".env"


settings = Settings()
