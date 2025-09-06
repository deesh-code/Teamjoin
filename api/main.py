"""
This is the main entry point for the TeamJoin backend application.

It brings together all the different parts of the application, including the
authentication and user profile modules, and exposes the API endpoints.
"""

from fastapi import FastAPI, Depends
from auth.login import router as login_router
from auth.signup import router as signup_router
from auth.forgot_password import router as forgot_password_router
from user.main import router as user_router
from ideas.main import router as ideas_router
from message.main import router as message_router
from feed.main import router as feed_router
from search.main import router as search_router
from auth.dependencies import get_current_user
from fastapi.middleware.cors import CORSMiddleware
from auth.models import User

# Create the main FastAPI application
# We are disabling the auto-generated docs since we have a custom README for guidance.
app = FastAPI(docs_url=None, redoc_url=None)

origins = [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://10.218.106.72:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --- API Routers ---

# Include the authentication routers
app.include_router(login_router, prefix="/auth", tags=["Authentication"])
app.include_router(signup_router, prefix="/auth", tags=["Authentication"])
app.include_router(forgot_password_router, prefix="/auth", tags=["Authentication"])

# Include the user profile router
app.include_router(user_router, prefix="/user", tags=["User Profile"])

# Include the ideas router
app.include_router(ideas_router, prefix="/ideas", tags=["Ideas"])
app.include_router(message_router, tags=["Messaging"])
app.include_router(feed_router, prefix="/feed", tags=["feed"])
app.include_router(search_router, prefix="/search", tags=["search"])


# --- API Endpoints ---

@app.get("/")
async def root():
    """A simple welcome message to let you know the API is running.""" 
    return {"message": "Welcome to the TeamJoin backend!"}

@app.get("/users/me", response_model=User)
async def read_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get the basic information for the currently logged-in user.

    This is a protected endpoint and requires a valid JWT access token.
    """
    return {"id": current_user.id, "email": current_user.email}
