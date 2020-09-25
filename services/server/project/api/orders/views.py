# services/server/project/api/orders/views.py


from flask import request
from flask_restx import Resource, fields, Namespace

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


orders_namespace = Namespace("orders")

order = orders_namespace.model(
    "Order",
    {
        "id": fields.Integer(readOnly=True),
        "status": fields.String(required=True),
        "user_id": fields.Integer(required=True),
        "created_date": fields.DateTime,
    },
)


class OrdersList(Resource):
    @orders_namespace.marshal_with(order, as_list=True)
    def get(self):
        """Returns all orders."""
        return get_all_orders(), 200

    # @orders_namespace.expect(order_post, validate=True)
    @orders_namespace.response(201, "<order_id> was added!")
    @orders_namespace.response(400, "Sorry. That id already exists.")
    def post(self):
        """Creates a new order."""
        post_data = request.get_json()
        status = post_data.get("status")
        user_id = post_data.get("user_id")
        response_object = {}

        add_order(name, supplier, user_id)
        response_object["message"] = f"Order was added!"
        return response_object, 201


class OrdersListbyUser(Resource):
    @orders_namespace.marshal_with(order, as_list=True)
    def get(self, user_id):
        """Returns all orders for a single user."""
        return get_all_orders_by_user_id(user_id), 200


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


    @orders_namespace.expect(order, validate=True)
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
        "order_id": fields.Integer(readOnly=True),
        "catalog_id": fields.Integer(readOnly=True),
        "catalog_item_id": fields.Integer(readOnly=True),
        "quantity": fields.Integer(readOnly=True),
        "actual_cost": fields.Fixed(decimals=2, required=True),
        "points_cost": fields.Integer(readOnly=True),
    },
)

class OrderItemsList(Resource):
    @order_items_namespace.marshal_with(order_item, as_list=True)
    def get(self):
        """Returns all orders."""
        return get_all_order_items(), 200

    # @order_items_namespace.expect(order_post, validate=True)
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
        add_order_item(order_id, catalog_id, catalog_item_id, quantity, actual_cost, points_cost)
        response_object["message"] = f"Order item was added!"
        return response_object, 201


class OrderItemsListbyOrder(Resource):
    @order_items_namespace.marshal_with(order, as_list=True)
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


    @order_items_namespace.expect(order_item, validate=True)
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
orders_namespace.add_resource(OrdersListbyUser, "/by_user/<int:user_id>")
orders_namespace.add_resource(Orders, "/<int:order_id>")

order_items_namespace.add_resource(OrderItemsList, "")
order_items_namespace.add_resource(OrderItemsListbyOrder, "/by_order/<int:order_id>")
order_items_namespace.add_resource(OrderItems, "/<int:order_item_id>")