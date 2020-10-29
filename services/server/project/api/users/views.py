# services/server/project/api/users/views.py

from flask import current_app
from flask import request
from flask_restx import Resource, fields, Namespace
from project import bcrypt
from project.helpers.mail_service import send_email

from project.api.users.crud import (
    get_all_users,
    get_user_by_email,
    add_user,
    get_user_by_id,
    get_users_by_sponsor_name,
    update_user,
    update_user_password,
    delete_user,
)


users_namespace = Namespace("users")

user = users_namespace.model(
    "User",
    {
        "id": fields.Integer(readOnly=True),
        "username": fields.String(required=True),
        "email": fields.String(required=True),
        "role": fields.String(required=True),
        "sponsor_name": fields.String(required=True),
        "created_date": fields.DateTime,
        "active": fields.Boolean(required=True),
        "failed_attempts": fields.Integer,
        "failed_attempt_timer": fields.DateTime,
    },
)

user_post = users_namespace.inherit(
    "User post", user, {"password": fields.String(required=True)}
)


class UsersList(Resource):
    @users_namespace.marshal_with(user, as_list=True)
    @users_namespace.doc(params={
        "username": "String",
        "email": "String",
        "role": "String",
        "sponsor_name": "String"
    })
    def get(self):
        """Returns all users."""
        return get_all_users(), 200

    @users_namespace.doc(params={
        "username": "String",
        "email": "String",
        "role": "String",
        "sponsor_name": "String"
    })
    @users_namespace.expect(user_post, validate=True)
    @users_namespace.response(201, "<user_email> was added!")
    @users_namespace.response(400, "Sorry. That email already exists.")
    def post(self):
        """Creates a new user."""
        post_data = request.get_json()
        username = post_data.get("username")
        email = post_data.get("email")
        password = post_data.get("password")
        role = post_data.get("role")
        sponsor_name = post_data.get("sponsor_name")
        response_object = {}

        user = get_user_by_email(email)
        if user:
            response_object["message"] = "Sorry. That email already exists."
            return response_object, 400
        new_user = add_user(username, email, password, role, sponsor_name)
        response_object["user_id"] = new_user.id
        response_object["message"] = message = f"A new user with email {email} was added!"

        try:
            send_email("jwb4@clemson.edu", "New user created.", message)
        except:
            print("Email not sent.")

        return response_object, 201

class UsersBySponsor(Resource):
    @users_namespace.marshal_with(user)
    @users_namespace.response(200, "Success")
    @users_namespace.response(404, "Sponsor <user_id> does not exist")
    def get(self, sponsor_name):
        """Returns all users for a single sponsor."""
        users = get_users_by_sponsor_name(sponsor_name)
        if not users:
            users_namespace.abort(404, f"Sponsor {sponsor_name} does not exist")
        return users, 200



class Users(Resource):
    @users_namespace.marshal_with(user)
    @users_namespace.response(200, "Success")
    @users_namespace.response(404, "User <user_id> does not exist")
    def get(self, user_id):
        """Returns a single user."""
        user = get_user_by_id(user_id)
        if not user:
            users_namespace.abort(404, f"User {user_id} does not exist")
        return user, 200

    @users_namespace.expect(user)
    @users_namespace.response(200, "<user_id> was updated!")
    @users_namespace.response(404, "User <user_id> does not exist")
    def put(self, user_id):
        """Updates a user."""

        user = get_user_by_id(user_id)
        if not user:
            users_namespace.abort(404, f"User {user_id} does not exist")

        post_data = request.get_json()
        username = post_data.get("username") or user.username
        email = post_data.get("email") or user.email
        role = post_data.get("role") or user.role
        sponsor_name = post_data.get("sponsor_name") or user.sponsor_name
        response_object = {}
        
        update_user(user, username, email, role, sponsor_name)
        response_object["message"] = f"{user.id} was updated!"
        return response_object, 200

    @users_namespace.response(200, "<user_id> was removed!")
    @users_namespace.response(404, "User <user_id> does not exist")
    def delete(self, user_id):
        """Updates a user."""
        response_object = {}
        user = get_user_by_id(user_id)
        if not user:
            users_namespace.abort(404, f"User {user_id} does not exist")
        delete_user(user)
        response_object["message"] = f"{user.email} was removed!"
        return response_object, 200

class UsersPass(Resource):
    @users_namespace.expect(user)
    @users_namespace.response(200, "<user_id> was updated!")
    @users_namespace.response(401, "Incorrect email or password.")
    @users_namespace.response(404, "User <user_id> does not exist")
    def put(self, user_id):
        """Updates a user's password."""

        user = get_user_by_id(user_id)
        if not user:
            users_namespace.abort(404, f"User {user_id} does not exist")

        post_data = request.get_json()
        current_password = post_data.get("current_password")
        new_password = post_data.get("new_password")
        response_object = {}

        new_pwhash = bcrypt.generate_password_hash(
            new_password, current_app.config.get("BCRYPT_LOG_ROUNDS")
        ).decode()

        if bcrypt.check_password_hash(user.password, current_password):
            update_user_password(user, new_pwhash)
            response_object["message"] = f"Password for user {user.id} was updated!"
            return response_object, 200
        else:
            users_namespace.abort(401, f"Incorrect email or password.")

users_namespace.add_resource(UsersList, "")
users_namespace.add_resource(Users, "/<int:user_id>")
users_namespace.add_resource(UsersBySponsor, "/by_sponsor/<string:sponsor_name>")
users_namespace.add_resource(UsersPass, "/change_password/<int:user_id>")

 