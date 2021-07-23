from app.main import db
from typing import Dict, Tuple
import json
import requests
import os
from dotenv import load_dotenv, find_dotenv


def get_definition(word):
    load_dotenv(find_dotenv("server.env"))
    key = os.environ.get("OXFORD_API_KEY")
    _id = os.environ.get("OXFORD_ID")
    source_lang = "en"
    full_url = (
        "https://od-api.oxforddictionaries.com/api/v2/entries/"
        + source_lang
        + "/"
        + word
    )
    try:
        r = requests.get(full_url, headers={"app_key": key, "app_id": _id})
        oxford_dict = json.loads(r.text)
        definition = oxford_dict["results"][0]["lexicalEntries"][0]["entries"][0][
            "senses"
        ][0]["definitions"]
        if definition:
            response = {"status": "Success", "Definition": definition}
        return response, 200
    except Exception as e:
        response_object = {
            "status": "fail",
            "message": "Some error occurred. Please try again.",
        }
        return response_object, 400
