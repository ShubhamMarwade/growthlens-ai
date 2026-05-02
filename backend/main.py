from fastapi import FastAPI
from pydantic import BaseModel
from scraper import scrape_website
from seo_analyzer import analyze_seo
from ai_engine import generate_ai_insights

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS (for React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLRequest(BaseModel):
    url: str

@app.post("/analyze")
async def analyze(request: URLRequest):
    data = scrape_website(request.url)

    if "error" in data:
        return {"error": data["error"]}

    seo_score, seo_details = analyze_seo(data)
    ai_output = generate_ai_insights(data, seo_details)

    return {
        "seo_score": seo_score,
        "seo_details": seo_details,
        "ai_insights": ai_output
    }