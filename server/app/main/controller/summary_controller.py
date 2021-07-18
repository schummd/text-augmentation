import flask
from flask_restx import Resource
import logging
from flask import request
from flask_restx import Resource
import os
from dotenv import load_dotenv, find_dotenv
from ..util.decorator import admin_token_required
from ..util.dto import Summary, UserDto
from ..service.user_service import save_new_user, get_all_users, get_a_user
from typing import Dict, Tuple
from app.main.util.decorator import token_required
from app.main.service.summary_service import summarize


logging.basicConfig(level=logging.DEBUG)


api = Summary.api
_user = UserDto.user


@api.response(200, "OK")
@api.response(400, "Bad request")
@token_required
@api.route("/<string:text_id>")
class Summarize(Resource):
    @api.doc(params={"text_id": "Text for analysis - ID"})
    def get(self, text_id):
        data = request.json
        summary = summarize(text_id, data=data)
        print(summary)
        return summary  # flask.json.loads(summary)

