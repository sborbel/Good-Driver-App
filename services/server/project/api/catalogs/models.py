# services/server/project/api/catalogs/models.py


import os
import datetime

import jwt
from flask import current_app
from sqlalchemy.sql import func

from project import db


class Catalog(db.Model):

    __tablename__ = "catalogs"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(128), nullable=False)
    supplier = db.Column(db.String(128), nullable=False)
    created_date = db.Column(db.DateTime, default=func.now(), nullable=False)
    sponsor_name = db.Column(db.String, nullable=False)

    def __init__(self, name="", supplier="", sponsor_name=""):
        self.name = name
        self.supplier = supplier
        self.sponsor_name = sponsor_name

class CatalogItem(db.Model):

    __tablename__ = "catalog_items"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.String(512), nullable=False)
    image_url = db.Column(db.String(512), nullable=True)
    points_cost = db.Column(db.Integer, nullable=False)
    actual_cost = db.Column(db.Numeric(10,2), nullable=False)
    created_date = db.Column(db.DateTime, default=func.now(), nullable=False)
    catalog_id = db.Column(db.Integer, nullable=False)


    def __init__(self, name="", description="", image_url="", points_cost="", actual_cost="", catalog_id=""):
        self.name = name
        self.description = description
        self.image_url = image_url
        self.points_cost = points_cost
        self.actual_cost = actual_cost
        self.catalog_id = catalog_id

# if os.getenv("FLASK_ENV") == "development":
#     from project import admin
#     from project.api.catalogs.admin import CatalogsAdminView

#     admin.add_view(CatalogsAdminView(Catalog, db.session))

