from flask import request
from flask_restx import Resource
from dotenv import load_dotenv, find_dotenv
from app.main.util.decorator import admin_token_required
from ..util.dto import Definition
from app.main.service.definition_service import get_definition
from typing import Dict, Tuple
import json
from app.main.util.decorator import token_required
from flask import request
from flask_restx import Resource
from dotenv import load_dotenv, find_dotenv
from ..util.decorator import admin_token_required
from ..util.dto import Definition, UserDto
from ..service.user_service import save_new_user, get_all_users, get_a_user
from typing import Dict, Tuple
from app.main.util.decorator import token_required


api = Definition.api
_user = UserDto.user


# https://developer.oxforddictionaries.com/documentation/response-codes
@api.response(200, "Ok")
@api.response(400, "Bad request")
@api.response(403, "Authentication failed")
@api.response(404, "Not found")
@token_required
@api.route("/<word>")
class WordDefinition(Resource):
    @api.doc(params={"word": "Get the definition for the queried word"})
    def get(self, word):
        """Get a definition"""
        return get_definition(word)

