# services/server/project/api/orders/crud.py


from project import db
from project.api.orders.models import Order
from project.api.orders.models import OrderItem

# Order CRUD
def get_all_orders():
    return Order.query.all()

def get_all_orders_by_user_id(search_id):
    return Order.query.filter_by(user_id=search_id).all()


def get_order_by_id(order_id):
    return Order.query.filter_by(id=order_id).first()


def add_order(status, user_id):
    order = Order(status=status, user_id=user_id)
    db.session.add(order)
    db.session.commit()
    return order


def update_order(order, status, user_id):
    order.status = status
    order.user_id = user_id
    db.session.commit()
    return order


def delete_order(order):
    db.session.delete(order)
    db.session.commit()
    return order

# OrderItem CRUD
def get_all_order_items():
    return OrderItem.query.all()

def get_all_order_items_by_order_id(search_id):
    return OrderItem.query.filter_by(order_id=search_id).all()

def get_order_item_by_id(item_id):
    return OrderItem.query.filter_by(id=item_id).first()


def add_order_item(order_id, catalog_id, catalog_item_id, quantity, actual_cost, points_cost):
    order_item = Order(order_id=order_id, catalog_id=catalog_id, catalog_item_id=catalog_item_id, quantity=quantity, actual_cost=actual_cost, points_cost=points_cost)
    db.session.add(order_item)
    db.session.commit()
    return order_item


def update_order_item(order_item, order_id, catalog_id, catalog_item_id, quantity, actual_cost, points_cost):
    order_item.order_id = order_id
    order_item.catalog_id = catalog_id
    order_item.catalog_item_id = catalog_item_id
    order_item.quantity = quantity
    order_item.actual_cost = actual_cost
    order_item.points_cost = points_cost
    db.session.commit()
    return order_item


def delete_order_item(order_item):
    db.session.delete(order_item)
    db.session.commit()
    return order_item



