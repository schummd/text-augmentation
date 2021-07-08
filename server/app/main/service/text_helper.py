from datetime import datetime
from app.main import db
import uuid
from app.main.model.blacklist import BlacklistToken
from typing import Dict, Tuple
from app.main.model.text import Text
import logging
import pdb; 
# pdb.set_trace() 

def sql_store_text(title, username, textBody, private=False):
    try:        
        text_id = Text.newTextId()
        created_on = datetime.now()
        newText = Text(text_id=text_id,created_on=created_on,
            title=title,username=username,private=private, text_body=textBody)
        print("adding text: ", title, username, private, 
            created_on, textBody, text_id)
        save_changes(newText)
        print('text creation successful')
        return True
    except:
        print('text creation failed')
        return False

def sql_retrieve_text(text_id, username):
    try:
        requestedText = Text.query.filter_by(text_id=text_id, 
            username=username).first()
        return requestedText.title, requestedText.text_body    
    except:
        return None, None
    


def save_changes(data: Text) -> None:
    # logging.basicConfig()
    # logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
    db.session.add(data)
    db.session.commit()
