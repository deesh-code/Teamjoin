"""
This file contains functions for interacting with the 'profiles' table in the Supabase database.

It provides a clean interface for creating, retrieving, and updating user profiles.
"""

from fastapi import HTTPException
from auth import supabase
from . import models
import logging

# Configure logging to show informative messages
logging.basicConfig(level=logging.INFO)

async def create_user_profile(user_id: str, profile: models.UserProfileCreate):
    """
    Creates a new user profile in the 'profiles' table.

    Args:
        user_id: The UUID of the user (from Supabase Authentication).
        profile: A UserProfileCreate object containing the profile data.

    Returns:
        The created user profile data.

    Raises:
        HTTPException: If the profile creation fails or no data is returned.
    """
    try:
        # Insert the new profile data into the 'profiles' table.
        # The 'uuid' field links this profile to the user in Supabase Auth.
        response = supabase.table('profiles').insert({
            'uuid': user_id,
            'user_data': profile.user_data,
            'skills': profile.skills
        }).execute()

        # Check if data was actually returned from the insert operation
        if not response.data:
            logging.error("Failed to create profile: No data returned from Supabase after insert.")
            raise HTTPException(status_code=500, detail="Failed to create profile: No data returned.")

        # Return the first (and only) item from the response data
        return response.data[0]
    except Exception as e:
        # Log the error for debugging purposes and raise an HTTPException
        logging.error(f"Error creating profile for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create profile: {e}")

async def get_user_profile(user_id: str):
    """
    Retrieves a user profile from the 'profiles' table by their user ID.

    Args:
        user_id: The UUID of the user.

    Returns:
        The user profile data if found, otherwise None.

    Raises:
        HTTPException: If there's an error during the retrieval process.
    """
    try:
        # Select all columns from the 'profiles' table where the 'uuid' matches the user_id.
        response = supabase.table('profiles').select('*').eq('uuid', user_id).execute()

        # If no data is found, return None
        if not response.data:
            return None

        # Return the first (and only) item from the response data
        return response.data[0]
    except Exception as e:
        # Log the error and raise an HTTPException
        logging.error(f"Error getting profile for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve profile: {e}")

async def update_user_profile(user_id: str, profile: models.UserProfileUpdate):
    """
    Updates an existing user profile in the 'profiles' table.

    Args:
        user_id: The UUID of the user whose profile is to be updated.
        profile: A UserProfileUpdate object containing the updated profile data.

    Returns:
        The updated user profile data.

    Raises:
        HTTPException: If the profile update fails or no data is returned.
    """
    try:
        # Update the profile data in the 'profiles' table for the given user_id.
        response = supabase.table('profiles').update({
            'user_data': profile.user_data,
            'skills': profile.skills
        }).eq('uuid', user_id).execute()

        # Check if data was actually returned from the update operation
        if not response.data:
            logging.error("Failed to update profile: No data returned from Supabase after update.")
            raise HTTPException(status_code=500, detail="Failed to update profile: No data returned.")

        # Return the first (and only) item from the response data
        return response.data[0]
    except Exception as e:
        # Log the error and raise an HTTPException
        logging.error(f"Error updating profile for user {user_id}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {e}")