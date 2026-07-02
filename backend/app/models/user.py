from pydantic import BaseModel, EmailStr
from typing import List, Optional
from app.schemas.inventory import InventoryItemOut

class User(BaseModel):
    id: Optional[str]
    full_name: str
    email: EmailStr
    hashed_password: str
    created_at: str
    inventory: List[InventoryItemOut] = []
