from flask.globals import request
from flask import abort
from app.main import db
from app.main.model.text import Text
from app.main.model.user import User
from app.main.model.follower import Follower
from app.main.service.auth_helper import Auth
import flask
from flask_restx import Resource
import logging
from flask import request
from flask_restx import Resource
import os
from dotenv import load_dotenv, find_dotenv
from typing import Dict
import logging


import requests
from requests.structures import CaseInsensitiveDict


def summarize(data: Dict[str, str]):
    # print(Auth.get_logged_in_user(request)[0])
    # logged_in_user = Auth.get_logged_in_user(request)[0]["data"]
    # text_title=data["text_title"],
    text_body = data["text_body"]

    load_dotenv(find_dotenv("server.env"))

    apikey = os.environ.get("MEANING_CLOUD")
    print(f"apikey is {apikey}")
    try:
        params = (
            ("key", apikey),
            ("txt", text_body),
            ("sentences", "1"),
        )
        url = f"https://api.meaningcloud.com/summarization-1.0"

        response = requests.post(url, params=params)
        summary = response.content.decode("utf-8")
        from_json = flask.json.loads(summary)
        summary_text = from_json["summary"]
        return {"summary": summary_text}
    except Exception as e:
        response_object = {
            "status": "fail",
            "message": "Some error occurred. Please try again.",
        }
        return response_object, 400

