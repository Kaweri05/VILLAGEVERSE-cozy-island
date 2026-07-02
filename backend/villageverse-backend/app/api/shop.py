from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.database import get_db
from app.models.game_models import Player, PlayerInventoryItem

router = APIRouter(prefix="/game/shop", tags=["shop"])

# Same 10 items as the frontend's mock catalog, now tagged by theme
# so the shop page can filter alongside the day/night/pirate picker.
CATALOG = [
    # Furniture
    {"id": 1, "name": "Sunbeam Lantern", "category": "Furniture", "price": 680, "stock": 8,
     "rarity": "Rare", "description": "A glowing lantern that warms every evening path.",
     "emoji": "🏮", "theme": "pirate"},
    {"id": 2, "name": "Mossy Bench", "category": "Furniture", "price": 340, "stock": 13,
     "rarity": "Uncommon", "description": "A soft, weathered seat for seaside conversations.",
     "emoji": "🪑", "theme": "day"},
    {"id": 3, "name": "Driftwood Table", "category": "Furniture", "price": 420, "stock": 9,
     "rarity": "Uncommon", "description": "Salvaged timber shaped into a sturdy low table.",
     "emoji": "🪵", "theme": "pirate"},
    {"id": 4, "name": "Starlit Hammock", "category": "Furniture", "price": 590, "stock": 6,
     "rarity": "Rare", "description": "Sway gently under a sky full of stars.",
     "emoji": "🛏️", "theme": "night"},
    # Clothing
    {"id": 5, "name": "Whisper Coat", "category": "Clothing", "price": 410, "stock": 6,
     "rarity": "Rare", "description": "A cloud-soft layer for moonlit strolls.",
     "emoji": "🧥", "theme": "night"},
    {"id": 6, "name": "Captain's Bandana", "category": "Clothing", "price": 150, "stock": 30,
     "rarity": "Common", "description": "A weathered scarf for salty sea air.",
     "emoji": "🧣", "theme": "pirate"},
    {"id": 7, "name": "Sunhat of Petals", "category": "Clothing", "price": 200, "stock": 22,
     "rarity": "Common", "description": "Woven straw dressed with fresh blossoms.",
     "emoji": "👒", "theme": "day"},
    # Fish
    {"id": 8, "name": "Moonfish", "category": "Fish", "price": 540, "stock": 5,
     "rarity": "Rare", "description": "An elegant catch for late-night fishing trips.",
     "emoji": "🐟", "theme": "night"},
    {"id": 9, "name": "Treasure Pufferfish", "category": "Fish", "price": 310, "stock": 11,
     "rarity": "Uncommon", "description": "Puffs up when it senses buried gold nearby.",
     "emoji": "🐡", "theme": "pirate"},
    {"id": 10, "name": "Sunfin Tetra", "category": "Fish", "price": 120, "stock": 28,
     "rarity": "Common", "description": "A cheerful little fish that loves shallow water.",
     "emoji": "🐠", "theme": "day"},
    # Bugs
    {"id": 11, "name": "Golden Beetle", "category": "Bugs", "price": 950, "stock": 3,
     "rarity": "Epic", "description": "Rare collector treasure with luminous shine.",
     "emoji": "🐞", "theme": "pirate"},
    {"id": 12, "name": "Firefly Lantern Bug", "category": "Bugs", "price": 280, "stock": 15,
     "rarity": "Uncommon", "description": "Glows softly, lighting up the night camp.",
     "emoji": "✨", "theme": "night"},
    # Fossils
    {"id": 13, "name": "Buried Sea Skull", "category": "Fossils", "price": 700, "stock": 4,
     "rarity": "Rare", "description": "An ancient relic pulled from a sandy dig site.",
     "emoji": "🦴", "theme": "pirate"},
    {"id": 14, "name": "Coral Imprint Stone", "category": "Fossils", "price": 260, "stock": 12,
     "rarity": "Uncommon", "description": "A fossilized coral pattern, smooth to the touch.",
     "emoji": "🪨", "theme": "day"},
    # Flowers
    {"id": 15, "name": "Pineapple Bloom", "category": "Flowers", "price": 220, "stock": 24,
     "rarity": "Common", "description": "Bright tropical petals that sway with the breeze.",
     "emoji": "🌺", "theme": "day"},
    {"id": 16, "name": "Dawn Orchid", "category": "Flowers", "price": 360, "stock": 10,
     "rarity": "Rare", "description": "Petals that bloom during the first light of day.",
     "emoji": "🌼", "theme": "day"},
    {"id": 17, "name": "Nightshade Lily", "category": "Flowers", "price": 300, "stock": 14,
     "rarity": "Uncommon", "description": "Opens only after the stars come out.",
     "emoji": "🌸", "theme": "night"},
    # Fruits
    {"id": 18, "name": "Ripe Mango Cluster", "category": "Fruits", "price": 90, "stock": 35,
     "rarity": "Common", "description": "Sweet, sun-warmed fruit fresh off the branch.",
     "emoji": "🥭", "theme": "day"},
    {"id": 19, "name": "Coconut Bundle", "category": "Fruits", "price": 110, "stock": 26,
     "rarity": "Common", "description": "A trio of coconuts, perfect for camp cooking.",
     "emoji": "🥥", "theme": "pirate"},
    # Trees
    {"id": 20, "name": "Cedar Sapling", "category": "Trees", "price": 180, "stock": 21,
     "rarity": "Common", "description": "A young tree for a cozy canopy of shade.",
     "emoji": "🌲", "theme": "day"},
    {"id": 21, "name": "Leaning Palm", "category": "Trees", "price": 250, "stock": 17,
     "rarity": "Uncommon", "description": "A wind-bent palm, perfect over a camp.",
     "emoji": "🌴", "theme": "pirate"},
    # Wallpaper
    {"id": 22, "name": "Tidal Wallpaper", "category": "Wallpaper", "price": 260, "stock": 12,
     "rarity": "Uncommon", "description": "Gentle wave patterns for a calm interior retreat.",
     "emoji": "🖼️", "theme": "night"},
    {"id": 23, "name": "Sailcloth Wallpaper", "category": "Wallpaper", "price": 230, "stock": 16,
     "rarity": "Common", "description": "Canvas-textured walls with a nautical feel.",
     "emoji": "⛵", "theme": "pirate"},
    # Flooring
    {"id": 24, "name": "Sandy Plank Flooring", "category": "Flooring", "price": 200, "stock": 18,
     "rarity": "Common", "description": "Warm wooden planks dusted with sand.",
     "emoji": "🟫", "theme": "pirate"},
    {"id": 25, "name": "Starlight Tile", "category": "Flooring", "price": 320, "stock": 9,
     "rarity": "Uncommon", "description": "Tiles that shimmer faintly after dark.",
     "emoji": "🔷", "theme": "night"},
    # Seasonal Items
    {"id": 26, "name": "Starlight Market Lantern", "category": "Seasonal Items", "price": 480, "stock": 7,
     "rarity": "Rare", "description": "A festival favorite from the moonlit market.",
     "emoji": "🎐", "theme": "night"},
    {"id": 27, "name": "Buried Treasure Chest", "category": "Seasonal Items", "price": 890, "stock": 4,
     "rarity": "Epic", "description": "Limited seasonal find — said to hold rare loot.",
     "emoji": "🧰", "theme": "pirate"},
    # Food
    {"id": 28, "name": "Citrus Tart", "category": "Food", "price": 140, "stock": 19,
     "rarity": "Common", "description": "A sweet treat with island citrus notes.",
     "emoji": "🍰", "theme": "day"},
    {"id": 29, "name": "Campfire Skewers", "category": "Food", "price": 100, "stock": 24,
     "rarity": "Common", "description": "Grilled over an open flame, smoky and warm.",
     "emoji": "🍢", "theme": "pirate"},
    {"id": 30, "name": "Moon Cake Slice", "category": "Food", "price": 170, "stock": 16,
     "rarity": "Uncommon", "description": "A soft cake best enjoyed under moonlight.",
     "emoji": "🥮", "theme": "night"},
    # Tools
    {"id": 31, "name": "Ocean Map", "category": "Tools", "price": 310, "stock": 8,
     "rarity": "Epic", "description": "Charts hidden paths across the tide.",
     "emoji": "🗺️", "theme": "pirate"},
    {"id": 32, "name": "Garden Trowel", "category": "Tools", "price": 90, "stock": 30,
     "rarity": "Common", "description": "A reliable little tool for planting season.",
     "emoji": "🛠️", "theme": "day"},
    {"id": 33, "name": "Star Compass", "category": "Tools", "price": 260, "stock": 12,
     "rarity": "Uncommon", "description": "Points true north, even under a cloudy sky.",
     "emoji": "🧭", "theme": "night"},
]

