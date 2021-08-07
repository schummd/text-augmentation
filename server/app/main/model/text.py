from .. import db
from app.main.model.user import User

class Text(db.Model):
    """ Text Model for storing text related details """

    __tablename__ = "text"

    user_id = db.Column(db.String(50), db.ForeignKey(User.id), unique=False)
    text_id = db.Column(db.String(50), primary_key=True)
    created_on = db.Column(db.DateTime, nullable=False)
    text_title = db.Column(db.String(100), unique=False)
    text_body = db.Column(db.Text)

    user = db.relationship('User', foreign_keys='Text.user_id')

    def __repr__(self):
        return f"<Text {self.text_id}>"

