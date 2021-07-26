from .. import db, flask_bcrypt
import datetime
from app.main.model.blacklist import BlacklistToken
from ..config import key
import jwt
from typing import Union


class Highlight(db.Model):
    """ User Model for storing user related details """

    __tablename__ = "highlight"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.String(20), nullable=False)
    offset_start = db.Column(db.Integer)
    offset_end = db.Column(db.Integer)
    content = db.Column(db.Text, nullable=False)
    user_public_id = db.Column(db.String(50), db.ForeignKey("user.public_id"))
    text_id = db.Column(db.String(50), db.ForeignKey("text.text_id"))

    def __repr__(self):
        return "<Highlight '{}'>".format(self.id)
