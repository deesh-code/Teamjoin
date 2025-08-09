from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from auth import auth_router

app = FastAPI(title="TeamJoin App", version="1.0.0")

# CORS middleware configuration
'''chat gpt suggestion for security '''
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the authentication routes
'''chat gpt suggestion for security'''
app.include_router(auth_router, prefix="/api")

# --------------------
app.mount("/asset", StaticFiles(directory="asset"), name="asset")
app.mount("/css", StaticFiles(directory="css"), name="css")
app.mount("/js", StaticFiles(directory="js"), name="js")
#---------------------

@app.get("/")
async def read_index():
    return FileResponse('pages/index.html')

@app.get("/signup")
async def read_signup():
    return FileResponse('pages/signup.html')

@app.get("/forgot")
async def read_forgot():
    return FileResponse('pages/forgot.html')

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)