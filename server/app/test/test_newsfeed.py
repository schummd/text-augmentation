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


class TestNewsfeed(BaseTestCase):
    def test_newsfeed_connected_users(self):
        with self.client:

            register_user(self, "alice")
            alice_login_response = login_user(self, "alice")
            data = json.loads(alice_login_response.data.decode())

            register_user(self, "bob")
            bob_login_response = login_user(self, "bob")
            data = json.loads(bob_login_response.data.decode())

            # Bob is following Alice
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
            self.client.post(
                "/text/",
                headers=dict(
                    Authorization=json.loads(alice_login_response.data.decode())[
                        "Authorization"
                    ]
                ),
                data=json.dumps(dict(text_title="Alice", text_body="In Wonderland")),
                content_type="application/json",
            )
            self.client.post(
                "/text/",
                headers=dict(
                    Authorization=json.loads(alice_login_response.data.decode())[
                        "Authorization"
                    ]
                ),
                data=json.dumps(dict(text_title="Summer", text_body="In Sydney")),
                content_type="application/json",
            )
            newsfeed_response = self.client.get("user/bob/newsfeed")
            response = json.loads(newsfeed_response.data.decode())
            self.assertTrue(response["status"] == "success")
            self.assertEqual(response["data"][0]["followee_username"], "alice")
            self.assertEqual(
                response["data"][0]["text_titles"][0]["text_title"], "Alice"
            )
            self.assertEqual(
                response["data"][0]["text_titles"][1]["text_title"], "Summer"
            )

    def test_newsfeed_if_no_followees(self):
        with self.client:

            register_user(self, "alice")
            alice_login_response = login_user(self, "alice")

            newsfeed_response = self.client.get("user/alice/newsfeed")
            response = json.loads(newsfeed_response.data.decode())
            self.assertTrue(response["status"] == "success")
            self.assertEqual(response["data"], "")

    def test_newsfeed_if_no_texts(self):
        with self.client:

            register_user(self, "alice")
            alice_login_response = login_user(self, "alice")
            data = json.loads(alice_login_response.data.decode())

            register_user(self, "bob")
            bob_login_response = login_user(self, "bob")
            data = json.loads(bob_login_response.data.decode())

            # Bob is following Alice
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

            newsfeed_response = self.client.get("user/bob/newsfeed")
            response = json.loads(newsfeed_response.data.decode())
            self.assertTrue(response["status"] == "success")
            self.assertEqual(response["data"][0]["followee_username"], "alice")
            self.assertEqual(response["data"][0]["text_titles"], [])


if __name__ == "__main__":
    unittest.main()

