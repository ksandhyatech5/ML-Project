from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routes.auth import router as auth_router
from routes.data import router as data_router
from routes.ml import router as ml_router

app = FastAPI(title="Stock ML API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(data_router, prefix="/api/data", tags=["data"])
app.include_router(ml_router, prefix="/api/ml", tags=["ml"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Stock ML API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
