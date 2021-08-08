from re import search
from flask import request
from flask_restx import Resource, reqparse
from app.main.util.decorator import token_required
from app.main.util.decorator import admin_token_required
from app.main.service.auth_helper import Auth
from ..util.dto import UserDto, AuthDto
from ..service.user_service import (
    get_all_following,
    save_new_user,
    get_all_users,
    get_a_user,
    update_user_details,
    delete_a_user,
    follow_a_user,
    get_all_following,
    get_newsfeed,
    get_matching_users,
    get_all_users_with_connection_status,
    article_search
)
from typing import Dict, Tuple
import json


api = UserDto.api
_user = UserDto.user
_update = UserDto.update
_follower = UserDto.follower
user_auth = AuthDto.user_auth
_network_user = UserDto.netuser


@api.route("/")
class UserList(Resource):
    @api.doc("list_of_registered_users")
    @token_required
    @api.marshal_list_with(_user, envelope="data")
    def get(self):
        """List all registered users"""
        return get_all_users()

    @api.expect(_user, validate=True)
    @api.response(201, "User successfully created.")
    @api.doc("create a new user")
    def post(self) -> Tuple[Dict[str, str], int]:
        """Creates a new User """
        data = request.json
        return save_new_user(data=data)

    @api.doc("delete a user")
    @token_required
    @api.response(404, "User not found.")
    def delete(self):
        """Delete a user profile"""
        return delete_a_user()

    @api.doc("update a user")
    @token_required
    @api.expect(_update, validate=True)
    @api.response(404, "User not found.")
    def put(self):
        """Update a user name"""
        data = request.json
        return update_user_details(data=data)


@api.route("/<username>")
@api.response(404, "User not found.")
class User(Resource):
    @api.doc("get a user")
    @api.marshal_with(_user)
    def get(self, username):
        """get a user given its identifier"""
        user = get_a_user(username)
        if not user:
            api.abort(404)
        else:
            return user


@api.route("/<username>/following")
@api.param("username", "My username")
@api.response(404, "User not found.")
class Follow(Resource):
    @api.expect(_follower, validate=True)
    @api.doc("follow a user")
    @token_required
    def patch(self, username):
        """follow another user"""
        data = request.json
        print(data)
        user_to_follow = data["user_to_follow"]
        return follow_a_user(username, user_to_follow)


    @api.doc("users a user following")
    def get(self, username):
        """Get all users a user following"""
        return get_all_following(username)


# GET /user/{username}/newsfeed
@token_required
@api.route("/<username>/newsfeed")
@api.param("username", "My username")
@api.response(404, "User not found.")
class Newsfeed(Resource):
    @api.doc("newsfeed")
    def get(self, username):
        """List all titles"""
        print("Received request for news", get_newsfeed(username))
        return get_newsfeed(username)


search_parser = reqparse.RequestParser()
search_parser.add_argument('firstname')
search_parser.add_argument('lastname')
search_parser.add_argument('username')
search_parser.add_argument('email')

@api.route("/<username>/usersearch")
@api.response(200, "User(s) retrieved")
@api.expect(search_parser, validate=True)
class Search(Resource):
    @api.doc("Retrieve a list of users from a search request")
    def get(self, username):
        data = search_parser.parse_args()
        print("REQUEST IS", data)
        return get_matching_users(username, data)
 

@token_required
@api.route("/<username>/network")
@api.param("username", "My username")
@api.response(404, "User not found.")
class Network(Resource):
    @api.doc("network")
    @api.marshal_list_with(_network_user, envelope="data")
    def get(self, username):
        """List all users"""
        return get_all_users_with_connection_status(username)



@token_required
@api.route("/<username>/search")
@api.param("search_string", "Search String")
@api.response(404, "User not found.")
class ArticleSearch(Resource):
    @api.doc(params={"search_string" : {"description": "article search"}})
    def get(self, username):
        """List searched titles"""
        search_string = request.args.get('search_string')
        word = json.loads(search_string)['words']
        return article_search(username, word)
 
