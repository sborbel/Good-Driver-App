# services/server/project/api/threads/views.py

import datetime
from flask import request
from flask_restx import Resource, fields, Namespace

from project.api.threads.crud import (
    get_all_threads,
    get_all_threads_by_user_id,
    add_thread,
    get_thread_by_id,
    update_thread,
    delete_thread,
    get_all_messages,
    get_all_messages_by_thread_id,
    get_message_by_id,
    add_message,
    update_message,
    delete_message
)


threads_namespace = Namespace("threads")

thread = threads_namespace.model(
    "Thread",
    {
        "id": fields.Integer(readOnly=True),
        "status": fields.String(required=True),
        "creator_id": fields.Integer(required=True),
        "created_date": fields.DateTime,
    },
)


class ThreadsList(Resource):
    @threads_namespace.marshal_with(thread, as_list=True)
    def get(self):
        """Returns all threads."""
        return get_all_threads(), 200

    @threads_namespace.expect(thread, validate=True)
    @threads_namespace.response(201, "<thread_id> was added!")
    @threads_namespace.response(400, "Sorry. That id already exists.")
    def post(self):
        """Creates a new thread."""
        post_data = request.get_json()
        status = post_data.get("status")
        creator_id = post_data.get("creator_id")
        response_object = {}

        newThread = add_thread(status, creator_id)
        response_object["message"] = f"Thread was added!"
        response_object["id"] = newThread.id
        return response_object, 201


class ThreadsListbyUser(Resource):
    @threads_namespace.marshal_with(thread, as_list=True)
    def get(self, user_id):
        """Returns all threads for a single user."""
        return get_all_threads_by_user_id(user_id), 200


class Threads(Resource):
    @threads_namespace.marshal_with(thread)
    @threads_namespace.response(200, "Success")
    @threads_namespace.response(404, "Thread <thread_id> does not exist")
    def get(self, thread_id):
        """Returns all details for a single thread."""
        thread = get_thread_by_id(thread_id)
        if not thread:
            threads_namespace.abort(404, f"Thread {thread_id} does not exist")
        return thread, 200


    @threads_namespace.expect(thread, validate=False)
    @threads_namespace.response(200, "<thread_id> was updated!")
    @threads_namespace.response(404, "Thread <thread_id> does not exist")
    def put(self, thread_id):
        """Updates a thread."""

        thread = get_thread_by_id(thread_id)
        if not thread:
            threads_namespace.abort(404, f"Thread {thread_id} does not exist")

        post_data = request.get_json()
        status = post_data.get("status") or thread.status
        creator_id = post_data.get("user_id") or thread.creator_id
        response_object = {}

        update_thread(thread, status, creator_id)
        response_object["message"] = f"{thread.id} was updated!"
        return response_object, 200

    @threads_namespace.response(200, "<thread_id> was removed!")
    @threads_namespace.response(404, "Thread <thread_id> does not exist")
    def delete(self, thread_id):
        """Updates an thread."""
        response_object = {}
        thread = get_thread_by_id(thread_id)
        if not thread:
            threads_namespace.abort(404, f"Thread {thread_id} does not exist")
        delete_thread(thread)
        response_object["message"] = f"Thread {thread.id} was removed!"
        return response_object, 200

# Messages

messages_namespace = Namespace("messages")

message = messages_namespace.model(
    "Message",
    {
        "id": fields.Integer(readOnly=True),
        "thread_id": fields.Integer(required=True),
        "sender_id": fields.Integer(required=True),
        "recipient_id": fields.Integer(required=True),
        "subject": fields.String(required=True),
        "content": fields.String(required=True),
        "created_date": fields.DateTime,
    },
)

class MessagesList(Resource):
    @messages_namespace.marshal_with(message, as_list=True)
    def get(self):
        """Returns all messages."""
        return get_all_messages(), 200

    @messages_namespace.expect(message, validate=True)
    @messages_namespace.response(201, "<message> was added!")
    @messages_namespace.response(400, "Sorry. A message with that id already exists.")
    def post(self):
        """Creates a new message."""
        post_data = request.get_json()
        thread_id = post_data.get("thread_id")
        sender_id = post_data.get("sender_id")
        recipient_id = post_data.get("recipient_id")
        created_date = datetime.datetime.now()
        subject = post_data.get("subject")
        content = post_data.get("content")
        response_object = {}
        add_message(thread_id, sender_id, recipient_id, subject, content, created_date)
        response_object["message"] = f"Message was added!"
        return response_object, 201


class MessagesListbyThread(Resource):
    @messages_namespace.marshal_with(message, as_list=True)
    def get(self, thread_id):
        """Returns all messages for a single thread."""
        return get_all_messages_by_thread_id(thread_id), 200


class Messages(Resource):
    @messages_namespace.marshal_with(message)
    @messages_namespace.response(200, "Success")
    @messages_namespace.response(404, "Message message_id> does not exist")
    def get(self, message_id):
        """Returns all details for a single message."""
        message = get_message_by_id(message_id)
        if not message:
            messages_namespace.abort(404, f"Message {message_id} does not exist")
        return message, 200


    @messages_namespace.expect(message, validate=False)
    @messages_namespace.response(200, "<message_id> was updated!")
    @messages_namespace.response(404, "Message <message_id> does not exist")
    def put(self, message_id):
        """Updates a message."""

        message = get_message_by_id(message_id)
        if not message:
            messages_namespace.abort(404, f"Message {message_id} does not exist")

        post_data = request.get_json()
        thread_id = post_data.get("thread_id") or message.thread_id
        sender_id = post_data.get("sender_id") or message.sender_id
        recipient_id = post_data.get("recipient_id") or message.recipient_id
        created_date =  datetime.datetime.now()
        subject = post_data.get("subject") or message.subject
        content = post_data.get("content") or message.content
        response_object = {}

        update_message(message, thread_id, sender_id, recipient_id, created_date, subject, content)
        response_object["message"] = f"{message.id} was updated!"
        return response_object, 200

    @messages_namespace.response(200, "<message_id> was removed!")
    @messages_namespace.response(404, "Message <message_id> does not exist")
    def delete(self, message_id):
        """Updates a message."""
        response_object = {}
        message = get_message_by_id(message_id)
        if not message:
            messages_namespace.abort(404, f"Message {message_id} does not exist")
        delete_message(message)
        response_object["message"] = f"Message {message.id} was removed!"
        return response_object, 200


threads_namespace.add_resource(ThreadsList, "")
threads_namespace.add_resource(ThreadsListbyUser, "/by_user/<int:user_id>")
threads_namespace.add_resource(Threads, "/<int:thread_id>")

messages_namespace.add_resource(MessagesList, "")
messages_namespace.add_resource(MessagesListbyThread, "/by_thread/<int:thread_id>")
messages_namespace.add_resource(Messages, "/<int:message_id>")