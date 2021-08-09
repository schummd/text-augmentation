from flask_restx import Namespace, fields


class UserDto:
    api = Namespace("user", description="user related operations")
    user = api.model(
        "user",
        {
            "id": fields.String(required=False, description="id"),
            "email": fields.String(required=True, description="user email address"),
            "username": fields.String(required=True, description="user username"),
            "password" : fields.String(required=False, description="user password"),
            "first_name": fields.String(description="user first name"),
            "last_name": fields.String(description="user last name"),
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

    netuser = api.model(
        "netuser",
        {
            "id": fields.String(required=True, description="id"),
            "email": fields.String(required=True, description="user email address"),
            "username": fields.String(required=True, description="user username"),
            "password": fields.String(required=True, description="user password"),
            "first_name": fields.String(description="user first name"),
            "last_name": fields.String(description="user last name"),
            "following": fields.Boolean(
                required=False, description="following current user or not"
            ),
        },
    )

    update = api.model(
        "update",
        {
            "email": fields.String(required=False, description="update email address"),
            "username": fields.String(required=False, description="update username"),
            "first_name": fields.String(
                required=False, description="update first name"
            ),
            "last_name": fields.String(required=False, description="update last name"),
        },
    )
    search_titles = api.model(
        "search_string",
        {
            "word": fields.String(required=True, description="find titles"),
        }
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


class KeywordsDto:
    api = Namespace("keywords", description="finding keywords using IBM API")
    keywords_text = api.model(
        "keywords",
        {"text_body": fields.String(required=True, description="Text to analyse"),},
    )


class SummaryDto:
    api = Namespace("summary", description="summarising text using Meaning Cloud")
    summary_text = api.model(
        "summary",
        {"text_body": fields.String(required=True, description="Text to analyse"),},
    )


class DefinitionDto:
    api = Namespace("definition", description="definition related operations")
    definition = api.model(
        "definition",
        {
            "definition": fields.String(
                required=True, description="Definition of the word"
            ),
        },
    )


class ParseDto:
    api = Namespace("parse", description="Parsing papers")
    pdf = (
        api.model(
            "pdf",
            {"data": fields.String(required=True, description="base64 encoded PDF"),},
        ),
    )
    url = (
        api.model(
            "url", {"url": fields.String(required=True, description="URL of pdf"),},
        ),
    )


class WikiDto:
    api = Namespace("wikipedia", description="summary related operations")
    synonym = api.model(
        "wiki_summary",
        {
            "title": fields.String(required=True, description="The title"),
            "summary": fields.String(
                required=True, description="Summary related to the title"
            ),
        },
    )


class HighlightDto:
    api = Namespace("highlight", description="highlight related operations")
    highlight = api.model(
        "highlight",
        {
            "type": fields.String(required=True, description="Manual or Autogenerated"),
            "offset_start": fields.Integer(
                description="positional start of the highlight"
            ),
            "offset_end": fields.Integer(description="positional end of the highlight"),
            "content": fields.String(
                required=True, description="content inside the highlight"
            ),
        },
    )

