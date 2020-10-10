# services/server/project/api/announcements/crud.py


from project import db
from project.api.announcements.models import Announcement


def get_all_announcements():
    return Announcement.query.all()

def get_all_announcements_by_sponsor_name(search_name):
    return Announcement.query.filter_by(sponsor_name=search_name).all()


def get_announcement_by_id(search_id):
    return Announcement.query.filter_by(id=search_id).first()


def add_announcement(content, sponsor_name):
    announcement = Announcement(content=content, sponsor_name=sponsor_name)
    db.session.add(announcement)
    db.session.commit()
    return announcement


def update_announcement(announcement, content):
    announcement.content = content
    db.session.commit()
    return announcement


def delete_announcement(announcement):
    db.session.delete(announcement)
    db.session.commit()
    return announcement
