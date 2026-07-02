from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def marketplace() -> list[dict]:
    return [
        {"id": 1, "name": "Sunbeam Lantern", "category": "Furniture", "price": 680, "stock": 8, "rarity": "Rare"},
        {"id": 2, "name": "Pineapple Bloom", "category": "Flowers", "price": 220, "stock": 24, "rarity": "Common"},
    ]
