from pydantic import BaseModel

class User(BaseModel):
    """Represents the basic user information returned from the authentication system."""
    id: str
    email: str
