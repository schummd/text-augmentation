# from app.main.controller.user_controller import Follow
import uuid
import datetime

from flask_restx.fields import Boolean

from app.main import db
from app.main.model.user import User
from typing import Dict, Tuple
from app.main.service.auth_helper import Auth
from flask.globals import request
from flask import abort
from app.main.model.follower import Follower


def save_new_user(data: Dict[str, str]) -> Tuple[Dict[str, str], int]:
    user = User.query.filter_by(email=data["email"]).first()
    if not user:
        new_user = User(
            public_id=str(uuid.uuid4()),
            email=data["email"],
            username=data["username"],
            password=data["password"],
            registered_on=datetime.datetime.utcnow(),
        )
        save_changes(new_user)
        return generate_token(new_user)
    else:
        response_object = {
            "status": "fail",
            "message": "User already exists. Please Log in.",
        }
        return response_object, 409


def get_all_users():
    return User.query.all()


def get_a_user(public_id):
    return User.query.filter_by(public_id=public_id).first()


def generate_token(user: User) -> Tuple[Dict[str, str], int]:
    try:
        # generate the auth token
        auth_token = User.encode_auth_token(user.id)
        response_object = {
            "status": "success",
            "message": "Successfully registered.",
            "Authorization": auth_token,
        }
        return response_object, 201
    except Exception as e:
        response_object = {
            "status": "fail",
            "message": "Some error occurred. Please try again.",
        }
        return response_object, 401


def follow_a_user(username: str, user_to_follow: str) -> Tuple[Dict[str, str], int]:
    session = db.session()
    fail_response_object = {
        "status": "fail",
        "message": "Some error occurred. Please try again.",
    }
    print(f"Follow request by {username} to follow {user_to_follow}")
    # Checking if the user tries to follow himself
    if user_to_follow == username:
        return fail_response_object, 400

    # Checking if the connection already exists
    if (
        Follower.query.filter_by(user_name=username)
        .filter_by(following=user_to_follow)
        .count()
        > 0
    ):
        return fail_response_object, 400

    try:
        new_following = Follower(user_name=username, following=user_to_follow)
        session.add(new_following)
        session.commit()
        response_object = {
            "status": "success",
            "message": "Successfully connected.",
        }
        return response_object, 201
    except Exception as e:
        print("Follower update unsucessful", e)
        return fail_response_object, 401


def save_changes(data: User) -> None:
    db.session.add(data)
    db.session.commit()

