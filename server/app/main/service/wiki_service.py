from app.main import db
from typing import Dict, Tuple
import json
import requests
import wikipedia


def get_summary(word):
    source_language = "en"
    url = (
        "https://"
        + source_language
        + ".wikipedia.org/api/rest_v1/page/summary/"
        + word
        + "?"
        + "redirect=true"
    )
    try:
        r = requests.get(url)
        wiki_dict = json.loads(r.text)
        summary = wiki_dict["extract"]
        if wiki_dict["type"] == "disambiguation":
            response_object = {
                "status": "fail",
                "message": "Unambigous interpretation not found.",
            }
            return response_object, 404
        if summary:
            response = {"Summary": summary}
        return response, 200

    except Exception as e:
        response_object = {
            "status": "fail",
            "message": "Some error occurred. Please try again by entering the right spelling of the word.",
        }
        return response_object, 400
