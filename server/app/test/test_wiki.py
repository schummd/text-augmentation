import datetime
import unittest

from app.main import db

import json
from app.test.base import BaseTestCase


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


class SummaryTest(BaseTestCase):
    def test_retrieve_summary_success(self):
        with self.client:
            register_user(self, "bob")
            bob_login_response = login_user(self, "bob")
            data = json.loads(bob_login_response.data.decode())
            # self.assertTrue(data["status"] == "success")

            wiki_request_response = self.client.get(
                "/wikipedia/ape",
                headers=dict(
                    Authorization=json.loads(bob_login_response.data.decode())[
                        "Authorization"
                    ]
                ),
            )
            self.assertEqual(200, wiki_request_response.status_code)
