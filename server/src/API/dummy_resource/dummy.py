
from flask import Flask, json
from flask_restplus import Resource
from flask_restplus import fields
from flask_restplus import Namespace
import os
import random
from os.path import join, dirname
from dotenv import load_dotenv

import pprint
import requests

app = Flask(__name__)
api = Namespace('dummy_resource', description="dummy_resource")

model = api.model('dummy_resource', {
    'article': fields.String(description='News'),

})


@ api.route('/')
class Dummy(Resource):
    @ api.response(200, 'Successful')
    @ api.response(400, 'Invalid request parameters')
    @ api.response(404, 'Page not found')
    @ api.doc(description="Test endpoint")
    @api.marshal_list_with(model)
    def get(self):
        NEWS_API_KEY=""
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
        

    