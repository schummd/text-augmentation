from flask import request
from flask_restx import Resource, fields
import flask
from app.main.util.decorator import admin_token_required
from ..util.dto import Text
from ..service.user_service import save_new_user, get_all_users, get_a_user
from typing import Dict, Tuple

api = Text.api


resource_fields = api.model('text', {
    'text': fields.String,
})

@api.response(200, 'OK')
@api.response(400, 'Bad request')
@api.route('/', methods=['POST', 'GET'])
class PostTextToServer(Resource):

    @api.expect(resource_fields)
    def post(self):
        text = request.get_json(force=True)
        print(text)
        return 200

   
@api.response(200, 'OK')
@api.response(400, 'Bad request')
@api.route('/<int:textId>')
class GetTextFromServer(Resource):    

    @api.doc(params={'textId': 'Text ID'})
    def get(self, textId):
        print(textId)
        story = {'current_story': 'Red riding hood'}
        return flask.jsonify(story)
