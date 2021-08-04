import unittest
import datetime

import json

from app.main import db
from app.main.model.user import User
from app.test.base import BaseTestCase


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
        # username = json.loads(response_login.data.decode())["username"]
        # row = User.query.filter_by(username=username).first()
        # new_name = "Dasha Schumm"

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


if __name__ == "__main__":
    unittest.main()

