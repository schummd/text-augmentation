from flask_restplus import Api
from .news_api.news import NewsApi, api as test_ns

api = Api(
    title='COMP9323 Project',
    version='1.0',
    description='API'
)


api.add_namespace(test_ns, path='/news_api')
