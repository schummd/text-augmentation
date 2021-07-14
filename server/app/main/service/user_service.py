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
    user = User.query.filter_by(email=data['email']).first()
    if not user:
        new_user = User(
            public_id=str(uuid.uuid4()),
            email=data['email'],
            username=data['username'],
            password=data['password'],
            registered_on=datetime.datetime.utcnow()
        )
        save_changes(new_user)
        return generate_token(new_user)
    else:
        response_object = {
            'status': 'fail',
            'message': 'User already exists. Please Log in.',
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
            'status': 'success',
            'message': 'Successfully registered.',
            'Authorization': auth_token.decode()
        }
        return response_object, 201
    except Exception as e:
        response_object = {
            'status': 'fail',
            'message': 'Some error occurred. Please try again.'
        }
        return response_object, 401

def follow_a_user(username: User) -> Boolean:
    logged_in_user = Auth.get_logged_in_user(request)[0]['data']['user_id']
    logged_in_username = User.query.filter_by(id=logged_in_user).first().username
    print(logged_in_username)
    session = db.session()
    # Checking if the user tries to follow himself
    if (logged_in_username == username): 
        return 'Bad request', 400
    # Checking if the connection already exists    
    if (Follower.query.
        filter_by(user_name=logged_in_username).\
        filter_by(following = username).\
        count() > 0):
        return abort(400) #'Connection already exist', 400      

    try:
        new_following = Follower(
            user_name=logged_in_username,
            following=username
        )
        session.add(new_following)
        session.commit()
        return 'Follower update sucessful', 200
    except Exception as e:
        print('Follower update unsucessful', e)
        # response_object = {
        #     'status': 'fail',
        #     'message': 'Some error occurred. Please try again.'
        # }
        return abort(401)

  




def save_changes(data: User) -> None:
    db.session.add(data)
    db.session.commit()

