# services/server/project/api/orders/views.py


from flask import request
from flask_restx import Resource, fields, Namespace, reqparse
from project.helpers.mail_service import send_email

from project.api.orders.crud import (
    get_all_orders,
    get_all_orders_by_user_id,
    add_order,
    get_order_by_id,
    update_order,
    delete_order,
    get_all_order_items,
    get_all_order_items_by_order_id,
    get_order_item_by_id,
    add_order_item,
    update_order_item,
    delete_order_item
)

from project.api.users.crud import (
    get_user_by_id,
    update_user,
    get_all_affiliations_by_user
)

from project.api.catalogs.crud import (
    get_catalog_item_by_id
)

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



class OrdersList(Resource):
    @orders_namespace.marshal_with(order, as_list=True)
    def get(self):
        """Returns all orders."""
        return get_all_orders(), 200

    @orders_namespace.expect(order, validate=True)
    @orders_namespace.response(201, "<order_id> was added!")
    @orders_namespace.response(400, "Sorry. That id already exists.")
    def post(self):
        """Creates a new order."""
        post_data = request.get_json()
        status = post_data.get("status") or "active"
        user_id = post_data.get("user_id")
        sponsor_name = post_data.get("sponsor_name")
        response_object = {}
        new_order = add_order(status, user_id, sponsor_name)
        response_object["id"] = new_order.id
        response_object["message"] = f"Order was added!"
        return response_object, 201

class OrdersListbyUser(Resource):
    @orders_namespace.marshal_with(order, as_list=True)
    def get(self, user_id, caller_id):
        """Returns all orders for a single user."""

        authorized_list = get_all_orders_by_user_id(user_id)

        if user_id == caller_id:
            return authorized_list, 200
        else:
            caller = get_user_by_id(caller_id)
            if caller.role == 'admin':
                return authorized_list, 200
            elif caller.role == 'driver':
                orders_namespace.abort(404, f"Unauthorized request") 
            else:
                caller = get_all_affiliations_by_user(caller_id)
                filtered_list = []
                for item in authorized_list:
                    if item.sponsor_name == caller[0].sponsor_name:
                        filtered_list.append(item)
                return filtered_list, 200


class Orders(Resource):
    @orders_namespace.marshal_with(order)
    @orders_namespace.response(200, "Success")
    @orders_namespace.response(404, "Order <order_id> does not exist")
    def get(self, order_id):
        """Returns all details for a single order."""
        order = get_order_by_id(order_id)
        if not order:
            orders_namespace.abort(404, f"Order {order_id} does not exist")
        return order, 200


    @orders_namespace.expect(order, validate=False)
    @orders_namespace.response(200, "<order_id> was updated!")
    @orders_namespace.response(404, "Order <order_id> does not exist")
    def put(self, order_id):
        """Updates an order."""

        order = get_order_by_id(order_id)
        if not order:
            orders_namespace.abort(404, f"Order {order_id} does not exist")

        post_data = request.get_json()
        status = post_data.get("status") or order.status
        user_id = post_data.get("user_id") or order.user_id
        response_object = {}
        # print(f"status: {status}")
        if status == "submitted":
            # Process the order
            # Get the user record and order items
            user_record = get_user_by_id(user_id) 

            # Req Change 1
            # Reject any order from admin or sponsor_mgr
            if user_record.role != "driver":
                response_object["message"] = f"{order.id} is a dummy order and will not process."
                return response_object, 412


            order_items = get_all_order_items_by_order_id(order_id)
            # Verify sufficient points to satisfy order
            # 1. Get points in order and summary of items
            tot_points_in_order = 0
            order_summary = ""
            for item in order_items:
                details = get_catalog_item_by_id(item.catalog_item_id)
                tot_points_in_order += item.points_cost
                order_summary += f"Qty: { str(item.quantity) } - { details.name }, \tPoints cost: { str(item.points_cost * item.quantity) }\n"
            
            driver_points_after_order = user_record.current_points - tot_points_in_order

            order_summary += "--------------------------------------------------------------------------\n"
            order_summary += f"Total points cost: \t\t\t\t{ str(tot_points_in_order) }\n\n"
            order_summary += "Your order has been placed. After your order, you have "+ str(driver_points_after_order) +" points remaining in the GoodDriver App.\n"
            # print(f"Order summary: {order_summary}")
            # print(f"Driver points after order: {driver_points_after_order}")
            # print(f"user_record.get_points_alert: {user_record.get_points_alert}")

            if driver_points_after_order >= 0:
                # Process order
                update_order(order, status, user_id)
                # Update points on user record
                username = user_record.username
                email = user_record.email
                role = user_record.role
                sponsor_name = user_record.sponsor_name
                current_points = driver_points_after_order
                get_points_alert = user_record.get_points_alert 
                get_order_alert = user_record.get_order_alert
                get_problem_alert = user_record.get_problem_alert
                update_user(user_record, username, email, role, sponsor_name, current_points, get_points_alert, get_order_alert, get_problem_alert)
            
                if user_record.get_points_alert:
                    # try:
                        # Req Change 3:
                    send_email(user_record.email, "Order placed in GoodDriver App", order_summary)
                    # except:
                    #     pass
            
            else:
                # Driver has insufficient points for order
                if user_record.get_points_alert:
                    try:
                        # Req Change 3:
                        send_email(user_record.email, "Order was not placed in GoodDriver App", "We're sorry, but you have insufficient points to place your order in the GoodDriver App.")
                    except:
                        pass

                response_object["message"] = f"{order.id} did not update due to insufficient points."
                return response_object, 412

        else:
            # Not an order submission, simply update
            update_order(order, status, user_id)

        response_object["message"] = f"{order.id} was updated!"
        return response_object, 200

    @orders_namespace.response(200, "<order_id> was removed!")
    @orders_namespace.response(404, "Order <order_id> does not exist")
    def delete(self, order_id):
        """Updates an order."""
        response_object = {}
        order = get_order_by_id(order_id)
        if not order:
            orders_namespace.abort(404, f"Order {order_id} does not exist")
        delete_order(order)
        response_object["message"] = f"Order {order.id} was removed!"
        return response_object, 200


