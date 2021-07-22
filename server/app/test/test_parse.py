import datetime
import unittest

from app.main import db

import json
from app.test.base import BaseTestCase
from app.main.controller.user_controller import *
import base64


def parse_paper(self, paper):
    return self.client.post("/parse/", data=paper, content_type="application/json")


class TestParse(BaseTestCase):
    def test_parse_paper(self):
        with self.client:

            with open("paper.pdf", "rb") as file:
                file_content = file.read()

            b64_encoded_file = base64.b64encode(file_content)
            response_parse = parse_paper(self, b64_encoded_file)
            self.assertEqual(response_parse.status_code, 200)
            response_parse_data = json.loads(response_parse.data.decode())
            self.assertTrue(response_parse_data["status"] == "success")
            self.assertTrue(
                response_parse_data["data"]["title"]
                == "Human Skin Microbiome: Impact of Intrinsic and Extrinsic Factors on Skin Microbiota"
            )


if __name__ == "__main__":
    unittest.main()

