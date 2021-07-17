from .. import db
from app.main.model.user import User


class Follower(db.Model):
    """ Follower Table for storing information about connected users """

    __tablename__ = "Follower"
    __table_args__ = (db.PrimaryKeyConstraint("user_name", "following"),)
    user_name = db.Column(db.String(50), db.ForeignKey("user.username"), nullable=False)
    following = db.Column(db.String(50), db.ForeignKey("user.username"))

