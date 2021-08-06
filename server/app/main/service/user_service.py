# from app.main.controller.user_controller import Follow
import uuid
import datetime
from datetime import timedelta
import flask
from flask_restx.fields import Boolean
from typing import Dict, Tuple
from app.main import db
from app.main.model.user import User
from app.main.model.follower import Follower
from app.main.model.text import Text
from app.main.service.auth_helper import Auth
from flask.globals import request


def save_new_user(data: Dict[str, str]) -> Tuple[Dict[str, str], int]:
    user = User.query.filter_by(email=data["email"]).first()
    try:
        fname = data["first_name"]
    except:
        fname = ""
    try:
        lname = data["last_name"]
    except:
        lname = ""

    if not user:
        new_user = User(
            public_id=str(uuid.uuid4()),
            email=data["email"],
            username=data["username"],
            password=data["password"],
            registered_on=datetime.datetime.utcnow(),
            first_name=fname,
            last_name=lname,
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


def get_all_users_with_connection_status(username):
    following_list = Follower.query.filter_by(user_name=username).all()
    followees = set()
    for followee in following_list:
        followees.add(followee.following)
    all_users = User.query.filter(User.username != username).all()
    print(all_users)
    for user in all_users:
        if user.username in followees:
            user.following = True
    return all_users


def get_a_user(username):
    #TODO: modify frontend to accept this object
    # query_result = User.query.filter_by(username=username).first()
    # response_object = {
    #     "status": "success",
    #     "message": "Successfully retrieved.",
    #     "data": query_result,
    # }
    return User.query.filter_by(username=username).first()


def update_user_details(data: Dict[str, str]):
    # Get user from provided auth token
    logged_in_user = Auth.get_logged_in_user(request)[0]["data"]
    # get row to delete
    row = User.query.filter_by(id=logged_in_user["user_id"]).first()

    if bool(row):

        # check if fields are not empty
        if data["email"] != "string" and len(data["email"]) != 0:
            row.email = data["email"]

        if data["username"] != "string" and len(data["username"]) != 0:
            row.username = data["username"]

        if data["first_name"] != "string" and len(data["first_name"]) != 0:
            row.first_name = data["first_name"]

        if data["last_name"] != "string" and len(data["last_name"]) != 0:
            row.last_name = data["last_name"]

        db.session.commit()

        response_object = {
            "status": "success",
            "message": "Successfully updated user's first and last name.",
        }
        return response_object, 200

    else:
        response_object = {"status": "fail", "message": "User does not exist."}
        return response_object, 404


def delete_a_user():
    # Get user from provided auth token
    logged_in_user = Auth.get_logged_in_user(request)[0]["data"]
    # get row to delete
    row = User.query.filter_by(id=logged_in_user["user_id"]).first()
    # if exists
    if bool(row):

        db.session.delete(row)
        db.session.commit()

        response_object = {"status": "success", "message": "Successfully deleted user."}
        return response_object, 200

    else:
        response_object = {"status": "fail", "message": "User does not exist."}
        return response_object, 404


def generate_token(user: User) -> Tuple[Dict[str, str], int]:
    try:
        # generate the auth token
        auth_token = User.encode_auth_token(user.id)
        response_object = {
            "status": "success",
            "message": "Successfully registered.",
            "Authorization": auth_token,
            "user_public_id": user.public_id,
        }
        return response_object, 201
    except Exception as e:
        response_object = {
            "status": "fail",
            "message": "Some error occurred. Please try again.",
        }
        return response_object, 401


def follow_a_user(username: str, user_to_follow: str) -> Tuple[Dict[str, str], int]:
    # Checking if the user tries to follow himself
    if user_to_follow == username:

        response_object = {
            "status": "fail",
            "message": "You cannot follow yourself.",
        }

        return response_object, 400

    # check if the user we try to follow exists
    exist = User.query.filter_by(username=user_to_follow).first()

    if exist:
        # Checking if the connection already exists
        connection_exist = (
            Follower.query.filter_by(user_name=username)
            .filter_by(following=user_to_follow)
            .count()
        )

        # if more than 0, then connection exists -> unfollow
        if connection_exist > 0:

            db.session.query(Follower).filter(
                (Follower.user_name == username)
                & (Follower.following == user_to_follow)
            ).delete()

            db.session.commit()

            response_object = {
                "status": "success",
                "message": "Successfully disconnected.",
            }
            return response_object, 201

        # if 0, then no connection -> follow
        else:

            new_following = Follower(user_name=username, following=user_to_follow)

            db.session.add(new_following)
            db.session.commit()

            response_object = {
                "status": "success",
                "message": "Successfully connected.",
            }

            return response_object, 201

    else:

        response_object = {
            "status": "fail",
            "message": "The user you try to follow does not exist.",
        }

        return response_object, 404


def get_all_following(username):
    following = Follower.query.filter_by(user_name=username).all()

    following_list = []

    for user in following:
        follow = {}
        follow["user_name"] = user.user_name
        follow["following"] = user.following
        following_list.append(follow)

    response_object = {"status": "success", "data": following_list}

    return response_object, 200


def get_newsfeed(username):
    NUMBER_OF_DAYS_BACK = 3

    # check if user exists
    exists = User.query.filter_by(username=username).first()

    if not exists:

        response_object = {
            "status": "fail",
            "message": "The user does not exist.",
        }

        return response_object, 404

    following = Follower.query.filter_by(user_name=username).all()

    # user follower someone
    if len(following) != 0:

        newsfeed = []
        for user in following:
            print("USER", user)
            item = {}
            titles = []
            followee_username = user.following
            followee = User.query.filter_by(username=followee_username).first()

            followee_first_name = followee.first_name
            followee_last_name = followee.last_name
            followee_id = followee.public_id
            item["followee_username"] = followee_username
            item["followee_last_name"] = followee_last_name
            item["followee_first_name"] = followee_first_name

            today = datetime.datetime.utcnow()
            current = datetime.datetime(today.year, today.month, today.day)
            days_ago = current - datetime.timedelta(days=NUMBER_OF_DAYS_BACK)
            n_days_ago = datetime.datetime(days_ago.year, days_ago.month, days_ago.day)

            text_ids = (
                db.session.query(Text.text_id, Text.text_title, Text.created_on)
                .join(User, Text.user_id == User.id)
                .filter(User.username == followee_username)
                .filter(Text.created_on >= n_days_ago)
                .order_by(Text.created_on)
                .all()
            )

            for title in text_ids:
                t = {}
                t["text_title"] = title.text_title
                t["text_id"] = title.text_id
                titles.append(t)
            item["text_titles"] = titles
            newsfeed.append(item)

        response_object = {"status": "success", "data": newsfeed}

        return response_object, 200

    # user does not follow anyone, data empty, nothing to display
    else:

        response_object = {
            "status": "success",
            "data": "",
        }

        return response_object, 200


def save_changes(data: User) -> None:
    db.session.add(data)
    db.session.commit()

