import uuid
import datetime

from flask.globals import request

from app.main import db
from app.main.model.text import Text
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
           'message': 'Successfully added text.'
       }
    
    return response_object

def save_changes(data: Text) -> None:
    db.session.add(data)
    db.session.commit()
