# 🏝️ VillageVerse — Cozy Island Life Simulation

> **Collect resources, run a pirate camp, shop for treasures, and build your own cozy island — with a live FastAPI backend and a Next.js frontend.**

[![Python](https://img.shields.io/badge/Python-3.10+-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-async-teal?logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?logo=next.js)](https://nextjs.org)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

---

## 🔗 Live Demo

> **[https://villageverse-cozy-island.vercel.app/](https://villageverse-cozy-island.vercel.app/)**

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#diagram-1--system-architecture)
- [Shop Purchase Pipeline](#diagram-2--shop-purchase-pipeline)
- [Frontend Page Routing](#diagram-3--frontend-page-routing)
- [API Endpoint Map](#diagram-4--api-endpoint-map)
- [Database Structure](#diagram-5--database-structure)
- [Deployment Pipeline](#diagram-6--deployment-pipeline)
- [User Guide Flowchart](#user-guide-flowchart)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [License](#license)

---

## Overview

VillageVerse is a full-stack cozy island-life simulation. Players browse and buy items in a themed marketplace, gather resources at a pirate camp to upgrade it over time, and build a login streak for daily coin rewards — all backed by a real, persistent FastAPI + SQLAlchemy backend rather than mock data.

---

## Features

| Feature | Description |
|---|---|
| 🛍️ **Live Shop** | 33-item catalog across 13 categories, real coin-based buying, item preview, theme filtering |
| 🏕️ **Pirate Camp** | Gather wood/stone/cloth from resource nodes on cooldowns, spend them to upgrade camp level |
| 🎁 **Daily Rewards** | Streak-based login rewards that grow the longer you keep your streak alive |
| 🎨 **3 Themes** | Cozy Day, Starlight Night, Pirate Camp — switchable from a header menu, persisted per-browser |
| 📱 **Swipe Navigation** | Mobile swipe-to-navigate between pages |
| ⚡ **Async Backend** | FastAPI + SQLAlchemy async engine, rate-limited via SlowAPI |

---

## Diagram 1 — System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER'S BROWSER                           │
│                                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌────────────┐  ┌─────────┐  │
│  │  index   │  │   shop.tsx   │  │ Layout.tsx │  │ Theme   │  │
│  │  .tsx    │  │ (buy/preview)│  │ (nav/theme)│  │ Context │  │
│  └────┬─────┘  └──────┬───────┘  └────────────┘  └─────────┘  │
│       │               │                                         │
│       │         fetch() calls                                   │
└───────┼───────────────┼─────────────────────────────────────────┘
        │               │  HTTP / REST
        ▼               ▼
┌─────────────────────────────────────────────────────────────────┐
│                 FASTAPI BACKEND  (app/main.py)                   │
│                                                                 │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────────────┐   │
│  │CORS +      │  │api_router.py │  │  Rate limiting         │   │
│  │startup hook│  │(combines all)│  │  (SlowAPI)             │   │
│  └────────────┘  └──────┬───────┘  └────────────────────────┘   │
│                         │                                       │
│          ┌──────────────┼──────────────┐                        │
│          ▼              ▼              ▼                        │
│   ┌────────────┐ ┌────────────┐ ┌────────────┐                 │
│   │  shop.py   │ │  camp.py   │ │  game.py   │                 │
│   │ (catalog,  │ │ (gather,   │ │ (daily     │                 │
│   │  buy)      │ │  upgrade)  │ │  reward)   │                 │
│   └──────┬─────┘ └──────┬─────┘ └──────┬─────┘                 │
│          └──────────────┼──────────────┘                        │
│                         ▼                                       │
│                  ┌─────────────┐                                │
│                  │ database.py │  (async SQLAlchemy session)    │
│                  └──────┬──────┘                                │
└─────────────────────────┼───────────────────────────────────────┘
                          ▼
              ┌───────────────────────┐
              │  PostgreSQL (prod)    │
              │  SQLite (local dev)   │
              └───────────────────────┘
```

---

## Diagram 2 — Shop Purchase Pipeline

```
                    ┌─────────────────────┐
                    │  Player browses shop │
                    │  GET /shop/items     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Click item card     │
                    │  Preview modal opens │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Click "Buy"          │
                    │  POST /shop/buy       │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Look up player by   │
                    │  username (or create)│
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  coins >= price?     │
                    └──────┬───────┬───────┘
                        YES│       │NO
                           │       ▼
                           │  ┌─────────────────────┐
                           │  │  400 error           │
                           │  │  "Not enough coins"  │
                           │  └─────────────────────┘
                           ▼
                    ┌─────────────────────┐
                    │  Deduct coins         │
                    │  player.coins -= price│
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Record ownership     │
                    │  PlayerInventoryItem  │
                    │  quantity += 1         │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Commit to database    │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  JSON response →       │
                    │  frontend updates coin │
                    │  balance + "Owned" tag │
                    └─────────────────────┘
```

---

## Diagram 3 — Frontend Page Routing

```
┌─────────────────────────────────────────────────────────────────┐
│                    _app.tsx  (Root wrapper)                     │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  ThemeProvider  (context/ThemeContext.tsx)                │  │
│   │  ┌───────────────────────────────────────────────────┐  │  │
│   │  │  Layout.tsx                                         │  │  │
│   │  │  ┌────────────┐   ┌───────────────────────────┐   │  │  │
│   │  │  │ Header nav │   │ Theme picker (top right)  │   │  │  │
│   │  │  └────────────┘   └───────────────────────────┘   │  │  │
│   │  │                                                     │  │  │
│   │  │   routed page content ▼                             │  │  │
│   │  │  ┌─────┬──────┬───────────┬────────┬───────────┐  │  │  │
│   │  │  │Home │ Shop │ Inventory │ Quests │  Admin    │  │  │  │
│   │  │  │  /  │/shop │/inventory │/quests │  /admin   │  │  │  │
│   │  │  └─────┴──────┴───────────┴────────┴───────────┘  │  │  │
│   │  │                                                     │  │  │
│   │  │  Bottom nav (mobile) + swipe navigation             │  │  │
│   │  │  (useSwipeNavigation hook)                          │  │  │
│   │  └───────────────────────────────────────────────────┘  │  │
│   └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Diagram 4 — API Endpoint Map

```
/api
 │
 ├── /game
 │    └── /daily-reward
 │         ├── GET  /status    → current streak, claimable?
 │         └── POST /claim     → award coins, extend streak
 │
 ├── /game/camp
 │    ├── GET  /status         → camp level, resources, cooldowns
 │    ├── POST /gather         → collect wood / stone / cloth
 │    └── POST /upgrade        → spend resources, raise camp level
 │
 └── /game/shop
      ├── GET  /items          → catalog (optional ?theme= filter)
      ├── GET  /owned          → player's coin balance + owned items
      └── POST /buy            → purchase an item, deduct coins
```

---

## Diagram 5 — Database Structure

```
┌─────────────────────┐
│       Player         │
├─────────────────────┤
│ id            PK     │
│ username      unique │
│ coins                │
│ created_at            │
└──────────┬───────────┘
           │ 1
           │
     ┌─────┴──────────────┬──────────────────────┬─────────────────────┐
     │ 1                  │ 1                     │ *                    │
     ▼                    ▼                       ▼                      │
┌─────────────────┐ ┌──────────────────┐ ┌───────────────────────────┐  │
│  DailyReward     │ │   PlayerCamp      │ │  PlayerInventoryItem      │  │
├─────────────────┤ ├──────────────────┤ ├───────────────────────────┤  │
│ id           PK  │ │ id            PK │ │ id                    PK  │  │
│ player_id    FK  │ │ player_id     FK │ │ player_id             FK  │  │
│ streak           │ │ camp_level        │ │ item_id  (catalog ref)   │  │
│ last_claimed_at  │ │ wood / stone      │ │ quantity                  │  │
│                  │ │ cloth             │ │ purchased_at               │  │
│                  │ │ last_gather (JSON)│ │                            │  │
└─────────────────┘ └──────────────────┘ └───────────────────────────┘
```

---

## Diagram 6 — Deployment Pipeline

```
┌─────────────┐    git push     ┌──────────────────┐
│  Local repo  │───────────────▶│  GitHub           │
│  (your PC)   │                │  main branch      │
└─────────────┘                └─────────┬─────────┘
                                          │ webhook
                                          ▼
                                ┌──────────────────────┐
                                │  Vercel build         │
                                │  reads vercel.json     │
                                └──────────┬───────────┘
                                           │
                       ┌───────────────────┼────────────────────┐
                       ▼                                        ▼
           ┌───────────────────────┐                ┌───────────────────────┐
           │  frontend service      │                │  backend service       │
           │  root: frontend/       │                │  root: backend/        │
           │  framework: nextjs     │                │  villageverse-backend/ │
           │  → npm run build       │                │  framework: fastapi    │
           └───────────┬───────────┘                └───────────┬───────────┘
                       │                                        │
              rewrites "/" here                    rewrites "/api/*" here
                       │                                        │
                       ▼                                        ▼
           ┌───────────────────────┐                ┌───────────────────────┐
           │   Public site           │                │  DATABASE_URL env var  │
           │  your-app.vercel.app   │                │  → Neon / Supabase      │
           └───────────────────────┘                │     PostgreSQL          │
                                                      └───────────────────────┘
```

---

## User Guide Flowchart

```
                        ┌─────────────────────┐
                        │  Open the app         │
                        │  localhost:3000        │
                        └──────────┬──────────┘
                                   │
                        ┌──────────▼──────────┐
                        │  What do you want    │
                        │  to do?               │
                        └──┬───────────────┬──┘
                           │               │
                  ┌────────▼──────┐ ┌──────▼────────────┐
                  │  Browse the    │ │  Visit the camp    │
                  │  shop           │ │  (via API/docs)    │
                  └────────┬──────┘ └──────┬────────────┘
                           │               │
                           ▼               ▼
              ┌───────────────────┐ ┌───────────────────────┐
              │  Filter by theme   │ │  Gather wood, stone,   │
              │  or category        │ │  or cloth (cooldowns  │
              │  Click item to      │ │  apply per resource)  │
              │  preview             │ └──────────┬────────────┘
              └─────────┬───────────┘             │
                        │                          ▼
                        ▼                ┌───────────────────────┐
              ┌───────────────────┐      │  Enough resources?     │
              │  Click "Buy"        │      └──┬──────────────┬───┘
              │  (needs enough      │       YES│              │NO
              │   coins)             │         ▼              ▼
              └─────────┬───────────┘  ┌──────────────┐ ┌──────────────┐
                        │              │  Upgrade camp │ │ Keep         │
                        ▼              │  level         │ │ gathering    │
              ┌───────────────────┐    └──────────────┘ └──────────────┘
              │  Item marked        │
              │  "Owned", coins      │
              │  balance updates     │
              └───────────────────┘

  ──────────────────────────────────────────────────────────────────
  THEME PICKER  (click the icon, top-right of header)
  ──────────────────────────────────────────────────────────────────
  Cozy Day       → light, sky-blue palette
  Starlight Night → deep indigo, night-sky palette
  Pirate Camp     → warm amber, sandy palette
  Choice is saved to your browser and persists across visits.
  ──────────────────────────────────────────────────────────────────
  TIPS
  ──────────────────────────────────────────────────────────────────
  • New players start with 1000 coins automatically
  • Each resource node has its own cooldown — rotate between them
  • Camp upgrade costs increase each level, but so does gather yield
  • Check /docs on the backend for the full interactive API reference
  ──────────────────────────────────────────────────────────────────
```

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/Kaweri05/VILLAGEVERSE-cozy-island.git
cd VILLAGEVERSE-cozy-island

# 2. Backend setup
cd backend/villageverse-backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# → runs at http://127.0.0.1:8000
# → interactive docs at http://127.0.0.1:8000/docs

# 3. Frontend setup (in a second terminal)
cd frontend
npm install
npm run dev
# → runs at http://localhost:3000
```

Keep both terminals running at the same time — the frontend calls the backend directly over HTTP.

---

## Environment Variables

Backend `.env` (in `backend/villageverse-backend/`):

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | `sqlite+aiosqlite:///./villageverse.db` locally, or a Postgres connection string in production |
| `DATABASE_ECHO` | No | `true` to log all SQL statements |
| `JWT_SECRET` | Yes | Secret key for future auth work |
| `JWT_ALGORITHM` | No | Defaults to `HS256` |
| `JWT_EXPIRE_MINUTES` | No | Defaults to `60` |

In Vercel, set `DATABASE_URL` under **Project Settings → Environment Variables** to your hosted Postgres (Neon/Supabase) connection string, using the `postgresql+asyncpg://` prefix.

---

## Project Structure

See `structure.txt` for the full file tree.

```
VillageVerse/
├── frontend/                  # Next.js app
├── backend/
│   └── villageverse-backend/  # FastAPI application
├── vercel.json                # Multi-service deployment config
└── docker-compose.yml         # Local Postgres + backend container setup
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Python 3.10+, FastAPI, SlowAPI (rate limiting) |
| **ORM / DB** | SQLAlchemy (async), PostgreSQL (prod) / SQLite (dev) |
| **Config** | Pydantic Settings |
| **Deployment** | Vercel (Services: frontend + backend), Neon/Supabase Postgres |
| **Version Control** | Git + GitHub |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License. It is an original educational/portfolio project inspired by the cozy life-simulation genre and is not affiliated with or endorsed by Nintendo or any other game publisher.

---

<p align="center">Made with 🏝️ by Kaweri Harinkhede</p>
