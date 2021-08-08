from flask import request
from flask_restx import Resource
from app.main.service.definition_service import get_definition
from ..util.dto import DefinitionDto
from app.main.util.decorator import token_required


api = DefinitionDto.api

"""Get a definition from the Oxford dictionary"""
@api.response(200, "Ok")
@api.response(400, "Bad request")
@api.response(403, "Authentication failed")
@api.response(404, "Not found")
@token_required
@api.route("/<word>")
class WordDefinition(Resource):
    @api.doc(params={"word": "Get the definition for the queried word"})
    def get(self, word):
       return get_definition(word)

