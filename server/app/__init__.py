from flask_restx import Api
from flask import Blueprint
import logging

from .main.controller.user_controller import api as user_ns
from .main.controller.auth_controller import api as auth_ns
from .main.controller.text_controller import api as text_ns
from .main.controller.keywords_controller import api as keywords_ns
from .main.controller.summary_controller import api as summary_ns
from .main.controller.definition_controller import api as definition_ns
from .main.controller.parse_controller import api as parse_ns
from .main.controller.wiki_controller import api as wiki_ns
from .main.controller.highlight_controller import api as highlight_ns

blueprint = Blueprint("api", __name__)
authorizations = {
    "Authorization": {"type": "apiKey", "in": "header", "name": "Authorization"}
}

api = Api(
    blueprint,
    title="FLASK RESTPLUS(RESTX) API BOILER-PLATE WITH JWT",
    version="1.0",
    description="a boilerplate for flask restplus (restx) web service",
    authorizations=authorizations,
    security="Authorization",
)

api.add_namespace(user_ns, path="/user")
api.add_namespace(auth_ns)
api.add_namespace(text_ns, path="/text")
api.add_namespace(keywords_ns)
api.add_namespace(summary_ns)
api.add_namespace(definition_ns)
api.add_namespace(parse_ns, path="/parse")
api.add_namespace(wiki_ns, path="/wikipedia")
api.add_namespace(highlight_ns, path="/highlight")
# logging.basicConfig()
# logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
