# services/server/project/api/orders/models.py


import os
import datetime

import jwt
from flask import current_app
from sqlalchemy.sql import func

from project import db
from project.api.catalogs.models import Catalog
from project.api.catalogs.models import CatalogItem


class Order(db.Model):

    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    status = db.Column(db.String(32), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_date = db.Column(db.DateTime, default=func.now(), nullable=False)

    def __init__(self, status="", user_id=""):
        self.status = status
        self.user_id = user_id

class OrderItem(db.Model):

    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    # The following 2 key constraints may cause errors if the imports are not right
    catalog_id = db.Column(db.Integer, db.ForeignKey('catalogs.id'), nullable=False)
    catalog_item_id = db.Column(db.Integer, db.ForeignKey('catalog_items.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    points_cost = db.Column(db.Integer, nullable=False)
    actual_cost = db.Column(db.Numeric(10,2), nullable=False)
    created_date = db.Column(db.DateTime, default=func.now(), nullable=False)


    def __init__(self, order_id="", catalog_id="", catalog_item_id="", quantity="", actual_cost="", points_cost=""):
        self.order_id = order_id
        self.catalog_id = catalog_id
        self.catalog_item_id = catalog_item_id
        self.quantity = quantity
        self.actual_cost = actual_cost
        self.points_cost = points_cost

# if os.getenv("FLASK_ENV") == "development":
#     from project import admin
#     from project.api.orders.admin import CatalogsAdminView

#     admin.add_view(CatalogsAdminView(Catalog, db.session))