CATALOG_BY_ID = {item["id"]: item for item in CATALOG}


async def _get_or_create_player(db: AsyncSession, username: str) -> Player:
    result = await db.execute(select(Player).where(Player.username == username))
    player = result.scalar_one_or_none()
    if player is None:
        player = Player(username=username, coins=1000)  # starter coins so buying is testable
        db.add(player)
        await db.flush()
    return player


@router.get("/items")
async def list_items(theme: str | None = None):
    if theme is None:
        return {"items": CATALOG}
    filtered = [item for item in CATALOG if item["theme"] == theme]
    return {"items": filtered}


@router.get("/owned")
async def owned_items(username: str, db: AsyncSession = Depends(get_db)):
    player = await _get_or_create_player(db, username)
    result = await db.execute(select(PlayerInventoryItem).where(PlayerInventoryItem.player_id == player.id))
    rows = result.scalars().all()
    await db.commit()

    owned = {row.item_id: row.quantity for row in rows}
    return {"username": username, "coins": player.coins, "owned": owned}


@router.post("/buy")
async def buy_item(username: str, item_id: int, db: AsyncSession = Depends(get_db)):
    item = CATALOG_BY_ID.get(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found.")

    player = await _get_or_create_player(db, username)
    if player.coins < item["price"]:
        raise HTTPException(
            status_code=400,
            detail={"message": "Not enough coins.", "have": player.coins, "need": item["price"]},
        )

    player.coins -= item["price"]

    result = await db.execute(
        select(PlayerInventoryItem).where(
            PlayerInventoryItem.player_id == player.id,
            PlayerInventoryItem.item_id == item_id,
        )
    )
    owned_row = result.scalar_one_or_none()
    if owned_row is None:
        owned_row = PlayerInventoryItem(player_id=player.id, item_id=item_id, quantity=1)
        db.add(owned_row)
    else:
        owned_row.quantity += 1

    await db.commit()

    return {
        "username": username,
        "item_id": item_id,
        "item_name": item["name"],
        "remaining_coins": player.coins,
        "quantity_owned": owned_row.quantity,
    }
