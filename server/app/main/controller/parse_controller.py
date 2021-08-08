from flask_restx import Resource
import logging
from flask import request
from ..util.dto import ParseDto
import json

from ..service.parse_service import parse_paper, url_to_pdf

logging.basicConfig(level=logging.DEBUG)


api = ParseDto.api
_pdf = ParseDto.pdf
_url = ParseDto.url


@api.response(200, "OK")
@api.response(400, "Bad request")
@api.route("/")
class ParsedPDF(Resource):
    @api.doc("Parse a PDF")
    @api.expect(_pdf)
    def post(self):
        b64_encoded_pdf = request.data.decode()
        return parse_paper(b64_encoded_pdf)


@api.response(200, "OK")
@api.response(400, "Bad request")
@api.route("/urltopdf")
class PdfFromUrl(Resource):
    @api.doc("Retrieve PDF from url in base64")
    @api.expect(_url, validate=True)
    def post(self):
        url = json.loads(request.data)["url"]
        return url_to_pdf(url)

