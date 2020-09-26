# services/server/project/api/catalogs/views.py


from flask import request
from flask_restx import Resource, fields, Namespace

from project.api.catalogs.crud import (
    get_all_catalogs,
    get_all_catalogs_by_sponsor_id,
    add_catalog,
    get_catalog_by_id,
    update_catalog,
    delete_catalog,
    get_all_catalog_items,
    get_all_catalog_items_by_catalog_id,
    get_catalog_item_by_id,
    add_catalog_item,
    update_catalog_item,
    delete_catalog_item
)


catalogs_namespace = Namespace("catalogs")

catalog = catalogs_namespace.model(
    "Catalog",
    {
        "id": fields.Integer(readOnly=True),
        "name": fields.String(required=True),
        "supplier": fields.String(required=True),
        "created_date": fields.DateTime,
        "sponsor_id": fields.Integer(required=True),
    },
)


class CatalogsList(Resource):
    @catalogs_namespace.marshal_with(catalog, as_list=True)
    def get(self):
        """Returns all catalogs."""
        return get_all_catalogs(), 200

    @catalogs_namespace.expect(catalog, validate=True)
    @catalogs_namespace.response(201, "<catalog_name> was added!")
    @catalogs_namespace.response(400, "Sorry. That name already exists.")
    def post(self):
        """Creates a new catalog."""
        post_data = request.get_json()
        name = post_data.get("name")
        supplier = post_data.get("supplier")
        sponsor_id = post_data.get("sponsor_id")
        response_object = {}

        add_catalog(name, supplier, sponsor_id)
        response_object["message"] = f"Catalog was added!"
        return response_object, 201


class CatalogsListbySponsor(Resource):
    @catalogs_namespace.marshal_with(catalog, as_list=True)
    def get(self, sponsor_id):
        """Returns all catalogs for a single sponsor."""
        return get_all_catalogs_by_sponsor_id(sponsor_id), 200



class Catalogs(Resource):
    @catalogs_namespace.marshal_with(catalog)
    @catalogs_namespace.response(200, "Success")
    @catalogs_namespace.response(404, "Catalog <catalog_id> does not exist")
    def get(self, catalog_id):
        """Returns all details for a single catalog."""
        catalog = get_catalog_by_id(catalog_id)
        if not catalog:
            catalogs_namespace.abort(404, f"Catalog {catalog_id} does not exist")
        return catalog, 200


    @catalogs_namespace.expect(catalog, validate=False)
    @catalogs_namespace.response(200, "<catalog_id> was updated!")
    @catalogs_namespace.response(404, "Catalog <catalog_id> does not exist")
    def put(self, catalog_id):
        """Updates an catalog."""

        catalog = get_catalog_by_id(catalog_id)
        if not catalog:
            catalogs_namespace.abort(404, f"Catalog {catalog_id} does not exist")

        post_data = request.get_json()
        name = post_data.get("name") or catalog.name
        supplier = post_data.get("supplier") or catalog.supplier
        response_object = {}

        update_catalog(catalog, name, supplier)
        response_object["message"] = f"{catalog.id} was updated!"
        return response_object, 200

    @catalogs_namespace.response(200, "<catalog_id> was removed!")
    @catalogs_namespace.response(404, "Catalog <catalog_id> does not exist")
    def delete(self, catalog_id):
        """Updates a catalog."""
        response_object = {}
        catalog = get_catalog_by_id(catalog_id)
        if not catalog:
            catalogs_namespace.abort(404, f"Catalog {catalog_id} does not exist")
        delete_catalog(catalog)
        response_object["message"] = f"Catalog {catalog.id} was removed!"
        return response_object, 200

# CatalogItems

catalog_items_namespace = Namespace("catalog_items")

catalog_item = catalog_items_namespace.model(
    "CatalogItem",
    {
        "id": fields.Integer(readOnly=True),
        "name": fields.String(required=True),
        "description": fields.String(required=True),
        "image_url": fields.String(required=False),
        "points_cost": fields.Integer(required=True),
        "actual_cost": fields.Fixed(decimals=2, required=True),
        "created_date": fields.DateTime,
        "catalog_id": fields.Integer(required=True),
    },
)

