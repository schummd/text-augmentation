from subprocess import Popen, PIPE
import json
import os
from typing import Dict
import base64
import requests

from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv("server.env"))
SCIENCE_PARSE_URL = os.environ.get("SCIENCE_PARSE_URL")


def parse_paper(encoded_pdf: str) -> Dict[str, str]:

    data = base64.b64decode(encoded_pdf)

    TEMP_FILENAME = "temp.pdf"

    with open(TEMP_FILENAME, "wb") as f:
        f.write(data)

    parse_subprocess = Popen(
        [
            "curl",
            "-v",
            "-H",
            "Content-type: application/pdf",
            "--data-binary",
            f"@{TEMP_FILENAME}",
            SCIENCE_PARSE_URL,
        ],
        stdin=PIPE,
        stdout=PIPE,
        stderr=PIPE,
    )

    output, err = parse_subprocess.communicate()
    return_code = parse_subprocess.returncode

    if return_code:
        response_object = {
            "status": "fail",
            "message": f"science-parse server error: {err.decode('utf-8')}",
            "data": "",
        }
        return response_object, 500

    parsed_pdf_json = json.loads(output.decode())

    response_object = {
        "status": "success",
        "message": "Successfully parsed PDF.",
        "data": parsed_pdf_json,
    }

    os.remove(TEMP_FILENAME)

    return response_object, 200


def url_to_pdf(url: str) -> Dict[str, str]:

    r = requests.get(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36"
        },
    )

    if r.status_code != 200:
        response_object = {
            "status": "fail",
            "message": "Error retrieving object.",
        }
        return response_object, 500

    encoded_pdf = f"data:application/pdf;base64,{base64.b64encode(r.content).decode()}"

    response_object = {
        "status": "success",
        "message": "Successfully parsed PDF.",
        "data": encoded_pdf,
    }

    return response_object, 200
