from fastapi import APIRouter
from pydantic import BaseModel, EmailStr
from supabase import create_client, Client
from typing import Optional
import os
#chat gpt suggestion for security
auth_router = APIRouter()

# Hardcoded Supabase credentials (from .env, but hardcoded later bro )
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://zsypwncamaojkufxehwh.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzeXB3bmNhbWFvamt1ZnhlaHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2NzA2NjgsImV4cCI6MjA3MDI0NjY2OH0.Mznlqpm730QEUm0uK6vyiE_CfDe3NpRGhsV3pC2Q6yY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

""" made different class for different fuction.. best for data safety ..not mix of data """
class UserSignup(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class ForgotPassword(BaseModel):
    email: EmailStr

class VerifyOTP(BaseModel):
    email: EmailStr
    token: str

# for take caring reponse .. 
class AuthResponse(BaseModel):
    success: bool
    message: str
    data: Optional[dict] = None

# Routeinng we can adjust 
''' Routeinng  the logic and url routefor auth '''
@auth_router.post("/auth/signup", response_model=AuthResponse)
async def signup(user_data: UserSignup):
    try:
        user = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "full_name": user_data.full_name
                }
            }
        })
        return AuthResponse(success=True, message="Signup successful. Please check your email for the OTP.")
    except Exception as e:
        return AuthResponse(success=False, message=str(e))

@auth_router.post("/auth/verify-otp", response_model=AuthResponse)
async def verify_otp(otp_data: VerifyOTP):
    try:
        session = supabase.auth.verify_otp({
            "email": otp_data.email,
            "token": otp_data.token,
            "type": "signup"
        })
        return AuthResponse(success=True, message="OTP verification successful. You are now logged in.", data=session.model_dump())
    except Exception as e:
        return AuthResponse(success=False, message=str(e))

@auth_router.post("/auth/login", response_model=AuthResponse)
async def login(user_data: UserLogin):
    try:
        session = supabase.auth.sign_in_with_password({
            "email": user_data.email,
            "password": user_data.password
        })
        user = supabase.auth.get_user(session.session.access_token)
        full_name = user.user.user_metadata.get('full_name', '')
        ''' just demo line .. for user profile'''
        return AuthResponse(success=True, message=f"Welcome back, {full_name}!", data=session.model_dump())
    except Exception as e:
        return AuthResponse(success=False, message=str(e))

@auth_router.post("/auth/forgot-password", response_model=AuthResponse)
async def forgot_password(forgot_data: ForgotPassword):
    try:
        supabase.auth.reset_password_for_email(email=forgot_data.email)
        return AuthResponse(success=True, message="Password reset email sent.")
    except Exception as e:
        return AuthResponse(success=False, message=str(e))