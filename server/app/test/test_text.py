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
        "/user/",
        data=json.dumps(
            dict(email="alex@gmail.com", username="alex", password="123456")
        ),
        content_type="application/json",
    )


def login_user_text(self):
    return self.client.post(
        "/auth/login",
        data=json.dumps(dict(email="alex@gmail.com", password="123456")),
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


# def save_text(text_id, title, user_id):
#     new_text = Text(
#         text_id=text_id,
#         created_on=datetime.datetime.utcnow(),
#         text_title=title,
#         user_id=user_id,
#         text_body="what does the fox say?",
#     )
#     db.session.add(new_text)
#     db.session.commit()


def user_add_text(self, response_login, title, body):
    # add text
    return self.client.post(
        "/text/",
        headers=dict(
            Authorization=json.loads(response_login.data.decode())["Authorization"]
        ),
        data=json.dumps(dict(text_title=title, text_body=body)),
        content_type="application/json",
    )


class TestText(BaseTestCase):
    def test_valid_add_text(self):
        with self.client:
            register_response = register_user_text(self)
            response_login = login_user_text(self)
            response_add_text = self.client.post(
                "/text/",
                headers=dict(
                    Authorization=json.loads(response_login.data.decode())[
                        "Authorization"
                    ]
                ),
                data=json.dumps(dict(text_title="title 1", text_body="hello world")),
                content_type="application/json",
            )
            data_add_text = json.loads(response_add_text.data.decode())
            self.assertEqual(response_add_text.status_code, 200)
            self.assertTrue(data_add_text["status"] == "success")
            self.assertTrue(data_add_text["message"] == "Successfully added text.")

    def test_add_text_not_logged_in(self):
        with self.client:
            response_add_text = self.client.post(
                "/text/",
                headers=dict(Authorization=""),
                data=json.dumps(dict(text_title="title 1", text_body="hello world")),
                content_type="application/json",
            )
            self.assertEqual(response_add_text.status_code, 401)
            data_add_text = json.loads(response_add_text.data.decode())
            self.assertTrue(data_add_text["status"] == "fail")
            self.assertTrue(data_add_text["message"] == "Provide a valid auth token.")

    def test_text_add_invalid_body(self):
        with self.client:
            register_user_text(self)
            response_login = login_user_text(self)
            response_add_text = self.client.post(
                "/text/",
                headers=dict(
                    Authorization=json.loads(response_login.data.decode())[
                        "Authorization"
                    ]
                ),
                data=json.dumps(
                    dict(incorrect_title="title 1", text_body="hello world")  # Invalid
                ),
                content_type="application/json",
            )
            self.assertEqual(response_add_text.status_code, 400)
            data_add_text = json.loads(response_add_text.data.decode())
            self.assertTrue(
                data_add_text["errors"]["text_title"]
                == "'text_title' is a required property"
            )
            self.assertTrue(
                data_add_text["message"] == "Input payload validation failed"
            )

    def test_get_all_user_texts(self):
        with self.client:
            register_user_text(self)
            response_login = login_user_text(self)
            # add two texts to the user
            user_add_text(self, response_login, "test title 1", "hello world")
            user_add_text(self, response_login, "test title 2", "test another text")
            # send get request
            response_get_texts = self.client.get("/text/alex")
            # assert get request response
            data_get_texts = json.loads(response_get_texts.data.decode())
            self.assertEqual(response_get_texts.status_code, 200)
            self.assertTrue(data_get_texts["status"] == "success")
            self.assertTrue(data_get_texts["data"][0]["text_title"] == "test title 1")
            self.assertTrue(data_get_texts["data"][0]["text_body"] == "hello world")
            self.assertTrue(data_get_texts["data"][1]["text_title"] == "test title 2")
            self.assertTrue(
                data_get_texts["data"][1]["text_body"] == "test another text"
            )

    def test_get_all_user_texts_invalid(self):
        with self.client:
            register_user_text(self)
            # don't add any texts to the user
            response_get_texts = self.client.get("/text/alex")
            self.assertEqual(response_get_texts.status_code, 200)
            data_get_texts = json.loads(response_get_texts.data.decode())
            self.assertTrue(data_get_texts["status"] == "success")
            self.assertTrue(len(data_get_texts["data"]) == 0)

    def test_get_a_user_text(self):
        with self.client:
            register_user_text(self)
            response_login = login_user_text(self)
            # add text
            add_text = user_add_text(
                self, response_login, "test title 1", "hello world"
            )
            text_id = json.loads(add_text.data.decode())["text_id"]
            # request text for registered user
            response_get_text = self.client.get(f"/text/alex/{text_id}")
            # response
            self.assertEqual(response_get_text.status_code, 200)
            data_get_text = json.loads(response_get_text.data.decode())
            self.assertTrue(data_get_text["status"] == "success")
            self.assertTrue(data_get_text["data"]["text_title"] == "test title 1")
            self.assertTrue(data_get_text["data"]["text_body"] == "hello world")

    def test_get_a_user_text_invalid(self):
        with self.client:
            register_user_text(self)
            response_login = login_user_text(self)
            # request invalid text id for registered user
            response_get_text = self.client.get("/text/alex/12345")
            self.assertEqual(response_get_text.status_code, 404)
            data_get_text = json.loads(response_get_text.data.decode())
            self.assertTrue(data_get_text["status"] == "fail")
            self.assertTrue(len(data_get_text["data"]) == 0)

    def test_valid_update_text(self):
        with self.client:
            register_user_text(self)
            response_login = login_user_text(self)
            # save text, get text id
            add_text = user_add_text(
                self, response_login, "test title 1", "hello world"
            )
            text_id = json.loads(add_text.data.decode())["text_id"]

            response_update_text = self.client.put(
                f"/text/{text_id}",
                headers=dict(
                    Authorization=json.loads(response_login.data.decode())[
                        "Authorization"
                    ]
                ),
                data=json.dumps(
                    dict(
                        text_title="updated test title", text_body="updated hello world"
                    )
                ),
                content_type="application/json",
            )

            self.assertEqual(response_update_text.status_code, 200)
            data_update_text = json.loads(response_update_text.data.decode())
            self.assertTrue(data_update_text["status"] == "success")
            self.assertTrue(data_update_text["message"] == "Successfully updated text.")

    def test_update_text_not_exists(self):
        with self.client:
            register_user_text(self)
            response_login = login_user_text(self)
            # save text, get text id
            add_text = user_add_text(
                self, response_login, "test title 1", "hello world"
            )
            text_id = json.loads(add_text.data.decode())["text_id"]
            # delete the text
            response_delete_text = self.client.delete(
                f"/text/{text_id}",
                headers=dict(
                    Authorization=json.loads(response_login.data.decode())[
                        "Authorization"
                    ]
                ),
            )
            # update the text
            response_update_text = self.client.put(
                f"/text/{text_id}",
                headers=dict(
                    Authorization=json.loads(response_login.data.decode())[
                        "Authorization"
                    ]
                ),
                data=json.dumps(
                    dict(
                        text_title="updated test title", text_body="updated hello world"
                    )
                ),
                content_type="application/json",
            )

            self.assertEqual(response_update_text.status_code, 404)
            data_update_text = json.loads(response_update_text.data.decode())
            self.assertTrue(data_update_text["status"] == "fail")
            self.assertTrue(data_update_text["message"] == "Text does not exist.")

    def test_update_text_not_logged_in(self):
        with self.client:
            register_user_text(self)
            response_login = login_user_text(self)
            # save text, get text id
            add_text = user_add_text(
                self, response_login, "test title 1", "hello world"
            )
            text_id = json.loads(add_text.data.decode())["text_id"]

            response_update_text = self.client.put(
                f"/text/{text_id}",
                headers=dict(Authorization=""),
                data=json.dumps(
                    dict(
                        text_title="updated test title", text_body="updated hello world"
                    )
                ),
                content_type="application/json",
            )

            self.assertEqual(response_update_text.status_code, 401)
            data_update_text = json.loads(response_update_text.data.decode())
            self.assertTrue(data_update_text["status"] == "fail")
            self.assertTrue(
                data_update_text["message"] == "Provide a valid auth token."
            )

    def test_update_text_invalid_textid(self):
        with self.client:
            register_user_text(self)
            response_login = login_user_text(self)

            response_update_text = self.client.put(
                "/text/12345",
                headers=dict(
                    Authorization=json.loads(response_login.data.decode())[
                        "Authorization"
                    ]
                ),
                data=json.dumps(
                    dict(
                        text_title="updated test title", text_body="updated hello world"
                    )
                ),
                content_type="application/json",
            )

            self.assertEqual(response_update_text.status_code, 404)
            data_update_text = json.loads(response_update_text.data.decode())
            self.assertTrue(data_update_text["status"] == "fail")
            self.assertTrue(data_update_text["message"] == "Text does not exist.")

    def test_delete_text(self):
        with self.client:
            register_user_text(self)
            response_login = login_user_text(self)
            # save text, get text id
            add_text = user_add_text(self, response_login, "test title", "hello world")
            text_id = json.loads(add_text.data.decode())["text_id"]

            response_delete_text = self.client.delete(
                f"/text/{text_id}",
                headers=dict(
                    Authorization=json.loads(response_login.data.decode())[
                        "Authorization"
                    ]
                ),
            )

            self.assertEqual(response_delete_text.status_code, 200)
            data_delete_texts = json.loads(response_delete_text.data.decode())
            self.assertTrue(data_delete_texts["status"] == "success")
            self.assertTrue(
                data_delete_texts["message"] == "Successfully deleted text."
            )

    def test_delete_text_not_exist(self):
        with self.client:
            register_user_text(self)
            response_login = login_user_text(self)

            response_delete_text = self.client.delete(
                "/text/12345",
                headers=dict(
                    Authorization=json.loads(response_login.data.decode())[
                        "Authorization"
                    ]
                ),
            )

            self.assertEqual(response_delete_text.status_code, 404)
            data_delete_texts = json.loads(response_delete_text.data.decode())
            self.assertTrue(data_delete_texts["status"] == "fail")
            self.assertTrue(data_delete_texts["message"] == "Text does not exist.")

    def test_delete_text_not_logged_in(self):
        with self.client:
            register_user_text(self)
            response_login = login_user_text(self)
            # save text, get text id
            add_text = user_add_text(
                self, response_login, "test title 1", "hello world"
            )
            text_id = json.loads(add_text.data.decode())["text_id"]

            response_delete_text = self.client.delete(
                f"/text/{text_id}",
                headers=dict(Authorization=""),
                data=json.dumps(
                    dict(
                        text_title="updated test title", text_body="updated hello world"
                    )
                ),
                content_type="application/json",
            )

            self.assertEqual(response_delete_text.status_code, 401)
            data_delete_texts = json.loads(response_delete_text.data.decode())
            self.assertTrue(data_delete_texts["status"] == "fail")
            self.assertTrue(
                data_delete_texts["message"] == "Provide a valid auth token."
            )


if __name__ == "__main__":
    unittest.main()

