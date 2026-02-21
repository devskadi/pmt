# Application Configuration
# -------------------------
# Pydantic BaseSettings for env-driven config.

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # ---- Application ----
    APP_NAME: str = "PMT"
    APP_VERSION: str = "0.1.0"
    ENVIRONMENT: str = "development"  # development | staging | production | test
    DEBUG: bool = False

    # ---- Database ----
    DATABASE_URL: str = "postgresql+asyncpg://pmt:pmt@localhost:5432/pmt"

    # ---- Redis ----
    REDIS_URL: str = "redis://localhost:6379/0"

    # ---- Auth / JWT ----
    SECRET_KEY: str = "CHANGE-ME-IN-PRODUCTION"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    JWT_ALGORITHM: str = "HS256"

    # ---- CORS ----
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]

    # ---- Pagination ----
    DEFAULT_PAGE_SIZE: int = 20
    MAX_PAGE_SIZE: int = 100

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def is_test(self) -> bool:
        return self.ENVIRONMENT == "test"


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance. Call once at startup."""
    return Settings()