class CatalogItemsList(Resource):
    @catalog_items_namespace.marshal_with(catalog_item, as_list=True)
    def get(self):
        """Returns all catalog items."""
        return get_all_catalog_items(), 200

    @catalog_items_namespace.expect(catalog_item, validate=True)
    @catalog_items_namespace.response(201, "<catalog_item> was added!")
    @catalog_items_namespace.response(400, "Sorry. An item with that name already exists.")
    def post(self):
        """Creates a new catalog item."""
        post_data = request.get_json()
        name = post_data.get("name")
        description = post_data.get("description"), 
        image_url = post_data.get("image_url"), 
        points_cost = post_data.get("points_cost"), 
        actual_cost = post_data.get("actual_cost"), 
        catalog_id = post_data.get("catalog_id")
        response_object = {}
        add_catalog_item(name, description, image_url, points_cost, actual_cost, catalog_id)
        response_object["message"] = f"Catalog item was added!"
        return response_object, 201


class CatalogItemsListbyCatalog(Resource):
    @catalog_items_namespace.marshal_with(catalog_item, as_list=True)
    def get(self, catalog_id):
        """Returns all catalog items for a single catalog."""
        return get_all_catalog_items_by_catalog_id(catalog_id), 200


class CatalogItems(Resource):
    @catalog_items_namespace.marshal_with(catalog_item)
    @catalog_items_namespace.response(200, "Success")
    @catalog_items_namespace.response(404, "Catalog <catalog_item_id> does not exist")
    def get(self, catalog_item_id):
        """Returns all details for a single catalog item."""
        catalog_item = get_catalog_item_by_id(catalog_item_id)
        if not catalog_item:
            catalog_items_namespace.abort(404, f"Catalog item {catalog_item_id} does not exist")
        return catalog_item, 200


    @catalog_items_namespace.expect(catalog_item, validate=False)
    @catalog_items_namespace.response(200, "<catalog_item_id> was updated!")
    @catalog_items_namespace.response(404, "Catalog item <catalog_item_id> does not exist")
    def put(self, catalog_item_id):
        """Updates an catalog item."""

        catalog_item = get_catalog_item_by_id(catalog_item_id)
        if not catalog_item:
            catalog_items_namespace.abort(404, f"Catalog item {catalog_item_id} does not exist")

        post_data = request.get_json()
        name = post_data.get("name") or catalog_item.name
        description = post_data.get("description") or catalog_item.description, 
        image_url = post_data.get("image_url") or catalog_item.image_url, 
        points_cost = post_data.get("points_cost") or catalog_item.points_cost, 
        actual_cost = post_data.get("actual_cost") or catalog_item.actual_cost, 
        catalog_id = post_data.get("catalog_id") or catalog_item.catalog_id
        response_object = {}

        update_catalog_item(catalog_item, name, description, image_url, points_cost, actual_cost, catalog_id)
        response_object["message"] = f"{catalog_item.id} was updated!"
        return response_object, 200

    @catalog_items_namespace.response(200, "<catalog_item_id> was removed!")
    @catalog_items_namespace.response(404, "Catalog item <catalog_item_id> does not exist")
    def delete(self, catalog_item_id):
        """Updates a catalog item."""
        response_object = {}
        catalog_item = get_catalog_item_by_id(catalog_item_id)
        if not catalog_item:
            catalog_items_namespace.abort(404, f"Catalog item {catalog_item_id} does not exist")
        delete_catalog_item(catalog_item)
        response_object["message"] = f"Catalog item {catalog_item.id} was removed!"
        return response_object, 200


catalogs_namespace.add_resource(CatalogsList, "")
catalogs_namespace.add_resource(CatalogsListbySponsor, "/by_sponsor/<int:sponsor_id>")
catalogs_namespace.add_resource(Catalogs, "/<int:catalog_id>")

catalog_items_namespace.add_resource(CatalogItemsList, "")
catalog_items_namespace.add_resource(CatalogItemsListbyCatalog, "/by_catalog/<int:catalog_id>")
catalog_items_namespace.add_resource(CatalogItems, "/<int:catalog_item_id>")