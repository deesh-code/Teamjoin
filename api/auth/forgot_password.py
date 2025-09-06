
"""
This file handles the forgot password functionality.

It provides endpoints for users to request a password reset link and to update
their password after they have been authenticated with a temporary token.
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from auth import supabase
from auth.dependencies import get_current_user

# Create a new router for the forgot password endpoints
router = APIRouter()

# --- Pydantic Models ---

class ForgotPassword(BaseModel):
    """Represents the data that a user provides to request a password reset."""
    email: str

class UpdatePassword(BaseModel):
    """Represents the data that a user provides to update their password."""
    password: str

# --- API Endpoints ---

@router.post("/forgot-password")
async def request_password_reset(payload: ForgotPassword):
    """
    Sends a password reset link to the user's email address.

    This endpoint takes the user's email and asks Supabase to send them an
    email with a link to reset their password.
    """
    try:
        # Use the Supabase client to send a password reset email.
        supabase.auth.reset_password_email(payload.email)
        return {"message": "Password reset email sent. Please check your inbox."}
    except Exception as e:
        # If anything goes wrong, raise an HTTPException.
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/update-password")
async def update_user_password(payload: UpdatePassword, current_user = Depends(get_current_user)):
    """
    Updates the user's password.

    This endpoint is used after the user has clicked the password reset link in
    their email and has been redirected back to the application. The user will
    be authenticated with a temporary token, which is used to authorize this request.
    """
    try:
        # The get_current_user dependency will handle the token verification.
        # If the token is valid, we can update the user's password.
        supabase.auth.update_user({"password": payload.password})
        return {"message": "Password updated successfully."}
    except Exception as e:
        # If the token is invalid or expired, the get_current_user dependency will
        # raise an HTTPException, so we don't need to handle it here.
        # This catch block is for any other unexpected errors.
        raise HTTPException(status_code=500, detail=str(e))
