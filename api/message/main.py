
import asyncio
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, Query
from . import models, database
from auth.dependencies import get_current_user, get_current_user_ws
from auth.models import User
from auth import supabase
import uuid
from typing import List
import json

router = APIRouter()

@router.post("/ideas/{idea_id}/join", response_model=models.IdeaMember)
async def request_to_join_idea(idea_id: uuid.UUID, current_user: User = Depends(get_current_user)):
    return await database.create_join_request(idea_id=idea_id, user_id=current_user.id)

@router.get("/ideas/{idea_id}/requests", response_model=List[models.IdeaMember])
async def get_idea_join_requests(idea_id: uuid.UUID, current_user: User = Depends(get_current_user)):
    return await database.get_join_requests(idea_id=idea_id, owner_id=current_user.id)

@router.put("/ideas/requests/{request_id}", response_model=models.IdeaMember)
async def update_idea_join_request(request_id: uuid.UUID, update: models.IdeaMemberUpdate, current_user: User = Depends(get_current_user)):
    return await database.update_join_request(request_id=request_id, status=update.status, owner_id=current_user.id)

@router.post("/ideas/{idea_id}/messages", response_model=models.Message)
async def send_message_to_idea_chat(idea_id: uuid.UUID, message: models.MessageCreate, current_user: User = Depends(get_current_user)):
    return await database.create_message(idea_id=idea_id, sender_id=current_user.id, content=message.content)

@router.websocket("/ws/ideas/{idea_id}/messages")
async def websocket_endpoint(websocket: WebSocket, idea_id: uuid.UUID, token: str = Query(...)):
    await websocket.accept()
    try:
        # TODO: This is not the most secure way to handle authentication for websockets.
        # The token is passed as a query parameter. A better approach would be to use
        # a more secure method like passing the token in the headers, but FastAPI websockets
        # do not directly support dependencies with headers.
        current_user = await get_current_user_ws(token)
        # Verify the user is a member of the idea or the owner
        membership_response = supabase.table('idea_members').select('*').eq('idea_id', str(idea_id)).eq('user_id', str(current_user.id)).eq('status', 'accepted').execute()
        idea_owner_response = supabase.table('ideas').select('user_id').eq('id', str(idea_id)).execute()

        is_owner = idea_owner_response.data and idea_owner_response.data[0]['user_id'] == str(current_user.id)

        if not membership_response.data and not is_owner:
            await websocket.close(code=4001, reason="You are not authorized to view these messages")
            return

        # Subscribe to the messages table
        channel = supabase.realtime.channel(f"idea_{idea_id}_messages")

        async def on_message(payload):
            if payload["table"] == "messages" and payload["schema"] == "public" and payload["eventType"] == "INSERT":
                if payload['new']['idea_id'] == str(idea_id):
                    await websocket.send_json(payload['new'])

        channel.on("postgres_changes", on_message)
        supabase.realtime.connect()
        channel.subscribe()

        while True:
            # Keep the connection alive
            await asyncio.sleep(1)
            await websocket.receive_text() # This is to check if the client is still connected

    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        print(f"Error: {e}")
        await websocket.close(code=1011)
