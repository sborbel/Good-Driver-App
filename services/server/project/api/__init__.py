# services/server/project/api/__init__.py


from flask_restx import Api

from project.api.auth import auth_namespace
from project.api.ping import ping_namespace
from project.api.users.views import users_namespace
from project.api.events.views import events_namespace
from project.api.announcements.views import announcements_namespace
from project.api.catalogs.views import catalogs_namespace
from project.api.catalogs.views import catalog_items_namespace
from project.api.catalogs.views import sources_namespace
from project.api.catalogs.views import itemreqs_namespace
from project.api.orders.views import orders_namespace
from project.api.orders.views import order_items_namespace
from project.api.threads.views import threads_namespace
from project.api.threads.views import messages_namespace

api = Api(version="1.0", title="Safe Driver API", doc="/doc/")

# api.add_namespace(ping_namespace, path="/ping")
# api.add_namespace(users_namespace, path="/users")
# api.add_namespace(auth_namespace, path="/auth")
# api.add_namespace(events_namespace, path="/events")
# api.add_namespace(announcements_namespace, path="/announcements")
# api.add_namespace(catalogs_namespace, path="/catalogs")
# api.add_namespace(catalog_items_namespace, path="/catalog_items")
# api.add_namespace(sources_namespace, path="/sources")
# api.add_namespace(itemreqs_namespace, path="/itemreqs")
# api.add_namespace(orders_namespace, path="/orders")
# api.add_namespace(order_items_namespace, path="/order_items")
# api.add_namespace(threads_namespace, path="/threads")
# api.add_namespace(messages_namespace, path="/messages")

api.add_namespace(ping_namespace, path="/ping")
api.add_namespace(auth_namespace, path="/auth")
api.add_namespace(users_namespace, path="/api/users")
api.add_namespace(events_namespace, path="/api/events")
api.add_namespace(announcements_namespace, path="/api/announcements")
api.add_namespace(catalogs_namespace, path="/api/catalogs")
api.add_namespace(catalog_items_namespace, path="/api/catalog_items")
api.add_namespace(sources_namespace, path="/api/sources")
api.add_namespace(itemreqs_namespace, path="/api/itemreqs")
api.add_namespace(orders_namespace, path="/api/orders")
api.add_namespace(order_items_namespace, path="/api/order_items")
api.add_namespace(threads_namespace, path="/api/threads")
api.add_namespace(messages_namespace, path="/api/messages")