from fastapi import APIRouter, Depends
from typing import List
from app.schemas.search import SearchRequest, SearchResult
from app.utils.auth import get_current_user
from app.services.search_service import semantic_search

router = APIRouter()

@router.post("/", response_model=List[SearchResult])
async def search_items(request: SearchRequest, current_user: dict = Depends(get_current_user)):
    return await semantic_search(request.query)
