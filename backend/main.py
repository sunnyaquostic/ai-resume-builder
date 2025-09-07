from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from routers import user, services
from contextlib import asynccontextmanager
from models.userModel import init_user_collection

# @asynccontextmanager
# async def lifespan(app: FastAPI):
#     init_user_collection()
#     print("✅ User collection initialized at startup")
    
#     yield
    
#     print("👋 App shutting down...")

app = FastAPI(
    # lifespan=lifespan,
    title="AI Resuming Builder",
    description="Api to generate cool and presentable resuming",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["POST", "GET", "PUT"],
    allow_headers=["*"],
)

app.include_router(user.router, prefix=settings.API_PREFIX)
# app.include_router(services.router, prefix=settings.API_PREFIX)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
 