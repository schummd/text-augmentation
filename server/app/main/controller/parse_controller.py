from subprocess import Popen, PIPE
from flask_restx import Resource
import logging
from flask import request
from flask_restx import Resource
from ..util.dto import Parse
from app.main.util.decorator import token_required
import base64
import json

logging.basicConfig(level=logging.DEBUG)


api = Parse.api


def send_to_parser(data):
    parse_subprocess = Popen(
        [
            "curl",
            "-v",
            "-H",
            "Content-type: application/pdf",
            "--data-binary",
            "@temp.pdf",
            "http://SPV1-Scienc-C3GW28LU2S2X-1391134067.eu-north-1.elb.amazonaws.com/v1",
        ],
        stdin=PIPE,
        stdout=PIPE,
        stderr=PIPE,
    )

    output, err = parse_subprocess.communicate()
    d = json.loads(output.decode())
    print(d)
    return_code = parse_subprocess.returncode

    response_object = {
        "status": "success",
        "message": "Successfully parsed PDF.",
        "data": d,
    }

    return response_object, 200


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

        return send_to_parser(decoded_pdf)

