import logging
from flask import request
from flask_restx import Resource
from ..util.dto import SummaryDto, UserDto
from app.main.util.decorator import token_required
from app.main.service.summary_service import summarize


logging.basicConfig(level=logging.DEBUG)


api = SummaryDto.api
_summary_text = SummaryDto.summary_text


@api.response(200, "OK")
@api.response(400, "Bad request")
@token_required
@api.route("/")
class Summarize(Resource):
    @token_required
    @api.expect(_summary_text, validate=True)
    def post(self):
        """Obtain text summary from the Meaning Cloud"""
        data = request.json
        return summarize(data=data)

