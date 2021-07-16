import datetime
import unittest

from app.main import db
import json
from app.main.model.text import Text
from app.test.base import BaseTestCase
from app.main.controller.user_controller import *
from app.test.test_follower_model import *

def register_user_text(self):
    return self.client.post(
        '/user/',
        data=json.dumps(dict(
            email='alex@gmail.com',
            username='alex',
            password='123456'
        )),
        content_type='application/json'
    )


def login_user_text(self):
    return self.client.post(
        '/auth/login',
        data=json.dumps(dict(
            email='alex@gmail.com',
            password='123456'
        )),
        content_type='application/json'
    )

def register_user(self, name):
    return self.client.post(
        '/user/',
        data=json.dumps(dict(
            email=name+'@gmail.com',
            username=name,
            password='123456',
        )),
        content_type='application/json'
    )



def login_user(self, name):
    return self.client.post(
        '/auth/login',
        data=json.dumps(dict(
            email=name+'@gmail.com',
            password='123456'
        )),
        content_type='application/json'
    )


def save_text(text_id, title, user_id):
    new_text = Text(
            text_id=text_id,
            created_on=datetime.datetime.utcnow(),
            text_title=title,
            user_id=user_id,
            text_body='what does the fox say?',
        )
    db.session.add(new_text)
    db.session.commit()

class TestText(BaseTestCase):

    def test_valid_add_text(self):
        with self.client:
            register_response = register_user_text(self)
            response_login = login_user_text(self)
            response_add_text = self.client.post(
                 '/text/',
                 headers=dict(
                     Authorization=json.loads(
                         response_login.data.decode()
                     )['Authorization']
                 ),
                  data=json.dumps(dict(
                    text_title='title 1',
                    text_body='hello world'
                  )),
                 content_type='application/json'
             )
            data_add_text = json.loads(response_add_text.data.decode())
            self.assertEqual(response_add_text.status_code, 200)
            self.assertTrue(data_add_text['status'] == 'success')
            self.assertTrue(data_add_text['message'] == 'Successfully added text.')
            
            
    def test_add_text_not_logged_in(self):
        with self.client:
            response_add_text = self.client.post(
                 '/text/',
                 headers=dict(
                     Authorization=""
                 ),
                  data=json.dumps(dict(
                    text_title='title 1',
                    text_body='hello world'
                  )),
                 content_type='application/json'
             )
            self.assertEqual(response_add_text.status_code, 401)
            data_add_text = json.loads(response_add_text.data.decode())
            self.assertTrue(data_add_text['status'] == 'fail')
            self.assertTrue(data_add_text['message'] == 'Provide a valid auth token.')


    def test_text_add_invalid_body(self):
        with self.client:
            register_user_text(self)
            response_login = login_user_text(self)
            response_add_text = self.client.post(
                 '/text/',
                 headers=dict(
                     Authorization=json.loads(
                         response_login.data.decode()
                     )['Authorization']
                 ),
                  data=json.dumps(dict(
                    incorrect_title='title 1', # Invalid
                    text_body='hello world'
                  )),
                 content_type='application/json'
             )
            self.assertEqual(response_add_text.status_code, 400)
            data_add_text = json.loads(response_add_text.data.decode())
            self.assertTrue(data_add_text['errors']['text_title'] == "'text_title' is a required property")
            self.assertTrue(data_add_text['message'] == "Input payload validation failed")


    def test_fetch_specific_text(self):
        with self.client:
            data = register_user(self, 'alice')
            print(data)
            response_login = login_user(self, 'alice')
            response_add_text = self.client.post(
                 '/text/',
                 headers=dict(
                     Authorization=json.loads(
                         response_login.data.decode()
                     )['Authorization']
                 ),
                  data=json.dumps(dict(
                    text_title='Alice',
                    text_body='in Wonderland'
                  )),
                 content_type='application/json'
            )

            

            data_add_text = json.loads(response_add_text.data.decode())
            alices_text_id = data_add_text['text_id']
            print(alices_text_id)
            self.assertEqual(response_add_text.status_code, 200)
            self.assertTrue(data_add_text['status'] == 'success')
            self.assertTrue(data_add_text['message'] == 'Successfully added text.')

            register_user(self, 'bob')
            bob_login_response = login_user(self, 'bob')
            self.client.patch(
                 '/user/bob/following',
                 headers=dict(
                     Authorization=json.loads(
                         bob_login_response.data.decode()
                     )['Authorization']
                 ),
                 data=json.dumps(dict(
                    user_to_follow='alice'
                 )),
                 content_type='application/json'
            )
            
            
            response_get_text = self.client.get(
                 '/text/alice/'+alices_text_id,
                 headers=dict(
                     Authorization=json.loads(
                         bob_login_response.data.decode()
                     )['Authorization']
                 )
            ) 
            print(response_get_text)
            data_get_text = json.loads(response_get_text.data.decode()) 
            self.assertTrue(data_get_text['text_title'] == 'Alice')


            

if __name__ == '__main__':
    unittest.main()

      



