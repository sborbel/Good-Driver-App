# services/server/project/api/reports/crud.py


from project import db
from project.api.events.models import Event
from project.api.users.models import User
from project.api.users.models import Affiliation
from project.api.orders.models import Order
from project.api.orders.models import OrderItem



def get_all_users():
    return User.query.all()

def get_all_events():
    return Event.query.all()

def get_all_affiliations():
    return Affiliation.query.all()

def get_all_orders():
    return Order.query.all()

def get_all_order_items():
    return OrderItem.query.all()

def get_all_order_items_by_order_id(search_id):
    return OrderItem.query.filter_by(order_id=search_id).all()