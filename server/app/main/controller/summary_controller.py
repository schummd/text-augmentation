import logging

from flask import request
from flask_restx import Resource
from ..util.dto import Summary, UserDto
from app.main.util.decorator import token_required
from app.main.service.summary_service import summarize


logging.basicConfig(level=logging.DEBUG)


api = Summary.api
_user = UserDto.user
_summary_text = Summary.summary_text


@api.response(200, "OK")
@api.response(400, "Bad request")
@token_required
@api.route("/")
class Summarize(Resource):
    @token_required
    @api.expect(_summary_text, validate=True)
    def post(self):
        data = request.json
        summary = summarize(data=data)
        return summary

