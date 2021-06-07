from flask_restplus import Api
from .dummy_resource.dummy import Dummy, api as test_ns

api = Api(
    title='COMP9323 Project',
    version='1.0',
    description='API'
)

api.add_namespace(test_ns, path='/test')
