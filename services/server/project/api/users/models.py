# services/server/project/api/users/models.py


import os
import datetime

import jwt
from flask import current_app
from sqlalchemy.sql import func

from project import db, bcrypt


class User(db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean(), default=True, nullable=False)
    created_date = db.Column(db.DateTime, default=func.now(), nullable=False)
    role = db.Column(db.String(16), default="driver", nullable=False)
    sponsor_name = db.Column(db.String, nullable=True)
    failed_attempts = db.Column(db.Integer, default = 0)
    failed_attempt_timer = db.Column(db.DateTime)
    current_points = db.Column(db.Integer, default = 0, nullable=True)
    get_points_alert = db.Column(db.Boolean(), default=True, nullable=True)
    get_order_alert = db.Column(db.Boolean(), default=True, nullable=True)
    get_problem_alert = db.Column(db.Boolean(), default=True, nullable=True)

    def __init__(self, username="", email="", password="", role="", sponsor_name=""):
        self.username = username
        self.email = email
        self.role = role
        self.sponsor_name = sponsor_name
        self.active = True
        self.password = bcrypt.generate_password_hash(
            password, current_app.config.get("BCRYPT_LOG_ROUNDS")
        ).decode()
        self.failed_attempts = 0


    def encode_token(self, user_id, token_type):
        if token_type == "access":
            seconds = current_app.config.get("ACCESS_TOKEN_EXPIRATION")
        else:
            seconds = current_app.config.get("REFRESH_TOKEN_EXPIRATION")

        payload = {
            "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=seconds),
            "iat": datetime.datetime.utcnow(),
            "sub": user_id,
        }
        return jwt.encode(
            payload, current_app.config.get("SECRET_KEY"), algorithm="HS256"
        )

    @staticmethod
    def decode_token(token):
        payload = jwt.decode(token, current_app.config.get("SECRET_KEY"))
        return payload["sub"]

if os.getenv("FLASK_ENV") == "development":
    from project import admin
    from project.api.users.admin import UsersAdminView

    admin.add_view(UsersAdminView(User, db.session))

