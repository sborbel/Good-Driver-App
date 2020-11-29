# services/server/project/api/reports/views.py

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

class ReportsFees(Resource):
    def get(self):
        order_fields = ["id","status","user_id","sponsor_name","created_date"]
        order_item_fields = ["id","order_id","catalog_id","catalog_item_id","quantity","actual_cost","points_cost","created_date"]
        fee_report_fields = ['order_id', 'order_created_date', 'status', 'user_id', 'sponsor_name',  'catalog_id', 'catalog_item_id', 'item_id', 'quantity', 'actual_cost', 'points_cost', 'item_added_date']
        fee_report_data = [] 
        order_data = get_orders()
        for order in order_data:
            order['order_id'] = order.pop('id')
            order['order_created_date'] = order.pop('created_date')
            order_item_data = get_items_by_order_id(order['order_id'])
            for item in order_item_data:
                item['item_id'] = item.pop('id')
                item['item_added_date'] = item.pop('created_date')
                item.pop('order_id')
                temp_data = order.copy()
                temp_data.update(item)
                fee_report_data.append(temp_data)

        report_data = build_csv(fee_report_data, fee_report_fields)
        response = make_response(report_data)
        cd = 'attachment; filename=fee_report.csv'
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

orders_namespace = Namespace("orders")

order = orders_namespace.model(
    "Order",
    {
        "id": fields.Integer(readOnly=True),
        "status": fields.String(required=False),
        "user_id": fields.Integer(required=True),
        "sponsor_name": fields.String(required=True),
        "created_date": fields.DateTime,
    },
)

@orders_namespace.marshal_with(order, as_list=True)
def get_orders():
    return get_all_orders()

order_items_namespace = Namespace("order_items")

order_item = order_items_namespace.model(
    "OrderItem",
    {
        "id": fields.Integer(readOnly=True),
        "order_id": fields.Integer(required=True),
        "catalog_id": fields.Integer(required=True),
        "catalog_item_id": fields.Integer(required=True),
        "quantity": fields.Integer(required=True),
        "actual_cost": fields.Fixed(decimals=2, required=True),
        "points_cost": fields.Integer(required=True),
        "created_date": fields.DateTime,
    },
)

@order_items_namespace.marshal_with(order_item, as_list=True)
def get_items_by_order_id(order_id):
    return get_all_order_items_by_order_id(order_id)

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
reports_namespace.add_resource(ReportsFees, "/fees")


