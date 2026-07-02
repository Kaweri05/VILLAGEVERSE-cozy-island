# VillageVerse

VillageVerse is a premium cozy island-life simulation project with a polished frontend and a FastAPI backend for authentication, inventory, marketplace, quests, NPCs, notifications, analytics, and AI-inspired features.

## Project Structure

- frontend/
  - package.json
  - tsconfig.json
  - next.config.js
  - postcss.config.js
  - tailwind.config.js
  - src/
    - pages/
      - _app.tsx
      - index.tsx
      - shop.tsx
      - inventory.tsx
      - quests.tsx
    - components/
      - FeatureCard.tsx
      - Layout.tsx
      - IslandScene.tsx
      - SectionCard.tsx
    - styles/
      - globals.css
- backend/
  - requirements.txt
  - Dockerfile
  - alembic/
  - app/
    - main.py
    - api/
      - api_router.py
      - game.py
      - inventory.py
      - search.py
      - npc.py
      - quests.py
      - marketplace.py
      - leaderboards.py
      - analytics.py
      - notifications.py
      - weather.py
    - auth/
    - core/
    - db/
    - models/
    - schemas/
    - services/

## Setup

1. Frontend:
   - cd frontend
   - npm install
   - npm run dev

2. Backend:
   - cd backend
   - python -m pip install -r requirements.txt
   - uvicorn app.main:app --reload

3. Docker:
   - docker compose up --build

## Local URLs

- Frontend: http://localhost:3000
- Backend docs: http://localhost:8000/docs

## Notes

- The frontend and backend have been refactored to support a more complete cozy game experience.
- The backend includes SQLAlchemy-ready models and API routes for gameplay and AI-style features.
- PostgreSQL is the intended production database, with Alembic scaffolding included.
