
from flask import Flask
from flask_restplus import Resource
from flask_restplus import fields
from flask_restplus import Namespace
import os

app = Flask(__name__)
api = Namespace('test_endpont', description="test_endpoint")

model = api.model('Images', {
    'id': fields.Integer(description='The unique identifier for the user')
})

@ api.route('/')
class Dummy(Resource):
    @ api.response(200, 'Successful')
    @ api.response(400, 'Invalid request parameters')
    @ api.response(404, 'Page not found')
    @ api.doc(description="Test endpoint")
    @api.marshal_list_with(model)
    def get(self):
        return "hello"
        

    