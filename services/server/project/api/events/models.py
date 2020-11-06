# services/server/project/api/events/models.py


import os
import datetime

import jwt
from flask import current_app
from sqlalchemy.sql import func

from project import db


class Event(db.Model):

    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    description = db.Column(db.String(128), nullable=False)
    points = db.Column(db.Integer, nullable=False)
    created_date = db.Column(db.DateTime, default=func.now(), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    sponsor_name = db.Column(db.String, nullable=False)


    def __init__(self, description="", points="", user_id="", sponsor_name=""):
        self.description = description
        self.points = points
        self.user_id = user_id
        self.sponsor_name = sponsor_name


if os.getenv("FLASK_ENV") == "development":
    from project import admin
    from project.api.events.admin import EventsAdminView

    admin.add_view(EventsAdminView(Event, db.session))

