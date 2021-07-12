from flask import request
from flask_restx import Resource
from flask_restx.reqparse import RequestParser

from app.main.util.decorator import token_required
from ..util.dto import TextDto
from ..service.text_service import save_new_text, get_all_texts
from typing import Dict

api = TextDto.api
_text = TextDto.text

# @api.route('/')
# class Text(Resource):
#     @api.expect(_text, validate=True)
#     @token_required
#     @api.response(201, 'Text successfully saved.')
#     @api.doc('create a new user')
#     @api.header("hello", "test")

#     def post(self, username) -> Dict[str, str]:
#         """Saves a new text"""
#         data = request.json
#         return save_new_text(username, data=data)


# GET /text/{username}
# POST /text/{username}
@api.route('/<username>')
@api.param('username', 'The User identifier')
@api.response(404, 'User not found.')
class Text(Resource):
    @api.doc('get a text')
    @api.marshal_with(_text)
    def get(self, username):
        text = get_all_texts(username)
        if not text:
            api.abort(404)
        else: 
            return text 

    @api.expect(_text, validate=True)
    @api.response(201, 'Text successfully saved.')
    @api.doc('save a text')
    def post(self, username) -> Dict[str, str]: 
        data = request.json 
        return save_new_text(username, data=data) 