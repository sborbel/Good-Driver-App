
from flask import current_app
from flask import request
from flask_restx import Resource, fields, Namespace
from flask import make_response


from project.api.users.crud import (
    get_all_users,
    get_all_affiliations,
)

from project.api.orders.crud import (
    get_all_orders,
    get_all_order_items,
    get_all_order_items_by_order_id,
)

reports_namespace = Namespace("reports")

class ReportsUsers(Resource):
    def get(self):
        user_fields = ['id','email', 'username', 'role', 'created_date', 'preferred_contact', 'get_order_alert', 'get_points_alert','get_problem_alert', 'sponsor_headline',  'sponsor_slug', 'sponsor_logo' ]
        user_data = build_csv(get_users(), user_fields)
        response = make_response(user_data)
        cd = 'attachment; filename=user_report.csv'
        response.headers['Content-Disposition'] = cd 
        response.mimetype='text/csv'
        return response


class ReportsAffiliations(Resource):
    def get(self):
        affiliations_fields = ['id','user_id','sponsor_name','status','current_points','created_date']
        affiliations_data = build_csv(get_affiliations(), affiliations_fields)
        response = make_response(affiliations_data)
        cd = 'attachment; filename=affiliations_report.csv'
        response.headers['Content-Disposition'] = cd 
        response.mimetype='text/csv'
        return response



####Helpers

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
        "preferred_contact": fields.String(required=False),
        "sponsor_logo": fields.String(required=False),
        "sponsor_headline": fields.String(required=False),
        "sponsor_slug": fields.String(required=False)
    },
)

@users_namespace.marshal_with(user, as_list=True)
def get_users():
    return get_all_users()

###

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

@affiliations_namespace.marshal_with(affiliation, as_list=True)
def get_affiliations():
    return get_all_affiliations()

###










def build_csv(file, attrs):
    res = ""
    for item in attrs:
        res += item + ","
    res += "\n"
    for item in file:
        for field in attrs:
            res += str(item[field]) + ","
        res += "\n"
    return res


reports_namespace.add_resource(ReportsUsers, "/users")
reports_namespace.add_resource(ReportsAffiliations, "/affiliations")



