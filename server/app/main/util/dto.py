from flask_restx import Namespace, fields


class UserDto:
    api = Namespace('user', description='user related operations')
    user = api.model('user', {
        'email': fields.String(required=True, description='user email address'),
        'username': fields.String(required=True, description='user username'),
        'password': fields.String(required=True, description='user password'),
        'public_id': fields.String(description='user Identifier')
    })


class AuthDto:
    api = Namespace('auth', description='authentication related operations')
    user_auth = api.model('auth_details', {
        'email': fields.String(required=True, description='The email address'),
        'password': fields.String(required=True, description='The user password '),
    })
    

class TextDto:
    api = Namespace('text', description='text related operations')
    text = api.model('text', {
        'text_title': fields.String(required=True, description='text title'),
        'text_body': fields.String(required=True, description='text body'),
    })
    # text_id = api.inherit('text_id', text, {
    #     'text_id': fields.String(required=False, description='text id')
    # })
