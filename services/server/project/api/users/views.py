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
    update_user,
    update_user_password,
    delete_user,
    get_all_affiliations,
    check_dupe_affiliation,
    get_affiliation_by_id,
    get_all_affiliations_by_user,
    get_all_affiliations_by_sponsor,
    add_affiliation,
    update_affiliation,
    delete_affiliation
)


users_namespace = Namespace("users")

user = users_namespace.model(
    "User",
    {
        "id": fields.Integer(readOnly=True),
        "username": fields.String(required=True),
        "email": fields.String(required=True),
        "role": fields.String(required=True),
        "created_date": fields.DateTime,
        "failed_attempts": fields.Integer,
        "failed_attempt_timer": fields.DateTime,
        "get_points_alert": fields.Boolean,
        "get_order_alert": fields.Boolean,
        "get_problem_alert": fields.Boolean,
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
        "role": "String"
    })
    def get(self):
        """Returns all users."""
        return get_all_users(), 200

    @users_namespace.doc(params={
        "username": "String",
        "email": "String",
        "role": "String"
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
        response_object = {}

        user = get_user_by_email(email)
        if user:
            response_object["message"] = "Sorry. That email already exists."
            return response_object, 400
        new_user = add_user(username, email, password, role)
        response_object["user_id"] = new_user.id
        response_object["message"] = message = f"A new user with email {email} was added!"

        try:
            # print(f"Sending email to {email}")
            msg = "New user account created in GoodDriver App for email: " + email
            send_email("jwb4@clemson.edu", "New user created.", msg)
            # Req Change 3:
            send_email(email, "New user account created in GoodDriver App", "Welcome to the GoodDriver App!")
        except:
            pass

        return response_object, 201

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
        print(f"User: {user_id}")

        user = get_user_by_id(user_id)
        if not user:
            users_namespace.abort(404, f"User {user_id} does not exist")

        post_data = request.get_json()
        username = post_data.get("username") or user.username
        email = post_data.get("email") or user.email
        role = post_data.get("role") or user.role

        get_points_alert = post_data.get("get_points_alert") if post_data.get("get_points_alert") == True or post_data.get("get_points_alert") == False else user.get_points_alert

        get_order_alert = post_data.get("get_order_alert") if post_data.get("get_order_alert") == True or post_data.get("get_order_alert") == False else user.get_order_alert 

        get_problem_alert = post_data.get("get_problem_alert") if post_data.get("get_problem_alert") == True or post_data.get("get_problem_alert") == False else user.get_problem_alert

        response_object = {}
        update_user(user, username, email, role, get_points_alert, get_order_alert, get_problem_alert)
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

        try:
            msg = "Account number "+ str(user_id) + " has been deleted from the GoodDriver App."
            send_email("jwb4@clemson.edu", "User account deleted.", msg)
            # Req Change 3:
            send_email(user.email, "User account removed from GoodDriver App", "Your account has been deleted from the GoodDriver App.")
        except:
            pass
        
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

# Affiliation views

affiliations_namespace = Namespace("affiliations")

affiliation = affiliations_namespace.model(
    "Affiliation",
    {
        "id": fields.Integer(readOnly=True),
        "user_id": fields.Integer(required=True),
        "sponsor_name": fields.String(required=True),
        "status": fields.String(required=True),
        "current_points": fields.Integer,
        "created_date": fields.DateTime,
    },
)

class AffiliationsList(Resource):
    @affiliations_namespace.marshal_with(affiliation, as_list=True)
    def get(self):
        """Returns all affiliations."""
        return get_all_affiliations(), 200

    @affiliations_namespace.expect(affiliation, validate=True)
    @affiliations_namespace.response(201, "Driver affiliation was added!")
    @affiliations_namespace.response(400, "Sorry. That driver affiliation already exists.")
    def post(self):
        """Creates a new user affiliation."""
        post_data = request.get_json()

        user_id=post_data.get("user_id")
        sponsor_name=post_data.get("sponsor_name")
        current_points=post_data.get("current_points")
        status=post_data.get("status")

        response_object = {}

        affiliation = check_dupe_affiliation(user_id, sponsor_name)
        if affiliation:
            response_object["message"] = "Sorry. That driver affiliation already exists."
            return response_object, 400
        new_affiliation = add_affiliation(user_id, sponsor_name, current_points, status)
        response_object["affiliation_id"] = new_affiliation.id
        response_object["message"] = message = f"A new affiliation for driver id: {user_id} and sponsor {sponsor_name} was added!"

        try:
            # print(f"Sending email to {email}")
            msg = f"A new affiliation for driver id: {user_id} and sponsor {sponsor_name} was added!"
            send_email("jwb4@clemson.edu", "New affiliation created in GoodDriver App.", msg)
            # Req Change 3:
            send_email(email, "New user account created in GoodDriver App", "Welcome to the GoodDriver App!")
        except:
            pass

        return response_object, 201


class AffiliationsBySponsor(Resource):
    @affiliations_namespace.marshal_with(affiliation, as_list=True)
    @affiliations_namespace.response(200, "Success")
    @affiliations_namespace.response(404, "No affiliations exist for this sponsor.")
    def get(self, sponsor_name):
        """Returns all affiliations for a single sponsor."""
        affiliations = get_all_affiliations_by_sponsor(sponsor_name)
        if not affiliations:
            affiliations_namespace.abort(404, f"No affiliations exist for {sponsor_name}.")
        return affiliations, 200

class AffiliationsByUser(Resource):
    @affiliations_namespace.marshal_with(affiliation, as_list=True)
    @affiliations_namespace.response(200, "Success")
    @affiliations_namespace.response(404, "Affiliation for this user does not exist")
    def get(self, user_id):
        """Returns all affiliations for a single user."""
        affiliations = get_all_affiliations_by_user(user_id)
        if not affiliations:
            affiliations_namespace.abort(404, f"No affiliations exist for user {user_id}.")
        return affiliations, 200





class Affiliations(Resource):
    @affiliations_namespace.marshal_with(affiliation)
    @affiliations_namespace.response(200, "Success")
    @affiliations_namespace.response(404, "Affiliation does not exist")
    def get(self, affiliation_id):
        """Returns a record for a single affiliation."""
        affiliations = get_affiliation_by_id(affiliation_id)
        if not affiliations:
            affiliations_namespace.abort(404, f"No affiliations exist for id {affiliation_id}.")
        return affiliations, 200


    @affiliations_namespace.expect(affiliation)
    @affiliations_namespace.response(200, "affiliation was updated!")
    @affiliations_namespace.response(404, "affiliation does not exist")
    def put(self, affiliation_id):
        """Updates an affiliation."""

        affiliation = get_affiliation_by_id(affiliation_id)
        if not affiliation:
            affiliations_namespace.abort(404, f"Affiliation does not exist")

        post_data = request.get_json()

        user_id = post_data.get("user_id") or affiliation.user_id
        sponsor_name = post_data.get("sponsor_name") or affiliation.sponsor_name
        current_points = post_data.get("current_points") or affiliation.current_points
        status = post_data.get("status") or affiliation.status

        response_object = {}

        user = get_user_by_id(affiliation.user_id)
        if not user:
            users_namespace.abort(404, f"User {user_id} does not exist")

        # Alert if points change
        if user.get_points_alert and current_points != affiliation.current_points:
                print(f"Email sent")
                try:
                    # Req Change 3:
                    msg = f"\nYou now have {str(current_points)} points in the GoodDriver App."
                    send_email(user.email, "GoodDriver App points were updated", msg)
                except:
                    pass
        
        ## TO DO ##
        ## Alert if dropped by sponsor

        ## Alert if added by sponsor

                
        update_affiliation(affiliation, user_id, sponsor_name, current_points, status)

        response_object["message"] = f"Affiliation {affiliation_id} was updated!"
        return response_object, 200

    @affiliations_namespace.response(200, "Affiliation was removed!")
    @affiliations_namespace.response(404, "Affiliation does not exist")
    def delete(self, affiliation_id):
        """Updates an affiliation."""
        response_object = {}

        affiliation = get_affiliation_by_id(affiliation_id)
        if not affiliation:
            affiliations_namespace.abort(404, f"Affiliation does not exist")

        user = get_user_by_id(affiliation.user_id)
        if not user:
            users_namespace.abort(404, f"User {affiliation.user_id} does not exist")

        try:
            msg = "Affiliation number "+ str(affiliation.id) + " has been deleted from the GoodDriver App."
            send_email("jwb4@clemson.edu", "User affiliation deleted.", msg)
            # Req Change 3:
            send_email(user.email, "User affiliation removed from GoodDriver App", msg)
        except:
            pass
        
        response_object["message"] = f" Affiliation {affiliation_id} was removed!"
        delete_affiliation(affiliation)
        return response_object, 200


users_namespace.add_resource(UsersList, "")
users_namespace.add_resource(Users, "/<int:user_id>")

# users_namespace.add_resource(UsersBySponsor, "/by_sponsor/<string:sponsor_name>")
users_namespace.add_resource(UsersPass, "/change_password/<int:user_id>")

affiliations_namespace.add_resource(AffiliationsList, "/affiliations")
affiliations_namespace.add_resource(Affiliations, "/affiliations/<int:affiliation_id>")
affiliations_namespace.add_resource(AffiliationsByUser, "/affiliations/by_user/<int:user_id>")
affiliations_namespace.add_resource(AffiliationsBySponsor, "/affiliations/by_sponsor/<string:sponsor_name>")
