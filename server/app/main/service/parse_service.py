from subprocess import Popen, PIPE
import json


def parse_paper(data):
    parse_subprocess = Popen(
        [
            "curl",
            "-v",
            "-H",
            "Content-type: application/pdf",
            "--data-binary",
            "@temp.pdf",
            "http://SPV1-Scienc-C3GW28LU2S2X-1391134067.eu-north-1.elb.amazonaws.com/v1",
        ],
        stdin=PIPE,
        stdout=PIPE,
        stderr=PIPE,
    )

    output, err = parse_subprocess.communicate()
    d = json.loads(output.decode())
    print(d)
    return_code = parse_subprocess.returncode

    response_object = {
        "status": "success",
        "message": "Successfully parsed PDF.",
        "data": d,
    }

    return response_object, 200
