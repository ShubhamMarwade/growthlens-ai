import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_ai_insights(data, seo_details):
    prompt = f"""
You are a growth marketing expert working with startups.

Website Data:
Title: {data.get('title')}
Meta: {data.get('meta_description')}
Headings: {data.get('headings')[:5]}
Content: {data.get('content')[:500]}

SEO Details:
{seo_details}

Provide:
1. SEO Improvements
2. Content Gap Ideas (5 blog topics)
3. Conversion Improvements
4. "If I were your growth consultant" advice

Keep output structured, concise, and actionable.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    return response.choices[0].message.content