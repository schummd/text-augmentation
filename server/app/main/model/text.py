
from re import T
from .. import db, flask_bcrypt
import datetime
from app.main.model.blacklist import BlacklistToken
from ..config import key
import jwt
from typing import Union
from sqlalchemy.sql.expression import func
import uuid

class Text(db.Model):
    """ Text Model for storing text related details """
    __tablename__ = "text"

    text_id = db.Column(db.String(50), primary_key=True)
    created_on = db.Column(db.DateTime, nullable=False)
    title = db.Column(db.String(100), unique=False)
    username = db.Column(db.String(50), unique=False)
    private = db.Column(db.Boolean, default=False)
    text_body = db.Column(db.Text)

    @staticmethod
    def newTextId():
        return str(uuid.uuid4())


    def __repr__(self):
        return f'<Text {self.text_id}>'
