from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import asyncio
import random
from .network_scanner import NetworkScanner
from .bruteforce import PasswordCracker

app = FastAPI(
    title="Terminal Hacker API",
    description="Backend API for Terminal Hacker RPG",
    version="0.1.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class ScanRequest(BaseModel):
    target: str
    stealth_mode: bool = False

class BruteforceRequest(BaseModel):
    target: str
    stealth_mode: bool = False
    hints: Optional[List[str]] = None

# Initialize tools
network_scanner = NetworkScanner()
password_cracker = PasswordCracker()

@app.get("/")
async def root():
    return {
        "name": "Terminal Hacker API",
        "version": "0.1.0",
        "description": "Backend API for Terminal Hacker RPG",
        "endpoints": {
            "GET /": "This information",
            "GET /health": "Health check",
            "POST /scan": "Scan a target",
            "POST /bruteforce": "Attempt to crack passwords",
        },
        "docs_url": "/docs",
        "redoc_url": "/redoc",
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/scan")
async def scan_target(request: ScanRequest):
    try:
        # Simulate network delay
        await asyncio.sleep(random.uniform(0.5, 2.0))
        
        # Perform scan
        result = await network_scanner.scan(
            request.target,
            stealth_mode=request.stealth_mode
        )
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/bruteforce")
async def bruteforce_target(request: BruteforceRequest):
    try:
        # Simulate processing time
        await asyncio.sleep(random.uniform(1.0, 3.0))
        
        # Attempt password cracking
        result = await password_cracker.crack(
            request.target,
            stealth_mode=request.stealth_mode,
            hints=request.hints
        )
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 