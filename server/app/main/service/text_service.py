import uuid
import datetime

from flask.globals import request
from flask import abort

from app.main import db
from app.main.model.text import Text
from app.main.model.user import User
from app.main.model.follower import Follower
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

# '''Retrieves specific text of the indicated user (not neccessarily the logged in one)'''
# def retrieve_text(owner_username, text_id):
    
#     logged_in_user = Auth.get_logged_in_user(request)
#     u = logged_in_user[0]['data']['user_id']
#     print(logged_in_user[0]['data']['user_id'])

#     logged_in_username = User.query.filter_by(id=u).first()
#     print(logged_in_username.username)
#     un = logged_in_username.username
#     # log_username = logged_in_username['username']
#     print(text_id, owner_username, un)
    
#     fail_response_object = {
#         'status': 'fail',
#         'message': 'Some error occurred. Please try again.'
#     }
   
#     # if Follower.query.filter_by(user_name=un).\
#     #     filter_by(following = owner_username).\
#     #     count() == 0:
#     #     return fail_response_object, 400    

#     # try:
#         # requestedText = Text.query.join(User, User.id==Text.user_id).all()
#         # filter(User.username==owner_username).\
#         # filter(Text.text_id==text_id).first()
#     session = db.session()
 
#     # requestedText = Text.query.filter_by(text_id=text_id, user_id=8).first() 
#     # print( User.query.filter_by(user_id=8).first())
#     requestedText = Text.query.join(User, Text.user_id==User.id).\
#         filter(User.username==owner_username).\
#         filter(Text.text_id==text_id).first()
#     # print(requestedText)
#     return requestedText    # Text.query.join(User, Text.user_id==User.id).filter(User.username=='peter', Text.text_id=='50a0a4bd-8aeb-481a-9841-d30f716fd483').first() 
#     # print(requestedText.title)
#     #     return requestedText    
#     # except:
#     #     return fail_response_object, 404
    
'''Retrieves specific text of the indicated user (not neccessarily the logged in one)'''
def retrieve_text(username, text_id, data: Dict[str, str]) -> Dict[str, str]:
    logged_in_user = Auth.get_logged_in_user(request)[0]['data']
    logged_in_user_id = logged_in_user['user_id']
    #TODO check if the user requesting the text is connected to the logged in user
    
    fail_response_object = {
    'status': 'fail',
    'message': 'Some error occurred. Please try again.'
    }
   
    user  = User.query.filter_by(id=logged_in_user_id).first()
    loguser = user.username
    

    if Follower.query.\
        filter_by(user_name=loguser).\
        filter_by(following=username).\
        count() == 1:


        print(text_id)
        try:
            requestedText = Text.query.join(User, Text.user_id==User.id).\
            filter(User.username==username).\
            filter(Text.text_id==text_id).first()
            return requestedText    
        except:
            return fail_response_object, 404
    else:
        return fail_response_object, 404

def save_changes(data: Text) -> None:
    db.session.add(data)
    db.session.commit()


