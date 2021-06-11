
from flask import Flask, json
from flask_restplus import Resource
from flask_restplus import fields
from flask_restplus import Namespace
import os
import random
from dotenv import load_dotenv, find_dotenv

import requests

load_dotenv(find_dotenv('server.env'))
NEWS_API_KEY = os.environ.get("NEWS_API_KEY")

app = Flask(__name__)
api = Namespace('news_api', description="news_api")

model = api.model('news_api', {
    'article': fields.String(description='News'),
})


@ api.route('/')
class NewsApi(Resource):
    @ api.response(200, 'Successful')
    @ api.response(400, 'Invalid request parameters')
    @ api.response(404, 'Page not found')
    @ api.doc(description="Test endpoint")
    @api.marshal_list_with(model)
    def get(self):
        url = 'https://newsapi.org/v2/everything?'
        
        parameters = {
            'q': 'big data', 
            'pageSize': 20,  
            'apiKey': NEWS_API_KEY 
        }
        
        response = requests.get(url, params=parameters)
        print(response)
        response_json = response.json()
        article_number = random.randrange(len(response_json['articles']))
        content = response_json['articles'][article_number]['content']
        return {'article': content}
        

    