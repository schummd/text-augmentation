from flask import request
from flask_restx import Resource

from app.main.util.decorator import admin_token_required
from ..util.dto import Wiki, UserDto
from ..service.wiki_service import get_summary
from typing import Dict, Tuple
import json
import wikipedia
from app.main.util.decorator import token_required

api = Wiki.api
_user = UserDto.user


@api.response(200, "Ok")
@api.response(400, "Bad request")
@api.response(404, "Not found")
@token_required
@api.route("/<string:word>")
class Obtain_Summary(Resource):
    @api.doc("Get the summary for the queried word")
    def get(self, word):
        """Get the summary"""
        data = request.json
        final_summary = get_summary(word)
        return final_summary
