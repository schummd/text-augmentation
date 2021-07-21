from flask_restx import Namespace, fields


class UserDto:
    api = Namespace("user", description="user related operations")
    user = api.model(
        "user",
        {
            "email": fields.String(required=True, description="user email address"),
            "username": fields.String(required=True, description="user username"),
            "password": fields.String(required=True, description="user password"),
            "public_id": fields.String(description="user Identifier"),
        },
    )
    follower = api.model(
        "follower",
        {
            "user_to_follow": fields.String(
                required=True, description="user Identifier"
            ),
        },
    )


class AuthDto:
    api = Namespace("auth", description="authentication related operations")
    user_auth = api.model(
        "auth_details",
        {
            "email": fields.String(required=True, description="The email address"),
            "password": fields.String(required=True, description="The user password "),
        },
    )


class TextDto:
    api = Namespace("text", description="text related operations")
    text = api.model(
        "text",
        {
            "text_title": fields.String(required=True, description="text title"),
            "text_body": fields.String(required=True, description="text body"),
        },
    )


class Keywords:
    api = Namespace("keywords", description="finding keywords using IBM API")


class Summary:
    api = Namespace("summary", description="summarising text using Meaning Cloud")


class Definition:
    api = Namespace("definition", description="definition related operations")
    definition = api.model(
        "definition",
        {
            "word": fields.String(required=True, description="Word"),
            "definition": fields.String(
                required=True, description="Definition of the word"
            ),
        },
    )
