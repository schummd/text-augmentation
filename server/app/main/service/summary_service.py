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


def summarize(text_id, data: Dict[str, str]):
    print(Auth.get_logged_in_user(request)[0])
    logged_in_user = Auth.get_logged_in_user(request)[0]["data"]
    requestedText = (
        Text.query.join(User, Text.user_id == User.id)
        .filter(User.id == logged_in_user["user_id"])
        .filter(Text.text_id == text_id)
        .first()
    )

    load_dotenv(find_dotenv("server.env"))

    apikey = os.environ.get("MEANING_CLOUD")
    print(f"apikey is {apikey}")

    params = (
        ("key", apikey),
        ("txt", requestedText.text_body),
        ("sentences", "1"),
    )
    url = f"https://api.meaningcloud.com/summarization-1.0"

    response = requests.post(url, params=params)
    summary = response.content.decode("utf-8")
    from_json = flask.json.loads(summary)
    summary_text = from_json["summary"]
    return {"summary": summary_text}

