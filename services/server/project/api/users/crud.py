# services/server/project/api/users/crud.py


from project import db
from project.api.users.models import User


def get_all_users():
    return User.query.all()


def get_user_by_id(user_id):
    return User.query.filter_by(id=user_id).first()


def get_user_by_email(email):
    return User.query.filter_by(email=email).first()


def add_user(username, email, password, role, sponsor_name):
    user = User(username=username, email=email, password=password, role=role, sponsor_name=sponsor_name)
    db.session.add(user)
    db.session.commit()
    return user


def update_user(user, username, email, role, sponsor_name):
    user.username = username
    user.email = email
    user.role = role
    user.sponsor_name = sponsor_name
    db.session.commit()
    return user


def delete_user(user):
    db.session.delete(user)
    db.session.commit()
    return user
