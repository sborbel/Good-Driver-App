# services/server/project/api/catalogs/crud.py


from project import db
from project.api.catalogs.models import Catalog
from project.api.catalogs.models import CatalogItem
from project.api.catalogs.models import Source
from project.helpers.ebay_handlers import find_items_by_keyword

# Catalog CRUD
def get_all_catalogs():
    return Catalog.query.all()

def get_all_catalogs_by_sponsor_name(search_name):
    return Catalog.query.filter_by(sponsor_name=search_name).all()


def get_catalog_by_id(catalog_id):
    return Catalog.query.filter_by(id=catalog_id).first()


def add_catalog(name, supplier, sponsor_id):
    catalog = Catalog(name=name, supplier=supplier, sponsor_id=sponsor_id)
    db.session.add(catalog)
    db.session.commit()
    return catalog


def update_catalog(catalog, name, supplier):
    catalog.name = name
    catalog.supplier = supplier
    db.session.commit()
    return catalog


def delete_catalog(catalog):
    db.session.delete(catalog)
    db.session.commit()
    return catalog

# CatalogItem CRUD
def get_all_catalog_items():
    return CatalogItem.query.all()

def get_all_catalog_items_by_catalog_id(search_id):
    return CatalogItem.query.filter_by(catalog_id=search_id).all()

def get_catalog_item_by_id(item_id):
    return CatalogItem.query.filter_by(id=item_id).first()


def add_catalog_item(name, description, image_url, points_cost, actual_cost, catalog_id):
    catalog_item = CatalogItem(name=name, description=description, image_url=image_url, points_cost=points_cost, actual_cost=actual_cost, catalog_id=catalog_id)
    db.session.add(catalog_item)
    db.session.commit()
    return catalog_item


def update_catalog_item(catalog_item, name, description, image_url, points_cost, actual_cost, catalog_id):
    catalog_item.name = name
    catalog_item.description = description, 
    catalog_item.image_url = image_url, 
    catalog_item.points_cost = points_cost, 
    catalog_item.actual_cost = actual_cost, 
    catalog_item.catalog_id = catalog_id
    db.session.commit()
    return catalog_item


def delete_catalog_item(catalog_item):
    db.session.delete(catalog_item)
    db.session.commit()
    return catalog_item

def get_all_sources():
    return Source.query.all()

def find_items_by_source(source, keywords):
    return find_items_by_keyword(keywords)

