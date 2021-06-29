from flask import Flask
from API import api
import logging.config


app = Flask(__name__)
api.init_app(app)
app.config['RESTPLUS_MASK_SWAGGER'] = False


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
