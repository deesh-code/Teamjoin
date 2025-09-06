"""
This file defines the Pydantic models for the user profile.

Pydantic models are used to define the data structures for the API. They are
used for data validation, serialization, and documentation.
"""

from pydantic import BaseModel
from typing import Optional, Dict, Any

class UserProfileBase(BaseModel):
    """The base model for a user profile. It contains the common fields."""
    user_data: Optional[Dict[str, Any]] = None
    skills: Optional[Dict[str, Any]] = None

class UserProfileCreate(UserProfileBase):
    """The model for creating a new user profile."""
    pass

class UserProfileUpdate(UserProfileBase):
    """The model for updating an existing user profile."""
    pass

class UserProfile(UserProfileBase):
    """The model for representing a user profile, including the user's ID."""
    uuid: str
    email: str

    class Config:
        """This tells Pydantic to work with ORM objects, which is useful when
        working with databases."""
        orm_mode = True
