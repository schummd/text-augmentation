
import uuid
import datetime

from flask.globals import request

from app.main import db
from app.main.model.text import Text
from app.main.model.user import User # 
from app.main.service.auth_helper import Auth


from typing import Dict

def save_new_text(data: Dict[str, str]) -> Dict[str, str]:
    # Get user from provided auth token
    logged_in_user = Auth.get_logged_in_user(request)[0]['data']

    text = str(uuid.uuid4())
    
    new_text = Text(
        # user_id=user.id,
        user_id=logged_in_user['user_id'],
        text_id=text,
        created_on=datetime.datetime.utcnow(),
        text_title=data['text_title'],
        text_body=data['text_body'],
    )
    
    save_changes(new_text)
    
    response_object = {
           'status': 'success',
           'message': 'Successfully added text.',
           'text_id': f'{text}'
       }
    
    return response_object


def get_all_texts(username):
    text_ids = db.session.query(Text.text_id, Text.text_title, Text.text_body).join(User, Text.user_id==User.id).filter(User.username==username).all()
    texts_list = []

    for col in text_ids:
        text = {} 
        text['text_id'] = col[0]
        text['text_title'] = col[1]
        text['text_body'] = col[2]
        texts_list.append(text)

    response_object = {
        'status': 'success',
        'data': texts_list
    }

    return response_object, 200


def get_a_text(username, text_id): 
    text = db.session.query(Text.text_id, Text.text_title, Text.text_body).join(User, Text.user_id==User.id).filter(User.username==username, Text.text_id==text_id).first() 

    if text: 
        
        text_data = list(text)
        text = {}
        text['text_id'] = text_data[0]
        text['text_title'] = text_data[1]
        text['text_body'] = text_data[2]

        response_object = {
            'status': 'success',
            'data': text
        }

        return response_object, 200 

    else: 

        response_object = {
            'status': 'fail',
            'data': ''
        }

        return response_object, 404 


def update_text(text_id, data: Dict[str, str]) -> Dict[str, str]: 
    # Get user from provided auth token
    logged_in_user = Auth.get_logged_in_user(request)[0]['data']
    # get row to update 
    row = Text.query.filter_by(text_id=text_id, user_id=logged_in_user['user_id']).first() 
    # check if row exists 
    if bool(row):

        row.text_title = data['text_title'] 
        row.text_body = data['text_body']

        db.session.commit() 

        response_object = {
            'status': 'success',
            'message': 'Successfully updated text.'
        }
        return response_object, 200
    
    else: 
        response_object = {
            'status': 'fail',
            'message': 'Text does not exist.'
        }
        return response_object, 404


def delete_a_text(text_id):
    # Get user from provided auth token
    logged_in_user = Auth.get_logged_in_user(request)[0]['data']
    # get row to delete 
    row = Text.query.filter_by(text_id=text_id, user_id=logged_in_user['user_id']).first() 
    # check if row exists 
    if bool(row):

        db.session.delete(row)
        db.session.commit()

        response_object = {
            'status': 'success',
            'message': 'Successfully deleted text.'
        }
        return response_object, 200
    
    else: 
        response_object = {
            'status': 'fail',
            'message': 'Text does not exist.'
        }
        return response_object, 404


def save_changes(data: Text) -> None:
    db.session.add(data)
    db.session.commit()
