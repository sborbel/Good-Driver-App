# services/server/project/api/users/crud.py


from project import db
from project.api.users.models import User
from project.api.users.models import Affiliation


def get_all_users():
    return User.query.all()


def get_users_by_sponsor_name(sponsor_name):
    return User.query.filter_by(sponsor_name=sponsor_name).all()


def get_user_by_id(user_id):
    return User.query.filter_by(id=user_id).first()


def get_user_by_email(email):
    return User.query.filter_by(email=email).first()


def add_user(username, email, password, role):
    user = User(username=username, email=email, password=password, role=role)
    db.session.add(user)
    db.session.commit()
    return user


def update_user(user, username, email, role, get_points_alert, get_order_alert, get_problem_alert):
    user.username = username
    user.email = email
    user.role = role
    user.get_points_alert = get_points_alert
    user.get_order_alert = get_order_alert
    user.get_problem_alert = get_problem_alert
    db.session.commit()
    return user


def update_user_password(user, new_password):
    user.password = new_password
    db.session.commit()
    return user

def update_failed_access_attempt(user, count, time):
    user.failed_attempts = count
    user.failed_attempt_timer = time
    db.session.commit()
    return user


def delete_user(user):
    db.session.delete(user)
    db.session.commit()
    return user


# Affiliation methods

def get_all_affiliations():
    return Affiliation.query.all()

def check_dupe_affiliation(user_id, sponsor_name):
    return Affiliation.query.filter_by(user_id=user_id, sponsor_name=sponsor_name).first()

def get_affiliation_by_id(id):
    return Affiliation.query.filter_by(id=id).first()

def get_all_affiliations_by_user(user_id):
    return Affiliation.query.filter_by(user_id=user_id).all()

def get_all_affiliations_by_sponsor(sponsor_name):
    return Affiliation.query.filter_by(sponsor_name=sponsor_name).all()

def add_affiliation(user_id, sponsor_name, current_points, status):
    affiliation = Affiliation(user_id=user_id, sponsor_name=sponsor_name, current_points=current_points, status=status)
    db.session.add(affiliation)
    db.session.commit()
    return affiliation

def update_affiliation(affiliation, user_id, sponsor_name, current_points, status):
    affiliation.user_id=user_id
    affiliation.sponsor_name=sponsor_name
    affiliation.current_points=current_points
    affiliation.status=status
    db.session.commit()
    return affiliation

def delete_affiliation(affiliation):
    db.session.delete(affiliation)
    db.session.commit()
    return affiliation