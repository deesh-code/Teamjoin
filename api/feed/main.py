from fastapi import APIRouter
from typing import List
from ideas.models import Idea
from user.database import supabase

router = APIRouter()

@router.get("/", response_model=List[Idea])
async def get_feed():
    response = supabase.table("ideas").select("*").execute()
    if response.data:
        return response.data
    return []