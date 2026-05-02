def analyze_seo(data):
    score = 0
    details = {}

    if data.get("title"):
        score += 20
        details["title"] = "Present"
    else:
        details["title"] = "Missing"

    if data.get("meta_description"):
        score += 20
        details["meta_description"] = "Present"
    else:
        details["meta_description"] = "Missing"

    if len(data.get("headings", [])) > 0:
        score += 20
        details["headings"] = "Present"
    else:
        details["headings"] = "Missing"

    if len(data.get("content", "")) > 500:
        score += 20
        details["content"] = "Good length"
    else:
        details["content"] = "Too short"

    if len(data.get("content", "").split()) > 100:
        score += 20
        details["keywords"] = "Sufficient"
    else:
        details["keywords"] = "Low"

    return score, details