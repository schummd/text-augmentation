from flask import request
from flask_restx import Resource

from app.main.util.decorator import admin_token_required
from ..util.dto import HighlightDto
from ..service.highlight_service import save_new_highlight, retrieve_all_highlights, delete_highlight, update_highlight
from ..service.auth_helper import Auth
from typing import Dict, Tuple

api = HighlightDto.api
_highlight = HighlightDto.highlight

@api.route('/text=<text_id>')
@api.param('text_id', 'The text\'s id')
class HighlightPost(Resource):
    @api.expect(_highlight, validate=True)
    @api.response(201, 'Highlight successfully created')
    @api.response(400, 'Bad request')
    @api.response(401, 'Unauthorized access')
    @api.response(404, 'User or Text not found')
    @api.doc('create a new highlight')
    def post(self, text_id) -> Tuple[Dict[str, str], int]:
        # get auth token
        response, status = Auth.get_logged_in_user(request)
        if status == 200:
            user = response['data']['user_public_id']
            data = request.json
            data['user_public_id'] = user
            data['text_id'] = text_id
            return save_new_highlight(data=data)
        else:
            return response, status

@api.route('/user=<user_public_id>/text=<text_id>')
@api.param('user_public_id', 'The user\'s id')
@api.param('text_id', 'The text\'s id')
class HighlightGet(Resource):
    @api.response(400, 'Bad Request')
    @api.response(404, 'User or Text not found')
    @api.doc('retrieve all highlights for a specific text for a specific user')
    @api.marshal_list_with(_highlight, envelope='data')
    def get(self, user_public_id, text_id):
        """Retrieve all Highlights for a specific Text for a specified User"""
        data = {
            'user_public_id': user_public_id,
            'text_id': text_id
        }
        return retrieve_all_highlights(data=data)

@api.route('/<highlight_id>')
@api.param('highlight_id', 'The highlight\'s id')
class HighlightUpdate(Resource):
    @api.response(401, 'Unauthorized access')
    @api.response(403, 'User cannot modify resource')
    @api.response(404, 'Highlight not found')
    @api.doc('delete a highlight')
    def delete(self, highlight_id):
        # get auth token
        response, status = Auth.get_logged_in_user(request)
        if status == 200:
            user = response['data']['user_public_id']
            return delete_highlight(highlight_id=highlight_id, user=user)
        else:
            return response, status


    @api.expect(_highlight, validate=True)
    @api.response(400, 'Bad request')
    @api.response(401, 'Unauthorized access')
    @api.response(403, 'User cannot modify resource')
    @api.response(404, 'Highlight not found')
    @api.doc('Update a highlight')
    def put(self, highlight_id):
        # get auth token
        response, status = Auth.get_logged_in_user(request)
        if status == 200:
            data = request.json
            user = response['data']['user_public_id']
            data['user_public_id'] = user
            data['highlight_id'] = highlight_id
            return update_highlight(data=data)
        else:
            return response, status