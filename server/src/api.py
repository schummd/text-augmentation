from flask import Flask
from API import api
import logging.config


app = Flask(__name__, template_folder='API/templates')
api.init_app(app)
app.config['RESTPLUS_MASK_SWAGGER'] = False


@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    print("XXX")
    return response
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
