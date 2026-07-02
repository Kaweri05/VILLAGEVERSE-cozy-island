from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.inventory import InventoryItemCreate, InventoryItemOut
from app.utils.auth import get_current_user
from app.utils.db import get_database

router = APIRouter()

@router.get("/", response_model=List[InventoryItemOut])
async def list_inventory(current_user: dict = Depends(get_current_user)):
    db = get_database()
    user = await db.users.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return [InventoryItemOut(**item) for item in user.get("inventory", [])]

@router.post("/add", response_model=InventoryItemOut)
async def add_inventory_item(item: InventoryItemCreate, current_user: dict = Depends(get_current_user)):
    db = get_database()
    item_data = item.dict()
    result = await db.users.update_one(
        {"email": current_user["email"]},
        {"$push": {"inventory": item_data}},
    )
    if result.modified_count != 1:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to add inventory item")
    return InventoryItemOut(**item_data)
