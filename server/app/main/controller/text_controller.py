from flask import request
from flask_restx import Resource
from flask_restx.reqparse import RequestParser

from app.main.util.decorator import token_required
from ..util.dto import TextDto
from ..service.text_service import save_new_text
from typing import Dict

api = TextDto.api
_text = TextDto.text


@api.route('/')
class Text(Resource):
    @api.expect(_text, validate=True)
    @token_required
    @api.response(201, 'Text successfully saved.')
    @api.doc('create a new user')
    @api.header("hello", "test")
    def post(self) -> Dict[str, str]:
        """Saves a new text"""
        data = request.json
        return save_new_text(data=data)



