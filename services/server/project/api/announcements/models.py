# services/server/project/api/announcements/models.py


import os
import datetime

import jwt
from flask import current_app
from sqlalchemy.sql import func

from project import db


class Announcement(db.Model):

    __tablename__ = "announcements"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    created_date = db.Column(db.DateTime, default=func.now(), nullable=False)
    content = db.Column(db.String(1024), nullable=False)
    sponsor_id = db.Column(db.Integer, db.ForeignKey('sponsors.id'), nullable=False)


    def __init__(self, content="", sponsor_id=""):
        self.content = content
        self.sponsor_id = sponsor_id


# if os.getenv("FLASK_ENV") == "development":
#     from project import admin
#     from project.api.announcements.admin import AnnouncementsAdminView

#     admin.add_view(AnnouncementsAdminView(Announcement, db.session))

