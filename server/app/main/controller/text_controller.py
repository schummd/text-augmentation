from flask import request
from flask_restx import Resource
from app.main.util.decorator import token_required
from ..util.dto import TextDto
from ..service.text_service import (
    save_new_text,
    get_all_texts,
    get_a_text,
    update_text,
    delete_a_text,
)
from typing import Dict

api = TextDto.api
_text = TextDto.text


# POST /text
@api.route("/")
class Text(Resource):
    @api.expect(_text, validate=True)
    @token_required
    @api.response(201, "Text successfully saved.")
    @api.doc("create a new text")
    # @api.header("hello", "test")
    def post(self) -> Dict[str, str]:
        """Saves a new text"""
        data = request.json
        print(data)
        return save_new_text(data=data)


# GET /text/{username}
@api.route("/<username>")
@api.param("username", "The User identifier")
@api.response(404, "User not found.")
class TextList(Resource):
    @api.doc("get all texts")
    # @api.expect(_textID)
    def get(self, username):
        """Get list of all texts"""
        return get_all_texts(username)


# GET /text/{username}/{text_id}
@api.route("/<username>/<text_id>")
@api.param("username", "The User identifier")
@api.param("text_id", "The Text identifier")
@api.response(404, "User or text not found")
class TextOne(Resource):
    @api.doc("get one text")
    # @api.marshal_with(_textID)
    # @api.expect(_textID)
    def get(self, username, text_id):
        """Get one text of a user"""
        return get_a_text(username, text_id)


# PUT /text/{text_id}
# DELETE /text/{text_id}
@api.route("/<text_id>")
@api.param("text_id", "The Text identifier")
@api.response(404, "Text not found")
class TextUser(Resource):
    @api.expect(_text, validate=True)
    @token_required
    @api.response(200, "Text successfully updated.")
    @api.doc("update a text")
    def put(self, text_id):
        """Update text given username and text id"""
        data = request.json
        return update_text(text_id, data=data)

    @token_required
    @api.response(200, "Text successfully deleted.")
    @api.doc("delete a text")
    def delete(self, text_id):
        """Delete text given username and text id"""
        return delete_a_text(text_id)
