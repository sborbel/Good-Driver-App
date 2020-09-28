# services/server/project/api/__init__.py


from flask_restx import Api

from project.api.auth import auth_namespace
from project.api.ping import ping_namespace
from project.api.users.views import users_namespace
from project.api.events.views import events_namespace
from project.api.announcements.views import announcements_namespace
from project.api.catalogs.views import catalogs_namespace
from project.api.catalogs.views import catalog_items_namespace
from project.api.orders.views import orders_namespace
from project.api.orders.views import order_items_namespace
from project.api.threads.views import threads_namespace
from project.api.threads.views import messages_namespace

api = Api(version="1.0", title="Safe Driver API", doc="/doc/")

api.add_namespace(ping_namespace, path="/ping")
api.add_namespace(users_namespace, path="/users")
api.add_namespace(auth_namespace, path="/auth")
api.add_namespace(events_namespace, path="/events")
api.add_namespace(announcements_namespace, path="/announcements")
api.add_namespace(catalogs_namespace, path="/catalogs")
api.add_namespace(catalog_items_namespace, path="/catalog_items")
api.add_namespace(orders_namespace, path="/orders")
api.add_namespace(order_items_namespace, path="/order_items")
api.add_namespace(threads_namespace, path="/threads")
api.add_namespace(messages_namespace, path="/messages")