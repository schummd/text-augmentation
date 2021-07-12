from flask import request
from flask_restx import Resource
from flask_restx.reqparse import RequestParser

from app.main.util.decorator import token_required
from ..util.dto import TextDto
from ..service.text_service import save_new_text, get_all_texts, get_a_text, update_text, delete_a_text
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
    @api.doc('get all texts')
    @api.marshal_with(_text)
    def get(self, username):
        """Get list of all texts"""
        text = get_all_texts(username)
        if not text:
            api.abort(404)
        else: 
            return text 

    @api.expect(_text, validate=True)
    @api.response(201, 'Text successfully saved.')
    @api.doc('save a text')
    def post(self, username) -> Dict[str, str]: 
        """Save a new text"""
        data = request.json 
        return save_new_text(username, data=data) 

@api.route('/<username>/<text_id>')
@api.param('username', 'The User identifier')
@api.param('text_id', 'The Text identifier') 
class TextUser(Resource):

    @api.doc('get a text')
    @api.marshal_with(_text)
    def get(self, username, text_id):
        """Get text given username and text id"""
        text = get_a_text(username, text_id)
        if not text:
            api.abort(404)
        else:
            return text 

    @api.expect(_text, validate=True)
    @api.response(201, 'Text successfully updated.')
    @api.doc('update a text')
    def put(self, username, text_id):
        """Update text given username and text id"""
        data = request.json 
        return update_text(username, text_id, data=data)

    @api.doc('delete a text')
    def delete(self, username, text_id): 
        """Delete text given username and text id"""
        confirmation = delete_a_text(username, text_id)
        if not confirmation:
            api.abort(404)
        else:
            return confirmation