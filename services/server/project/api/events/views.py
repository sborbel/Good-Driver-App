# services/server/project/api/events/views.py


from flask import request
from flask_restx import Resource, fields, Namespace

from project.api.events.crud import (
    get_all_events,
    get_all_events_by_user_id,
    add_event,
    get_event_by_id,
    update_event,
    delete_event,
)


events_namespace = Namespace("events")

event = events_namespace.model(
    "Event",
    {
        "id": fields.Integer(readOnly=True),
        "description": fields.String(required=True),
        "points": fields.Integer(required=True),
        "created_date": fields.DateTime,
        "user_id": fields.Integer(required=True),
    },
)


class EventsList(Resource):
    @events_namespace.marshal_with(event, as_list=True)
    def get(self):
        """Returns all events."""
        return get_all_events(), 200

    # @events_namespace.expect(event_post, validate=True)
    # @events_namespace.response(201, "<event_email> was added!")
    # @events_namespace.response(400, "Sorry. That email already exists.")
    def post(self):
        """Creates a new event."""
        post_data = request.get_json()
        description = post_data.get("description")
        points = post_data.get("points")
        user_id = post_data.get("user_id")
        response_object = {}

        add_event(description, points, user_id)
        response_object["message"] = f"Event was added!"
        return response_object, 201


class EventsListbyUser(Resource):
    @events_namespace.marshal_with(event, as_list=True)
    def get(self, user_id):
        """Returns all events for a single user."""
        return get_all_events_by_user_id(user_id), 200



class Events(Resource):
    @events_namespace.marshal_with(event)
    # @events_namespace.response(200, "Success")
    # @events_namespace.response(404, "Event <event_id> does not exist")
    def get(self, event_id):
        """Returns all details for a single event."""
        event = get_event_by_id(event_id)
        if not event:
            events_namespace.abort(404, f"Event {event_id} does not exist")
        return event, 200


    # @events_namespace.expect(event, validate=True)
    # @events_namespace.response(200, "<event_id> was updated!")
    # @events_namespace.response(404, "Uvent <event_id> does not exist")
    def put(self, event_id):
        """Updates an event."""
        post_data = request.get_json()
        description = post_data.get("description")
        points = post_data.get("points")
        response_object = {}

        event = get_event_by_id(event_id)
        if not event:
            events_namespace.abort(404, f"Event {event_id} does not exist")
        update_event(event, description, email)
        response_object["message"] = f"{event.id} was updated!"
        return response_object, 200

    # @events_namespace.response(200, "<event_id> was removed!")
    # @events_namespace.response(404, "Event <event_id> does not exist")
    def delete(self, event_id):
        """Updates a event."""
        response_object = {}
        event = get_event_by_id(event_id)
        if not event:
            events_namespace.abort(404, f"Event {event_id} does not exist")
        delete_event(event)
        response_object["message"] = f"{event.email} was removed!"
        return response_object, 200


events_namespace.add_resource(EventsList, "")
events_namespace.add_resource(EventsListbyUser, "/<int:user_id>")
events_namespace.add_resource(Events, "/<int:event_id>")
