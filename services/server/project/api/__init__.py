# services/server/project/api/__init__.py


from flask_restx import Api

from project.api.auth import auth_namespace
from project.api.ping import ping_namespace
from project.api.users.views import users_namespace
from project.api.events.views import events_namespace

api = Api(version="1.0", title="Safe Driver API", doc="/doc/")

api.add_namespace(ping_namespace, path="/ping")
api.add_namespace(users_namespace, path="/users")
api.add_namespace(auth_namespace, path="/auth")
api.add_namespace(events_namespace, path="/events")