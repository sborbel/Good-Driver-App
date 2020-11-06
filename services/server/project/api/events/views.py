# services/server/project/api/events/views.py


from flask import request
from flask_restx import Resource, fields, Namespace
from project.helpers.mail_service import send_email

from project.api.users.crud import (
    get_user_by_id,
    update_user,
    get_all_affiliations_by_user,
    update_affiliation,
)

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
        "sponsor_name": fields.String(required=True)
    },
)


class EventsList(Resource):
    @events_namespace.marshal_with(event, as_list=True)
    def get(self):
        """Returns all events."""
        return get_all_events(), 200

    @events_namespace.expect(event, validate=True)
    @events_namespace.response(201, "<event_id> was added!")
    @events_namespace.response(400, "Sorry. That event already exists.")
    def post(self):
        """Creates a new event."""
        post_data = request.get_json()
        description = post_data.get("description")
        points = post_data.get("points")
        user_id = post_data.get("user_id")
        sponsor_name = post_data.get("sponsor_name")
        response_object = {}
        add_event(description, points, user_id, sponsor_name)

        # Update points on user record
        user = get_user_by_id(user_id)
        user_affiliations = get_all_affiliations_by_user(user_id) 

        user_record = {}
        for item in user_affiliations:
            if item.sponsor_name == sponsor_name:
                user_record = item
                user_id = user_record.user_id
                sponsor_name = user_record.sponsor_name
                updated_points = item.current_points + points
                # current_points = updated_points
                status = user_record.status


                update_affiliation(user_record, user_id, sponsor_name, updated_points, status)

                if user.get_points_alert:
                    try:
                        # Req Change 3:
                        msg = "You now have "+ updated_points +" points in the GoodDriver App."
                        send_email(user.email, "Points updated in GoodDriver App", msg)
                    except:
                        pass

                response_object["message"] = f"Event was added!"
                return response_object, 201


class EventsListbyUser(Resource):
    @events_namespace.marshal_with(event, as_list=True)
    # def get(self, user_id):
    #     """Returns all events for a single user."""
    #     return get_all_events_by_user_id(user_id), 200



    def get(self, user_id, caller_id):
        """Returns all events for a single user that are authorized for the caller."""

        authorized_list = get_all_events_by_user_id(user_id)

        if user_id == caller_id:
            return authorized_list, 200
        else:
            caller = get_user_by_id(caller_id)
            if caller.role == 'admin':
                return authorized_list, 200
            elif caller.role == 'driver':
                events_namespace.abort(404, f"Unauthorized request") 
            else:
                caller = get_all_affiliations_by_user(caller_id)
                filtered_list = []
                for item in authorized_list:
                    if item.sponsor_name == caller[0].sponsor_name:
                        filtered_list.append(item)
                return filtered_list, 200

class Events(Resource):
    @events_namespace.marshal_with(event)
    @events_namespace.response(200, "Success")
    @events_namespace.response(404, "Event <event_id> does not exist")
    def get(self, event_id):
        """Returns all details for a single event."""
        event = get_event_by_id(event_id)
        if not event:
            events_namespace.abort(404, f"Event {event_id} does not exist")
        return event, 200


    @events_namespace.expect(event, validate=False)
    @events_namespace.response(200, "<event_id> was updated!")
    @events_namespace.response(404, "Event <event_id> does not exist")
    def put(self, event_id):
        """Updates an event."""

        event = get_event_by_id(event_id)
        if not event:
            events_namespace.abort(404, f"Event {event_id} does not exist")

        post_data = request.get_json()
        description = post_data.get("description") or event.description
        points = post_data.get("points") or event.points
        current_points = post_data.get("current_points") or event.current_points
        status = post_data.get("status") or event.status
        response_object = {}

        update_event(event, description, points, current_points, status)

        user_record = get_user_by_id(user_id)
        if user_record.get_points_alert and points != event.points:
            try:
                # Req Change 3:
                msg = "You now have "+ points +" points in the GoodDriver App."
                send_email(email, "Points updated in GoodDriver App", msg)
            except:
                pass

        response_object["message"] = f"{event.id} was updated!"
        return response_object, 200

    @events_namespace.response(200, "<event_id> was removed!")
    @events_namespace.response(404, "Event <event_id> does not exist")
    def delete(self, event_id):
        """Updates a event."""
        response_object = {}
        event = get_event_by_id(event_id)
        if not event:
            events_namespace.abort(404, f"Event {event_id} does not exist")
        delete_event(event)
        response_object["message"] = f"Event {event.id} was removed!"
        return response_object, 200


events_namespace.add_resource(EventsList, "/")
# events_namespace.add_resource(EventsListbyUser, "/by_user/<int:user_id>")
events_namespace.add_resource(EventsListbyUser, "/by_user/<int:user_id>/by_caller/<int:caller_id>")
events_namespace.add_resource(Events, "/<int:event_id>")
