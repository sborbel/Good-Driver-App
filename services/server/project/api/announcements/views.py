# services/server/project/api/announcements/views.py


from flask import request
from flask_restx import Resource, fields, Namespace

from project.api.announcements.crud import (
    get_all_announcements,
    get_all_announcements_by_sponsor_name,
    add_announcement,
    get_announcement_by_id,
    update_announcement,
    delete_announcement,
)


announcements_namespace = Namespace("announcements")

announcement = announcements_namespace.model(
    "Announcement",
    {
        "id": fields.Integer(readOnly=True),
        "content": fields.String(required=True),
        "created_date": fields.DateTime,
        "sponsor_name": fields.String(required=True),
    },
)


class AnnouncementsList(Resource):
    @announcements_namespace.marshal_with(announcement, as_list=True)
    def get(self):
        """Returns all announcements."""
        return get_all_announcements(), 200

    @announcements_namespace.expect(announcement, validate=True)
    @announcements_namespace.response(201, "<announcement_id> was added!")
    @announcements_namespace.response(400, "Sorry. That announcement already exists.")
    def post(self):
        """Creates a new announcement."""
        post_data = request.get_json()
        content = post_data.get("content")
        sponsor_name = post_data.get("sponsor_name")
        response_object = {}

        add_announcement(content, sponsor_name)
        response_object["message"] = f"Announcement was added!"
        return response_object, 201


class AnnouncementsListbySponsor(Resource):
    @announcements_namespace.marshal_with(announcement, as_list=True)
    def get(self, sponsor_name):
        """Returns all announcements for a single sponsor."""
        return get_all_announcements_by_sponsor_name(sponsor_name), 200



class Announcements(Resource):
    @announcements_namespace.marshal_with(announcement)
    @announcements_namespace.response(200, "Success")
    @announcements_namespace.response(404, "Announcement <announcement_id> does not exist")
    def get(self, announcement_id):
        """Returns all details for a single announcement."""
        announcement = get_announcement_by_id(announcement_id)
        if not announcement:
            announcements_namespace.abort(404, f"Announcement {announcement_id} does not exist")
        return announcement, 200


    @announcements_namespace.expect(announcement, validate=False)
    @announcements_namespace.response(200, "<announcement_id> was updated!")
    @announcements_namespace.response(404, "Announcement <announcement_id> does not exist")
    def put(self, announcement_id):
        """Updates an announcement."""
        post_data = request.get_json()
        content = post_data.get("content")

        response_object = {}

        announcement = get_announcement_by_id(announcement_id)
        if not announcement:
            announcements_namespace.abort(404, f"Announcement {announcement_id} does not exist")
        update_announcement(announcement, content)
        response_object["message"] = f"{announcement.id} was updated!"
        return response_object, 200

    @announcements_namespace.response(200, "<announcement_id> was removed!")
    @announcements_namespace.response(404, "Announcement <announcement_id> does not exist")
    def delete(self, announcement_id):
        """Updates a announcement."""
        response_object = {}
        announcement = get_announcement_by_id(announcement_id)
        if not announcement:
            announcements_namespace.abort(404, f"Announcement {announcement_id} does not exist")
        delete_announcement(announcement)
        response_object["message"] = f"{announcement.id} was removed!"
        return response_object, 200


announcements_namespace.add_resource(AnnouncementsList, "/")
announcements_namespace.add_resource(AnnouncementsListbySponsor, "/by_sponsor/<string:sponsor_name>")
announcements_namespace.add_resource(Announcements, "/<int:announcement_id>")
