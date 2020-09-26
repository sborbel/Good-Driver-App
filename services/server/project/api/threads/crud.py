# services/server/project/api/threads/crud.py


from project import db
from project.api.threads.models import Thread
from project.api.threads.models import Message

# Thread CRUD
def get_all_threads():
    return Thread.query.all()

def get_all_threads_by_user_id(search_id):
    return Thread.query.filter_by(creator_id=search_id).all()


def get_thread_by_id(thread_id):
    return Thread.query.filter_by(id=thread_id).first()

def add_thread(status, creator_id):
    thread = Thread(status=status, creator_id=creator_id)
    db.session.add(thread)
    db.session.commit()
    return thread


def update_thread(thread, status, creator_id):
    thread.status = status
    thread.creator_id = creator_id
    db.session.commit()
    return thread


def delete_thread(thread):
    db.session.delete(thread)
    db.session.commit()
    return thread

# Message CRUD
def get_all_messages():
    return Message.query.all()

def get_all_messages_by_thread_id(search_id):
    return Message.query.filter_by(thread_id=search_id).all()

def get_message_by_id(message_id):
    return Message.query.filter_by(id=message_id).first()


def add_message(thread_id, sender_id, recipient_id, subject, content, created_date):
    message = Message(thread_id=thread_id, sender_id=sender_id, recipient_id=recipient_id, subject=subject, content=content, created_date=created_date)
    db.session.add(message)
    db.session.commit()
    return message

def update_message(message, thread_id, sender_id, recipient_id, created_date, subject, content):
    message.thread_id = thread_id
    message.sender_id = sender_id
    message.recipient_id = recipient_id
    message.created_date = created_date
    message.subject = subject
    message.content = content
    db.session.commit()
    return message

def delete_message(message):
    db.session.delete(message)
    db.session.commit()
    return message



