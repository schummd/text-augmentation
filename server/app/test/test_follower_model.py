import unittest
from unittest.loader import defaultTestLoader

from app.main import db
from app.main.controller.user_controller import *
from app.test.base import BaseTestCase
from flask import json
from app.main import db
from app.main.model.text import Text
from app.main.model.user import User
from app.main.model.follower import Follower
from app.main.service.auth_helper import Auth


def register_user(self, name):
    return self.client.post(
        "/user/",
        data=json.dumps(
            dict(email=name + "@gmail.com", username=name, password="123456")
        ),
        content_type="application/json",
    )


def login_user(self, name):
    return self.client.post(
        "/auth/login",
        data=json.dumps(dict(email=name + "@gmail.com", password="123456")),
        content_type="application/json",
    )


class TestFollowerModel(BaseTestCase):
    def test_follow_user(self):
        with self.client:

            register_user(self, "alice")
            login_response = login_user(self, "alice")
            data = json.loads(login_response.data.decode())
            # self.assertTrue(data["status"] == "success")
            # self.assertTrue(data["message"] == "Successfully logged in.")
            # self.assertTrue(data["Authorization"])

            register_user(self, "bob")
            bob_login_response = login_user(self, "bob")
            data = json.loads(bob_login_response.data.decode())
            # self.assertTrue(data["status"] == "success")

            follow_request_response = self.client.patch(
                "/user/bob/following",
                headers=dict(
                    Authorization=json.loads(bob_login_response.data.decode())[
                        "Authorization"
                    ]
                ),
                data=json.dumps(dict(user_to_follow="alice")),
                content_type="application/json",
            )

            self.assertEqual(follow_request_response.status, "201 CREATED")

    def test_get_user_following_all(self):
        with self.client:
            register_user(self, "daria")
            register_user(self, "alice")
            register_user(self, "dasha")
            login_response = login_user(self, "daria")

            follow_user_response = self.client.patch(
                "/user/daria/following",
                headers=dict(
                    Authorization=json.loads(login_response.data.decode())[
                        "Authorization"
                    ]
                ),
                data=json.dumps(dict(user_to_follow="alice")),
                content_type="application/json",
            )

            show_response = self.client.get("/user/daria/following")
            self.assertEqual(show_response.status_code, 200)
            show_all_response = json.loads(show_response.data.decode())
            self.assertTrue(show_all_response["status"] == "success")
            self.assertTrue(show_all_response["data"][0]["user_name"] == "daria")
            self.assertTrue(show_all_response["data"][0]["following"] == "alice")

    def test_get_user_following_empty(self):
        with self.client:
            register_user(self, "daria")
            login_response = login_user(self, "daria")

            show_response = self.client.get("/user/daria/following")

            self.assertEqual(show_response.status_code, 200)
            show_all_response = json.loads(show_response.data.decode())
            self.assertTrue(show_all_response["status"] == "success")
            self.assertTrue(len(show_all_response["data"]) == 0)


if __name__ == "__main__":
    unittest.main()

