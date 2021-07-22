from subprocess import Popen, PIPE
import json
import os
from typing import Dict


def parse_paper(data: bytes) -> Dict[str, str]:

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
            "http://SPV1-Scienc-C3GW28LU2S2X-1391134067.eu-north-1.elb.amazonaws.com/v1",
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
