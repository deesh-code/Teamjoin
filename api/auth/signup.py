
"""
This file handles the new user signup process.

It provides endpoints for users to sign up with their email and password.
The signup process involves two steps:
1.  The user provides their email, password, and name.
2.  The user verifies their email with an OTP that is sent to them.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from auth import supabase

# Create a new router for the signup endpoints
router = APIRouter()

# --- Pydantic Models ---

class UserCreate(BaseModel):
    """Represents the data that a user provides when they sign up."""
    email: str
    password: str
    name: str

class OtpVerify(BaseModel):
    """Represents the data that a user provides to verify their email with an OTP."""
    email: str
    token: str

# --- API Endpoints ---

@router.post("/signup")
async def start_signup_and_send_otp(user: UserCreate):
    """
    Starts the signup process for a new user.

    This endpoint takes the user's email, password, and name, and asks Supabase
    to send an OTP to the user's email address.
    """
    try:
        # Use the Supabase client to sign up the user.
        # Supabase will automatically send an email with an OTP to the user.
        # The user's name is stored in the raw_user_meta_data field in Supabase.
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {
                    "name": user.name
                }
            }
        })
        return {"message": "Sign-up request successful. An OTP has been sent to your email."}
    except Exception as e:
        # If the signup fails (e.g., the user already exists), raise an HTTPException.
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/verify-otp")
async def complete_signup_with_otp(payload: OtpVerify):
    """
    Completes the signup process by verifying the user's email with an OTP.

    This endpoint takes the user's email and the OTP they received, and asks
    Supabase to verify the OTP. If the OTP is correct, the user's account is
    created and they can now log in.
    """
    try:
        # Use the Supabase client to verify the OTP.
        response = supabase.auth.verify_otp({
            "type": "email",
            "email": payload.email,
            "token": payload.token,
        })
        return {"message": "Email verification successful. You can now log in."}
    except Exception as e:
        # If the OTP is incorrect, raise an HTTPException.
        raise HTTPException(status_code=400, detail=str(e))
