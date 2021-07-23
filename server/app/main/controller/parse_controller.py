from flask_restx import Resource
import logging
from flask import request
from ..util.dto import ParseDto
import base64

from ..service.parse_service import parse_paper

logging.basicConfig(level=logging.DEBUG)


api = ParseDto.api
_pdf = ParseDto.pdf


@api.response(200, "OK")
@api.response(400, "Bad request")
@api.route("/")
class ParsedPDF(Resource):
    @api.doc("Parse a PDF")
    @api.expect(_pdf)
    def post(self):
        b64_encoded_pdf = request.data.decode()
        return parse_paper(b64_encoded_pdf)

