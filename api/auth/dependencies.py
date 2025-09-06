"""
This file contains dependencies that are used across the authentication module.

Dependencies are a way to share logic and data between different parts of the
application. In this case, we are using a dependency to get the currently
logged-in user.
"""

from fastapi import Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordBearer
from auth import supabase

# This is the scheme that FastAPI uses to know how to handle the authentication.
# We are telling it that the token will be sent in the authorization header as a Bearer token.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    This is a dependency function that gets the currently logged-in user.

    It takes the JWT access token from the request's Authorization header, sends it
    to Supabase to verify it, and returns the user's information if the token is valid.

    If the token is invalid, it raises an HTTPException, which tells the client
    that they are not authorized.

    Args:
        token: The JWT access token from the request's Authorization header.

    Returns:
        The user object from Supabase if the token is valid.
    """
    try:
        # Send the token to Supabase to get the user information
        user_response = supabase.auth.get_user(token)
        # The actual user data is in the .user attribute of the response
        return user_response.user
    except Exception as e:
        # If anything goes wrong (e.g., the token is invalid or expired),
        # we raise an HTTPException to let the client know they are not authorized.
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user_ws(token: str = Query(...)):
    """
    This is a dependency function that gets the currently logged-in user for websockets.

    It takes the JWT access token from the query parameters, sends it
    to Supabase to verify it, and returns the user's information if the token is valid.

    If the token is invalid, it raises an HTTPException, which tells the client
    that they are not authorized.

    Args:
        token: The JWT access token from the query parameters.

    Returns:
        The user object from Supabase if the token is valid.
    """
    try:
        # Send the token to Supabase to get the user information
        user_response = supabase.auth.get_user(token)
        # The actual user data is in the .user attribute of the response
        return user_response.user
    except Exception as e:
        # If anything goes wrong (e.g., the token is invalid or expired),
        # we raise an HTTPException to let the client know they are not authorized.
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
