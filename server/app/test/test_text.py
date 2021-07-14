import unittest

from app.main import db
import json
from app.test.base import BaseTestCase


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


class TestText(BaseTestCase):

    def test_valid_add_text(self):
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
    
    def test_get_all_texts(self): 
        with self.client:
            pass

if __name__ == '__main__':
    unittest.main()
