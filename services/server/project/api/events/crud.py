# services/server/project/api/events/crud.py


from project import db
from project.api.events.models import Event


def get_all_events():
    return Event.query.all()

def get_all_events_by_user_id(search_id):
    return Event.query.filter_by(user_id=search_id).all()


def get_event_by_id(event_id):
    return Event.query.filter_by(id=event_id).first()


def add_event(description, points, user_id):
    event = Event(description=description, points=points, user_id=user_id)
    db.session.add(event)
    db.session.commit()
    return event


def update_event(event, description, points):
    event.description = description
    event.points = points
    db.session.commit()
    return event


def delete_event(event):
    db.session.delete(event)
    db.session.commit()
    return event
