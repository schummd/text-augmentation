import json
import requests


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
    r = requests.get(url)
    wiki_dict = json.loads(r.text)
    try:
        if wiki_dict["type"] == "disambiguation":
            relevant_link = wiki_dict["content_urls"]["desktop"]["page"]
            type = wiki_dict["type"]
            response_object = {"status": "success", "message": {type: relevant_link}}
            return response_object, 200

        if wiki_dict["extract"]:
            summary = wiki_dict["extract"]
            response = {"Summary": summary}
            return response, 200

    except Exception as e:
        response_object = {
            "status": "fail",
            "message": "Some error occurred. Please try again by entering the right spelling of the word.",
        }
        return response_object, 404
