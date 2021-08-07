import unittest
import datetime

import json

from app.main import db
from app.main.model.user import User
from app.test.base import BaseTestCase

def register_user_search(self, first_name, last_name, username, email):
    return self.client.post(
        "/user/",
        data=json.dumps(
            dict(email=email + "@test.com", username=username, password="test", first_name=first_name, last_name=last_name)
        ),
        content_type="application/json",
    )

def login_user_search(self, email):
    return self.client.post(
        "/auth/login",
        data=json.dumps(dict(email=email, password="test")),
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
        data=json.dumps(dict()),
        content_type="application/json",
    )



def register_user(self, name):
    return self.client.post(
        "/user/",
        data=json.dumps(
            dict(email=name + "@gmail.com", username=name, password="123456",)
        ),
        content_type="application/json",
    )


def login_user(self, name):
    return self.client.post(
        "/auth/login",
        data=json.dumps(dict(email=name + "@gmail.com", password="123456")),
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

    def test_valid_user_update_name(self):
        register_user(self, "daria")
        response_login = login_user(self, "daria")

        response_update_name = self.client.put(
            "/user/",
            headers=dict(
                Authorization=json.loads(response_login.data.decode())["Authorization"]
            ),
            data=json.dumps(
                dict(email="", username="", first_name="Dasha", last_name="Schumm")
            ),
            content_type="application/json",
        )

        self.assertEqual(response_update_name.status_code, 200)
        data_update_name = json.loads(response_update_name.data.decode())
        self.assertTrue(data_update_name["status"] == "success")
        self.assertTrue(
            data_update_name["message"]
            == "Successfully updated user's first and last name."
        )

        # check database for the update
        updated_name = User.query.filter_by(
            first_name="Dasha", last_name="Schumm"
        ).first()
        self.assertTrue(updated_name.username == "daria")
        self.assertTrue(updated_name.first_name == "Dasha")
        self.assertTrue(updated_name.last_name == "Schumm")

    def test_valid_delete_user(self):
        register_user(self, "daria")
        response_login = login_user(self, "daria")

        response_delete_user = self.client.delete(
            "/user/",
            headers=dict(
                Authorization=json.loads(response_login.data.decode())["Authorization"]
            ),
        )

        self.assertEqual(response_delete_user.status_code, 200)
        data_delete_user = json.loads(response_delete_user.data.decode())
        self.assertTrue(data_delete_user["status"] == "success")

        # check database for the update
        find_user = User.query.filter_by(username="daria").first()
        self.assertTrue(find_user == None)

class TestUserSearch(BaseTestCase):
    def test_whole_first_name_match(self):
        register_response = register_user_search(self, "abc", "b", "c", "d")
        user_public_id = json.loads(register_response.data.decode())['user_public_id']
        login_response = login_user_search(self, "d")
        search_response = search_users(self, "abc", None, None, None)
        data_search = json.loads(search_response.data.decode())

        self.assertEqual(search_response.status_code, 200)
        self.assertEqual(len(data_search), 1)
        self.assertTrue(data_search[0] == {
            'public_id': user_public_id,
            'first_name': "abc",
            'last_name': "b",
            "username": "c",
            "email": "d@test.com"
        })

    def test_partial_first_name_match(self):
        register_response = register_user_search(self, "xyz", "b", "c", "d")
        user_public_id = json.loads(register_response.data.decode())['user_public_id']
        login_response = login_user_search(self, "d")
        search_response = search_users(self, "y", None, None, None)
        data_search = json.loads(search_response.data.decode())

        self.assertEqual(search_response.status_code, 200)
        self.assertEqual(len(data_search), 1)
        self.assertTrue(data_search[0] == {
            'public_id': user_public_id,
            'first_name': "xyz",
            'last_name': "b",
            "username": "c",
            "email": "d@test.com"
        })

    def test_whole_last_name_match(self):
        register_response = register_user_search(self, "a", "bcd", "c", "d")
        user_public_id = json.loads(register_response.data.decode())['user_public_id']
        login_response = login_user_search(self, "d")
        search_response = search_users(self, None, "bcd", None, None)
        data_search = json.loads(search_response.data.decode())

        self.assertEqual(search_response.status_code, 200)
        self.assertEqual(len(data_search), 1)
        self.assertTrue(data_search[0] == {
            'public_id': user_public_id,
            'first_name': "a",
            'last_name': "bcd",
            "username": "c",
            "email": "d@test.com"
        })

    def test_partial_last_name_match(self):
        register_response = register_user_search(self, "a", "xyz", "c", "d")
        user_public_id = json.loads(register_response.data.decode())['user_public_id']
        login_response = login_user_search(self, "d")
        search_response = search_users(self, None, "y", None, None)
        data_search = json.loads(search_response.data.decode())

        self.assertEqual(search_response.status_code, 200)
        self.assertEqual(len(data_search), 1)
        self.assertTrue(data_search[0] == {
            'public_id': user_public_id,
            'first_name': "a",
            'last_name': "xyz",
            "username": "c",
            "email": "d@test.com"
        })

    def test_whole_username_match(self):
        register_response = register_user_search(self, "a", "b", "cde", "d")
        user_public_id = json.loads(register_response.data.decode())['user_public_id']
        login_response = login_user_search(self, "d")
        search_response = search_users(self, None, None, "cde", None)
        data_search = json.loads(search_response.data.decode())

        self.assertEqual(search_response.status_code, 200)
        self.assertEqual(len(data_search), 1)
        self.assertTrue(data_search[0] == {
            'public_id': user_public_id,
            'first_name': "a",
            'last_name': "b",
            "username": "cde",
            "email": "d@test.com"
        })

    def test_partial_username_match(self):
        register_response = register_user_search(self, "a", "b", "xyz", "d")
        user_public_id = json.loads(register_response.data.decode())['user_public_id']
        login_response = login_user_search(self, "d")
        search_response = search_users(self, None, None, "y", None)
        data_search = json.loads(search_response.data.decode())

        self.assertEqual(search_response.status_code, 200)
        self.assertEqual(len(data_search), 1)
        self.assertTrue(data_search[0] == {
            'public_id': user_public_id,
            'first_name': "a",
            'last_name': "b",
            "username": "xyz",
            "email": "d@test.com"
        })

    def test_whole_email_match(self):
        register_response = register_user_search(self, "a", "b", "c", "def")
        user_public_id = json.loads(register_response.data.decode())['user_public_id']
        login_response = login_user_search(self, "def")
        search_response = search_users(self, None, None, None, "def@test.com")
        data_search = json.loads(search_response.data.decode())

        self.assertEqual(search_response.status_code, 200)
        self.assertEqual(len(data_search), 1)
        self.assertTrue(data_search[0] == {
            'public_id': user_public_id,
            'first_name': "a",
            'last_name': "b",
            "username": "c",
            "email": "def@test.com"
        })

    def test_partial_email_match(self):
        register_response = register_user_search(self, "a", "b", "c", "def")
        user_public_id = json.loads(register_response.data.decode())['user_public_id']
        login_response = login_user_search(self, "def")
        search_response = search_users(self, None, None, None, "def")
        data_search = json.loads(search_response.data.decode())

        self.assertEqual(search_response.status_code, 200)
        self.assertEqual(len(data_search), 1)
        self.assertTrue(data_search[0] == {
            'public_id': user_public_id,
            'first_name': "a",
            'last_name': "b",
            "username": "c",
            "email": "def@test.com"
        })

    def test_no_matches(self):
        register_response = register_user_search(self, "a", "b", "c", "d")
        user_public_id = json.loads(register_response.data.decode())['user_public_id']
        login_response = login_user_search(self, "d")
        search_response = search_users(self, "x", None, None, None)
        data_search = json.loads(search_response.data.decode())

        self.assertEqual(search_response.status_code, 200)
        self.assertEqual(len(data_search), 0)

    def test_no_input(self):
        register_response = register_user_search(self, "a", "b", "c", "d")
        user_public_id = json.loads(register_response.data.decode())['user_public_id']
        login_response = login_user_search(self, "d")
        search_response = search_users(self, None, None, None, None)
        data_search = json.loads(search_response.data.decode())

        self.assertEqual(search_response.status_code, 200)
        self.assertEqual(len(data_search), 1)
        self.assertTrue(data_search[0] == {
            'public_id': user_public_id,
            'first_name': "a",
            'last_name': "b",
            "username": "c",
            "email": "d@test.com"
        })

    def test_all_params(self):
        register_response1 = register_user_search(self, "a", "a", "a", "a")
        user_public_id1 = json.loads(register_response1.data.decode())['user_public_id']
        register_response2 = register_user_search(self, "b", "b", "b", "b")
        user_public_id2 = json.loads(register_response2.data.decode())['user_public_id']
        register_response3 = register_user_search(self, "c", "c", "c", "c")
        user_public_id3 = json.loads(register_response3.data.decode())['user_public_id']
        register_response4 = register_user_search(self, "d", "d", "d", "d")
        user_public_id4 = json.loads(register_response4.data.decode())['user_public_id']
        register_response5 = register_user_search(self, "aa", "bb", "cc", "dd")
        user_public_id5 = json.loads(register_response5.data.decode())['user_public_id']
        register_response_test = register_user_search(self, "test", "test", "test", "test")
        user_public_id_test = json.loads(register_response_test.data.decode())['user_public_id']

        login_response = login_user_search(self, "test")
        search_response = search_users(self, "a", "b", "c", "d")
        data_search = json.loads(search_response.data.decode())

        self.assertEqual(search_response.status_code, 200)
        self.assertEqual(len(data_search), 1)
        self.assertTrue(data_search[0] == {
            'public_id': user_public_id5,
            'first_name': "aa",
            'last_name': "bb",
            "username": "cc",
            "email": "dd@test.com"
        })
    def test_multiple_matches(self):
        register_response1 = register_user_search(self, "a", "b", "c", "d")
        user_public_id1 = json.loads(register_response1.data.decode())['user_public_id']
        register_response2 = register_user_search(self, "aa", "bb", "cc", "dd")
        user_public_id2 = json.loads(register_response2.data.decode())['user_public_id']
        register_response3 = register_user_search(self, "aaa", "bbb", "ccc", "ddd")
        user_public_id3 = json.loads(register_response3.data.decode())['user_public_id']
        register_response4 = register_user_search(self, "x", "x", "x", "x")
        user_public_id4 = json.loads(register_response4.data.decode())['user_public_id']
        register_response_test = register_user_search(self, "test", "test", "test", "test")
        user_public_id_test = json.loads(register_response_test.data.decode())['user_public_id']

        login_response = login_user_search(self, "test")
        search_response = search_users(self, "a", "b", "c", "d")
        data_search = json.loads(search_response.data.decode())

        self.assertEqual(search_response.status_code, 200)
        self.assertEqual(len(data_search), 3)
        self.assertTrue(data_search[0] == {
            'public_id': user_public_id1,
            'first_name': "a",
            'last_name': "b",
            "username": "c",
            "email": "d@test.com"
        })
        self.assertTrue(data_search[1] == {
            'public_id': user_public_id2,
            'first_name': "aa",
            'last_name': "bb",
            "username": "cc",
            "email": "dd@test.com"
        })
        self.assertTrue(data_search[2] == {
            'public_id': user_public_id3,
            'first_name': "aaa",
            'last_name': "bbb",
            "username": "ccc",
            "email": "ddd@test.com"
        })

if __name__ == "__main__":
    unittest.main()

