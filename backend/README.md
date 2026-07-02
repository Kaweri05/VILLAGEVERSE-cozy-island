# VillageVerse Backend

This backend provides a cozy island-life simulation API layer for VillageVerse with:

- FastAPI
- SQLAlchemy
- PostgreSQL-ready async database support
- JWT auth
- Inventory and marketplace routes
- Quests, NPC, weather, analytics, and notifications
- AI-inspired recommendations and pricing helpers

## Run locally

1. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

2. Create a PostgreSQL database named `villageverse`

3. Copy `.env.example` to `.env` and update the values

4. Start the API
   ```bash
   uvicorn app.main:app --reload
   ```

## API overview

- `/api/auth/register`
- `/api/auth/token`
- `/api/game/inventory`
- `/api/game/marketplace`
- `/api/game/search`
- `/api/game/weather`
- `/api/npc/chat`
- `/api/quests`
- `/api/leaderboards`
- `/api/analytics`
- `/api/notifications`
