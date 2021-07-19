import uuid
import datetime

from flask.globals import request
from flask import abort

from app.main import db
from app.main.model.text import Text
from app.main.model.user import User
from app.main.model.follower import Follower
from app.main.service.auth_helper import Auth
import flask
from flask_restx import Resource
from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson.natural_language_understanding_v1 import (
    Features,
    ConceptsOptions,
    KeywordsOptions,
)
import logging
from flask import request
from flask_restx import Resource
import os
from dotenv import load_dotenv, find_dotenv
from typing import Dict


def watson_keywords(text_to_analyse):
    load_dotenv(find_dotenv("server.env"))
    IBM_WATSON_API_KEY = os.environ.get("IBM_WATSON_API_KEY")
    authenticator = IAMAuthenticator(IBM_WATSON_API_KEY)
    IBM_WATSON_URL = os.environ.get("IBM_WATSON_URL")
    natural_language_understanding = NaturalLanguageUnderstandingV1(
        version="2021-03-25", authenticator=authenticator
    )
    natural_language_understanding.set_service_url(IBM_WATSON_URL)
    response = natural_language_understanding.analyze(
        text=text_to_analyse,
        features=Features(
            concepts=ConceptsOptions(limit=6),
            keywords=KeywordsOptions(emotion=False, sentiment=False, limit=6),
        ),
    ).get_result()

    _keywords = response["keywords"]
    kw = []
    for word in _keywords:
        kw.append(word["text"])
    _concepts = response["concepts"]
    cn = []
    for word in _concepts:
        cn.append(word["text"])
    return {"keywords": kw, "concepts": cn}


def find_keywords(text_id, data: Dict[str, str]):
    print(Auth.get_logged_in_user(request)[0])
    logged_in_user = Auth.get_logged_in_user(request)[0]["data"]
    requestedText = (
        Text.query.join(User, Text.user_id == User.id)
        .filter(User.id == logged_in_user["user_id"])
        .filter(Text.text_id == text_id)
        .first()
    )
    # print(logged_in_user["user_id"], text_id, requestedText.text_body)
    try:
        return watson_keywords(requestedText.text_body)
    except Exception as e:
        response_object = {
            "status": "fail",
            "message": "Some error occurred. Please try again.",
        }
        return response_object, 400

