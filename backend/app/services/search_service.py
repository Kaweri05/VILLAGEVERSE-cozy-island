from typing import List

from app.schemas.search import SearchResult


def semantic_search(query: str) -> List[SearchResult]:
    sample_catalog = [
        {"item": "Sunset Berry Jam", "description": "Sweet preserve made from island berries.", "score": 0.95},
        {"item": "Moonlit Herb", "description": "A rare plant with calming energy.", "score": 0.88},
        {"item": "Coral Necklace", "description": "Decorative shell jewelry that boosts mood.", "score": 0.83},
    ]
    return [SearchResult(**item) for item in sample_catalog]
