from random import randint
from typing import List


class GameService:
    @staticmethod
    def generate_daily_tips() -> List[str]:
        return [
            "Planting flowers near your path boosts village happiness.",
            "Fishing during dawn increases rare catch odds.",
            "Crafting before dusk gives a small XP bonus.",
        ]

    @staticmethod
    def predict_market_price(item_name: str) -> int:
        base = {"lantern": 220, "flower": 160, "fish": 310, "bug": 520}.get(item_name.lower(), 180)
        return base + randint(0, 40)

    @staticmethod
    def recommend_items(user_level: int) -> List[str]:
        if user_level >= 5:
            return ["Moonlit Lantern", "Rare Orchid", "Golden Net"]
        return ["Cozy Chair", "Garden Seed", "Sunbeam Lamp"]
