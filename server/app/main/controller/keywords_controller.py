import logging
from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson.natural_language_understanding_v1 import (
    Features,
    ConceptsOptions,
    KeywordsOptions,
)

from flask import request
from flask_restx import Resource
from ..util.dto import Keywords, UserDto
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

