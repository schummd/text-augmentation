from flask_restx import Resource
import logging
from flask import request
from flask_restx import Resource
from ..util.dto import Parse
from app.main.util.decorator import token_required
import base64

from ..service.parse_service import parse_paper

logging.basicConfig(level=logging.DEBUG)


api = Parse.api


@api.response(200, "OK")
@api.response(400, "Bad request")
@token_required
@api.route("/")
class ParsedPDF(Resource):
    def post(self):
        encoded_pdf = request.data.decode()
        decoded_pdf = base64.b64decode(encoded_pdf)

        with open("temp.pdf", "wb") as f:
            f.write(decoded_pdf)

        return parse_paper(decoded_pdf)

