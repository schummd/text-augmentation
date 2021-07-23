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
from ..util.decorator import admin_token_required
from ..util.dto import Keywords, UserDto
from ..service.user_service import save_new_user, get_all_users, get_a_user
from typing import Dict, Tuple
from app.main.util.decorator import token_required
from app.main.service.keywords_service import find_keywords


logging.basicConfig(level=logging.DEBUG)


api = Keywords.api
_user = UserDto.user
_keywords_text = Keywords.keywords_text


@api.response(200, "OK")
@api.response(400, "Bad request")
@token_required
@api.route("/")
class RetrieveKeywords(Resource):
    @token_required
    @api.expect(_keywords_text, validate=True)
    def post(self):
        data = request.json
        keywords = find_keywords(data=data)
        return keywords  # a list

