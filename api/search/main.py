from fastapi import APIRouter, Depends, Query
from typing import List
from ideas.models import Idea
from user.database import supabase
from auth.dependencies import get_current_user
from auth.models import User
from .models import SearchResult

router = APIRouter()

@router.get("/", response_model=List[SearchResult])
async def search_all(
    q: str = Query(..., min_length=3),
    current_user: User = Depends(get_current_user)
):
    results = []

    # Search for ideas
    ideas_response = supabase.table("ideas").select("*").or_(f"title.ilike.%{q}%,full_explained_idea.ilike.%{q}%").execute()
    if ideas_response.data:
        for item in ideas_response.data:
            results.append(SearchResult(type="idea", data=item))

    # Search for users by name
    users_response = supabase.table("profiles").select("*, user:users(email)").ilike("user_data->>name", f"%{q}%").execute()
    if users_response.data:
        for item in users_response.data:
            results.append(SearchResult(type="user", data=item))

    

    return results