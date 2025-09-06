from pydantic import BaseModel
from typing import Optional, List
from message.models import IdeaMember

class Idea(BaseModel):
    id: str
    title: str
    sub_title: str
    full_explained_idea: str
    user_id: str
    image_url: Optional[str] = None
    members: List[IdeaMember] = []

class IdeaCreate(BaseModel):
    title: str
    sub_title: str
    full_explained_idea: str
    image_url: Optional[str] = None