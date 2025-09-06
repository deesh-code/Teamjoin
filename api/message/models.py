
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uuid

class IdeaMember(BaseModel):
    id: uuid.UUID
    idea_id: uuid.UUID
    user_id: uuid.UUID
    status: str
    created_at: datetime

    class Config:
        orm_mode = True

class IdeaMemberCreate(BaseModel):
    idea_id: uuid.UUID
    user_id: uuid.UUID

class IdeaMemberUpdate(BaseModel):
    status: str

class Message(BaseModel):
    id: uuid.UUID
    idea_id: uuid.UUID
    sender_id: uuid.UUID
    content: str
    created_at: datetime

    class Config:
        orm_mode = True

class MessageCreate(BaseModel):
    content: str
