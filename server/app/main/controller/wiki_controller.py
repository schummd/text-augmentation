from flask import request
from flask_restx import Resource
from ..util.dto import WikiDto
from ..service.wiki_service import get_summary
from app.main.util.decorator import token_required

api = WikiDto.api
# _user = UserDto.user
@api.response(200, "success")
@api.response(400, "Bad request")
@api.response(404, "Unknown page title")
@token_required
@api.route("/<string:word>")
class Obtain_Summary(Resource):
    @api.doc("Get the summary for the queried word")
    def get(self, word):
        """Get the summary"""
        # data = request.json
        final_summary = get_summary(word)
        return final_summary
