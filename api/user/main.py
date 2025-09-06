
from fastapi import APIRouter, Depends, HTTPException
from typing import List
from . import models, database
from auth.dependencies import get_current_user
from pydantic import BaseModel
from ideas.models import Idea

router = APIRouter()

class User(BaseModel):
    id: str
    email: str

@router.post("/profile", response_model=models.UserProfile)
async def create_profile(profile: models.UserProfileCreate, current_user: User = Depends(get_current_user)):
    db_profile = await database.get_user_profile(user_id=current_user.id)
    if db_profile:
        raise HTTPException(status_code=400, detail="Profile already exists")
    return await database.create_user_profile(user_id=current_user.id, profile=profile)

@router.get("/profile", response_model=models.UserProfile)
async def get_profile(current_user: User = Depends(get_current_user)):
    profile = await database.get_user_profile(user_id=current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile["email"] = current_user.email
    return profile

@router.put("/profile", response_model=models.UserProfile)
async def update_profile(profile: models.UserProfileUpdate, current_user: User = Depends(get_current_user)):
    return await database.update_user_profile(user_id=current_user.id, profile=profile)

@router.get("/ideas")
async def get_user_ideas(current_user: User = Depends(get_current_user)):
    # Fetch ideas where the user is the owner
    owner_ideas_response = database.supabase.table("ideas").select("*").eq("user_id", current_user.id).execute()
    
    # Fetch ideas where the user is a member
    member_ideas_response = await database.supabase.table("idea_members").select("idea_id").eq("user_id", current_user.id).eq("status", "accepted").execute()
    
    member_idea_ids = [item['idea_id'] for item in member_ideas_response.data]
    
    if not member_idea_ids:
        return owner_ideas_response.data

    ideas_response = await database.supabase.table("ideas").select("*").in_("id", member_idea_ids).execute()
    
    # Combine owner ideas and member ideas, avoiding duplicates
    owner_ideas = owner_ideas_response.data
    member_ideas = ideas_response.data
    
    combined_ideas = {idea['id']: idea for idea in owner_ideas}
    for idea in member_ideas:
        if idea['id'] not in combined_ideas:
            combined_ideas[idea['id']] = idea
            
    return list(combined_ideas.values())

@router.post("/profiles/batch")
async def get_users_profiles(user_ids: List[str]):
    try:
        response = await database.supabase.table("profiles").select("*").in_("uuid", user_ids).execute()
        if response.data:
            return response.data
        return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/teams", response_model=List[Idea])
async def get_user_teams(current_user: User = Depends(get_current_user)):
    response = await database.supabase.table("ideas").select("*").eq("user_id", current_user.id).execute()
    if response.data:
        return response.data
    return []
