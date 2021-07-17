from flask import request
from flask_restx import Resource, fields
from flask_restx.reqparse import RequestParser
import flask
from app.main.util.decorator import token_required
from ..util.dto import TextDto, UserDto
from ..service.text_service import save_new_text, retrieve_text
from typing import Dict

api = TextDto.api
_text = TextDto.text
_user = UserDto.user


@api.route('/')
class Text(Resource):
    @api.expect(_text, validate=True)
    @token_required
    @api.response(201, 'Text successfully saved.')
    @api.doc('create a new text')
    @api.header("hello", "test")
    def post(self) -> Dict[str, str]:
        """Saves a new text"""
        data = request.json
        print(data)
        return save_new_text(data=data)


'''Retrieves specific text of another user'''
@api.response(200, 'OK')
@api.response(400, 'Bad request')
@api.route('/<string:username>/<string:text_id>', methods=['GET'])
class UserSpecificText(Resource): 
    
    @token_required
    @api.response(201, 'Text found.')
    @api.doc('retrieve text')
    @api.marshal_with(_text)
    def get(self, username, text_id) -> Dict[str, str]:
        """Retrieves specific text of another user"""
        data = request.json
        try:
            return  retrieve_text(username, text_id, data=data)
        except:
            response_object = {
                'status': 'failure',
                'message': 'Cannot find text or user.'
            }
            return response_object, 404       


