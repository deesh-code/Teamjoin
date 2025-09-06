
from fastapi import HTTPException
from auth import supabase
from . import models
import uuid
from typing import List

async def create_join_request(idea_id: uuid.UUID, user_id: uuid.UUID) -> models.IdeaMember:
    try:
        response = supabase.table('idea_members').insert({
            'idea_id': str(idea_id),
            'user_id': str(user_id),
            'status': 'pending'
        }).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create join request")

        return models.IdeaMember(**response.data[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_join_requests(idea_id: uuid.UUID, owner_id: uuid.UUID) -> List[models.IdeaMember]:
    try:
        # First, verify the current user is the owner of the idea
        idea_response = supabase.table('ideas').select('user_id').eq('id', str(idea_id)).execute()
        if not idea_response.data or idea_response.data[0]['user_id'] != str(owner_id):
            raise HTTPException(status_code=403, detail="Only the idea owner can view join requests")

        # If owner is verified, fetch the join requests
        response = supabase.table('idea_members').select('*').eq('idea_id', str(idea_id)).eq('status', 'pending').execute()
        
        if not response.data:
            return []

        return [models.IdeaMember(**row) for row in response.data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def update_join_request(request_id: uuid.UUID, status: str, owner_id: uuid.UUID) -> models.IdeaMember:
    try:
        # Verify the current user owns the idea associated with the request
        request_response = supabase.table('idea_members').select('idea_id').eq('id', str(request_id)).execute()
        if not request_response.data:
            raise HTTPException(status_code=404, detail="Join request not found")

        idea_id = request_response.data[0]['idea_id']
        idea_response = supabase.table('ideas').select('user_id').eq('id', str(idea_id)).execute()
        if not idea_response.data or idea_response.data[0]['user_id'] != str(owner_id):
            raise HTTPException(status_code=403, detail="Only the idea owner can update join requests")

        # Update the request status
        response = supabase.table('idea_members').update({'status': status}).eq('id', str(request_id)).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to update join request")

        return models.IdeaMember(**response.data[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def create_message(idea_id: uuid.UUID, sender_id: uuid.UUID, content: str) -> models.Message:
    try:
        # Verify the sender is a member of the idea
        membership_response = supabase.table('idea_members').select('*').eq('idea_id', str(idea_id)).eq('user_id', str(sender_id)).eq('status', 'accepted').execute()
        idea_owner_response = supabase.table('ideas').select('user_id').eq('id', str(idea_id)).execute()

        is_owner = idea_owner_response.data and idea_owner_response.data[0]['user_id'] == str(sender_id)

        if not membership_response.data and not is_owner:
            raise HTTPException(status_code=403, detail="You are not a member of this idea's chat")

        # Create the message
        response = supabase.table('messages').insert({
            'idea_id': str(idea_id),
            'sender_id': str(sender_id),
            'content': content
        }).execute()

        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create message")

        return models.Message(**response.data[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_messages(idea_id: uuid.UUID, user_id: uuid.UUID) -> List[models.Message]:
    try:
        # Verify the user is a member of the idea or the owner
        membership_response = supabase.table('idea_members').select('*').eq('idea_id', str(idea_id)).eq('user_id', str(user_id)).eq('status', 'accepted').execute()
        idea_owner_response = supabase.table('ideas').select('user_id').eq('id', str(idea_id)).execute()

        is_owner = idea_owner_response.data and idea_owner_response.data[0]['user_id'] == str(user_id)

        if not membership_response.data and not is_owner:
            raise HTTPException(status_code=403, detail="You are not authorized to view these messages")

        # Fetch messages
        response = supabase.table('messages').select('*').eq('idea_id', str(idea_id)).order('created_at').execute()

        if not response.data:
            return []

        return [models.Message(**row) for row in response.data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
