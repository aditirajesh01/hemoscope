from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import variants, structure, search
import uvicorn

app = FastAPI(
    title="HemoScope API",
    description="Indian hemoglobin variant interpretation platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(variants.router, prefix="/api/variant", tags=["variants"])
app.include_router(structure.router, prefix="/api/structure", tags=["structure"])
app.include_router(search.router, prefix="/api/search", tags=["search"])

@app.get("/")
def root():
    return {"message": "HemoScope API is running", "version": "1.0.0"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
