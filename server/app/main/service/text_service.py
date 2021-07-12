import uuid
import datetime

from flask.globals import request
from flask import abort

from app.main import db
from app.main.model.text import Text
from app.main.model.user import User
from app.main.service.auth_helper import Auth


from typing import Dict

def save_new_text(data: Dict[str, str]) -> Dict[str, str]:

    # Get user from provided auth token
    logged_in_user = Auth.get_logged_in_user(request)[0]['data']
    print(logged_in_user)
    
    new_text = Text(
        text_id=str(uuid.uuid4()),
        created_on=datetime.datetime.utcnow(),
        text_title=data['text_title'],
        user_id=logged_in_user['user_id'],
        text_body=data['text_body'],
    )
    save_changes(new_text)
    
    response_object = {
           'status': 'success',
           'message': 'Successfully added text.',
           'text_id': new_text.text_id
       }
    return response_object

'''Retrieves specific text of the indicated user (not neccessarily the logged in one)'''
def retrieve_text(username, text_id, data: Dict[str, str]) -> Dict[str, str]:
    logged_in_user = Auth.get_logged_in_user(request)[0]['data']
    logged_in_user_id = logged_in_user['user_id']
    #TODO check if the user requesting the text is connected to the logged in user
    
    print(text_id)
    try:
        requestedText = Text.query.join(User, Text.user_id==User.id).\
        filter(User.username==username).\
        filter(Text.text_id==text_id).first()
        return requestedText    
    except:
        return abort (404, "Bad request, either user or text not found.")
    

def save_changes(data: Text) -> None:
    db.session.add(data)
    db.session.commit()

