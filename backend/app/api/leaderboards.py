from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def leaderboard() -> list[dict]:
    return [
        {"rank": 1, "name": "Mina", "xp": 9800},
        {"rank": 2, "name": "Sol", "xp": 8750},
        {"rank": 3, "name": "Luma", "xp": 8120},
    ]
