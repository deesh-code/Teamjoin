import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List, Optional
from .models import Idea
from auth.dependencies import get_current_user
from auth.models import User
from user.database import supabase
from uuid import UUID

router = APIRouter()

@router.get("/", response_model=List[Idea])
async def get_ideas():
    try:
        ideas_response = supabase.table("ideas").select("*").execute()
        if not ideas_response.data:
            return []
        
        ideas = ideas_response.data
        idea_ids = [idea['id'] for idea in ideas]
        
        members_response = supabase.table("idea_members").select("*").in_("idea_id", idea_ids).execute()
        members_by_idea = {}
        if members_response.data:
            for member in members_response.data:
                if member['idea_id'] not in members_by_idea:
                    members_by_idea[member['idea_id']] = []
                members_by_idea[member['idea_id']].append(member)
        
        for idea in ideas:
            idea["members"] = members_by_idea.get(idea['id'], [])
            
        return ideas
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=Idea)
async def create_idea(
    title: str = Form(...),
    sub_title: str = Form(...),
    full_explained_idea: str = Form(...),
    image_url: Optional[str] = Form(None),
    current_user: User = Depends(get_current_user)
):
    try:
        response = supabase.table("ideas").insert({
            "title": title,
            "sub_title": sub_title,
            "full_explained_idea": full_explained_idea,
            "user_id": str(current_user.id),
            "image_url": image_url
        }).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create idea in database")

        return response.data[0]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not create idea: {e}")

@router.post("/create_upload_url")
async def create_upload_url(file_name: str, current_user: User = Depends(get_current_user)):
    try:
        bucket_name = os.getenv("SUPABASE_STORAGE_BUCKET", "ideas")
        file_path = f"{current_user.id}/{file_name}"
        signed_url = supabase.storage.from_(bucket_name).create_signed_upload_url(file_path)
        return {"signed_url": signed_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create signed URL: {e}")

@router.get("/{idea_id}", response_model=Idea)
async def get_idea(idea_id: UUID):
    try:
        response = supabase.table("ideas").select("*").eq("id", str(idea_id)).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Idea not found")
        
        idea_data = response.data[0]
        
        # Fetch members
        members_response = supabase.table("idea_members").select("*").eq("idea_id", str(idea_id)).execute()
        idea_data["members"] = members_response.data if members_response.data else []
        
        return idea_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{idea_id}/join")
async def join_idea(idea_id: UUID, current_user: User = Depends(get_current_user)):
    try:
        # Check if the user has already requested to join
        existing_request = supabase.table("idea_members").select("*").eq("idea_id", str(idea_id)).eq("user_id", str(current_user.id)).execute()
        if existing_request.data:
            raise HTTPException(status_code=400, detail="You have already requested to join this idea.")

        response = supabase.table("idea_members").insert({
            "idea_id": str(idea_id),
            "user_id": str(current_user.id),
            "status": "pending"
        }).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to join idea in database")

        return response.data[0]

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not join idea: {e}")
