# services/server/project/api/threads/models.py


import os
import datetime

import jwt
from flask import current_app
from sqlalchemy.sql import func

from project import db
from project.api.users.models import User


class Thread(db.Model):

    __tablename__ = "threads"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status = db.Column(db.String(32), default="active", nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_date = db.Column(db.DateTime, default=func.now(), nullable=False)

    def __init__(self, status="", creator_id=""):
        self.status = status
        self.creator_id = creator_id

class Message(db.Model):

    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    thread_id = db.Column(db.Integer, db.ForeignKey('threads.id'), nullable=False)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_date = db.Column(db.DateTime, default=func.now(), nullable=False)
    subject = db.Column(db.String, nullable=False)
    content = db.Column(db.String, nullable=False)


    def __init__(self, thread_id="", sender_id="", recipient_id="", created_date="", subject="", content=""):
        self.thread_id = thread_id
        self.sender_id = sender_id
        self.recipient_id = recipient_id
        self.created_date = created_date
        self.subject = subject
        self.content = content

# if os.getenv("FLASK_ENV") == "development":
#     from project import admin
#     from project.api.orders.admin import CatalogsAdminView

#     admin.add_view(CatalogsAdminView(Catalog, db.session))

 