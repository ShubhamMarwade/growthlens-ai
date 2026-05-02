import requests
from bs4 import BeautifulSoup

def scrape_website(url):
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, "html.parser")

        title = soup.title.string if soup.title else ""

        meta_desc = ""
        tag = soup.find("meta", attrs={"name": "description"})
        if tag:
            meta_desc = tag.get("content", "")

        headings = [h.text.strip() for h in soup.find_all(["h1", "h2", "h3"])]

        paragraphs = [p.text.strip() for p in soup.find_all("p")]
        content = " ".join(paragraphs)

        return {
            "title": title,
            "meta_description": meta_desc,
            "headings": headings,
            "content": content[:3000]
        }

    except Exception as e:
        return {"error": str(e)}