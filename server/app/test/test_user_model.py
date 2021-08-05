import unittest

import datetime
import json

from app.main import db
from app.main.model.user import User
from app.test.base import BaseTestCase
from app.main.controller.user_controller import *

def register_user(self, first_name, last_name, username, email):
    return self.client.post(
        "/user/",
        data=json.dumps(
            dict(email=email + "@test.com", username=username, password="test", first_name=first_name, last_name=last_name)
        ),
        content_type="application/json",
    )

def search_users(self, first_name, last_name, username, email):
    endpoint = "/user/search"
    if first_name is not None or last_name is not None or username is not None or email is not None:
        endpoint += "?"
    check = False
    if first_name is not None:
        endpoint += "firstname=" + first_name
        check = True
    if last_name is not None:
        if check:
            endpoint += "&"
        endpoint += "lastname=" + last_name
        check = True
    if username is not None:
        if check:
            endpoint += "&"
        endpoint += "username=" + username
        check = True
    if email is not None:
        if check:
            endpoint += "&"
        endpoint += "email=" + email

    return self.client.get(
        endpoint,
        content_type="application/json",
    )



class TestUserModel(BaseTestCase):
    def test_encode_auth_token(self):
        user = User(
            email="test@test.com",
            password="test",
            registered_on=datetime.datetime.utcnow(),
        )
        db.session.add(user)
        db.session.commit()
        auth_token = User.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, str))

    def test_decode_auth_token(self):
        user = User(
            email="test@test.com",
            password="test",
            registered_on=datetime.datetime.utcnow(),
        )
        db.session.add(user)
        db.session.commit()
        auth_token = User.encode_auth_token(user.id)
        self.assertTrue(isinstance(auth_token, str))
        self.assertTrue(User.decode_auth_token(auth_token) == 1)

class TestUserSearch(BaseTestCase):
    def test_whole_first_name_match(self):
        register_response = register_user(self, "abc", "b", "c", "d")
        search_response = search_users(self, "abc", None, None, None)
        data_search = json.loads(search_response.data.decode())

        self.assertEqual(search_response.status_code, 200)
        print("wahoo")
        print(data_search)

if __name__ == "__main__":
    unittest.main()

