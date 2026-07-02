from pydantic import BaseModel

class InventoryItemCreate(BaseModel):
    name: str
    category: str
    quantity: int
    notes: str | None = None

class InventoryItemOut(InventoryItemCreate):
    pass
