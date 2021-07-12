import uuid
import datetime

from flask.globals import request
from sqlalchemy.orm import load_only, session
from werkzeug.datastructures import UpdateDictMixin

from app.main import db
from app.main.model.text import Text
from app.main.model.user import User # 
from app.main.service.auth_helper import Auth


from typing import Dict

def save_new_text(username, data: Dict[str, str]) -> Dict[str, str]:

    # get user_id from provided username 
    user = User.query.filter_by(username=username).first() 

    # # Get user from provided auth token
    # logged_in_user = Auth.get_logged_in_user(request)[0]['data']
    # print(logged_in_user)
    
    new_text = Text(
        user_id=user.id,
        text_id=str(uuid.uuid4()),
        created_on=datetime.datetime.utcnow(),
        text_title=data['text_title'],
        text_body=data['text_body'],
    )
    
    save_changes(new_text)
    
    response_object = {
           'status': 'success',
           'message': 'Successfully added text.'
       }
    
    return response_object


def get_all_texts(username):
    return Text.query.join(User, Text.user_id==User.id).filter(User.username==username).all()


def get_a_text(username, text_id): 
    return Text.query.join(User, Text.user_id==User.id).filter(User.username==username, Text.text_id==text_id).first() 


def update_text(username, text_id, data: Dict[str, str]) -> Dict[str, str]: 
    # get user_id from provided username 
    user = User.query.filter_by(username=username).first()
    # get row to update 
    row = Text.query.filter_by(text_id=text_id, user_id=user.id).first() 

    # update text title and body
    row.text_title = data['text_title']  # update created_on time too? 
    row.text_body = data['text_body']

    db.session.commit() 

    response_object = {
        'status': 'success',
        'message': 'Successfully updated text.'
    }
    return response_object


def delete_a_text(username, text_id):
    # get user_id from provided username 
    user = User.query.filter_by(username=username).first() 
    # get row to delete 
    row = Text.query.filter_by(text_id=text_id, user_id=user.id).first() 
    
    db.session.delete(row)
    db.session.commit()

    response_object = {
        'status': 'success',
        'message': 'Successfully deleted text.'
    }
    
    return response_object


def save_changes(data: Text) -> None:
    db.session.add(data)
    db.session.commit()