# OrderItems

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

class OrderItemsList(Resource):
    @order_items_namespace.marshal_with(order_item, as_list=True)
    def get(self):
        """Returns all orders."""
        return get_all_order_items(), 200

    @order_items_namespace.expect(order_item, validate=True)
    @order_items_namespace.response(201, "<order_item> was added!")
    @order_items_namespace.response(400, "Sorry. An item with that name already exists.")
    def post(self):
        """Creates a new order item."""
        post_data = request.get_json()
        order_id = post_data.get("order_id")
        catalog_id = post_data.get("catalog_id")
        catalog_item_id = post_data.get("catalog_item_id")
        quantity = post_data.get("quantity")
        actual_cost = post_data.get("actual_cost")
        points_cost = post_data.get("points_cost")
        response_object = {}
        new_order_item = add_order_item(order_id, catalog_id, catalog_item_id, quantity, actual_cost, points_cost)
        response_object["id"] = new_order_item.id
        response_object["message"] = f"Order item was added!"
        return response_object, 201


class OrderItemsListbyOrder(Resource):
    @order_items_namespace.marshal_with(order_item, as_list=True)
    def get(self, order_id):
        """Returns all order items for a single order."""
        return get_all_order_items_by_order_id(order_id), 200


class OrderItems(Resource):
    @order_items_namespace.marshal_with(order_item)
    @order_items_namespace.response(200, "Success")
    @order_items_namespace.response(404, "Order <order_item_id> does not exist")
    def get(self, order_item_id):
        """Returns all details for a single order item."""
        order_item = get_order_item_by_id(order_item_id)
        if not order_item:
            order_items_namespace.abort(404, f"Order item {order_item_id} does not exist")
        return order_item, 200


    @order_items_namespace.expect(order_item, validate=False)
    @order_items_namespace.response(200, "<order_item_id> was updated!")
    @order_items_namespace.response(404, "Order item <order_item_id> does not exist")
    def put(self, order_item_id):
        """Updates an order item."""

        order_item = get_order_item_by_id(order_item_id)
        if not order_item:
            order_items_namespace.abort(404, f"Order item {order_item_id} does not exist")

        post_data = request.get_json()
        order_id = post_data.get("order_id") or order_item.order_id
        catalog_id = post_data.get("catalog_id") or order_item.catalog_id
        catalog_item_id = post_data.get("catalog_item_id") or order_item.catalog_item_id
        quantity = post_data.get("quantity") or order_item.quantity
        actual_cost = post_data.get("actual_cost") or order_item.actual_cost
        points_cost = post_data.get("points_cost") or order_item.points_cost

        response_object = {}

        update_order_item(order_item, order_id, catalog_id, catalog_item_id, quantity, actual_cost, points_cost)
        response_object["message"] = f"{order_item.id} was updated!"
        return response_object, 200

    @order_items_namespace.response(200, "<order_item_id> was removed!")
    @order_items_namespace.response(404, "Order item <order_item_id> does not exist")
    def delete(self, order_item_id):
        """Updates an order item."""
        response_object = {}
        order_item = get_order_item_by_id(order_item_id)
        if not order_item:
            order_items_namespace.abort(404, f"Order item {order_item_id} does not exist")
        delete_order_item(order_item)
        response_object["message"] = f"Order item {order_item.id} was removed!"
        return response_object, 200


orders_namespace.add_resource(OrdersList, "")
orders_namespace.add_resource(OrdersListbyUser, "/by_user/<int:user_id>/by_caller/<int:caller_id>")
# orders_namespace.add_resource(OrdersListbyUser, "/by_user")
orders_namespace.add_resource(Orders, "/<int:order_id>")

order_items_namespace.add_resource(OrderItemsList, "")
order_items_namespace.add_resource(OrderItemsListbyOrder, "/by_order/<int:order_id>")
order_items_namespace.add_resource(OrderItems, "/<int:order_item_id>")