# services/users/manage.py


import sys

from flask.cli import FlaskGroup

from project import create_app, db
from project.api.users.models import User


app = create_app()
cli = FlaskGroup(create_app=create_app)


@cli.command("recreate_db")
def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()


@cli.command("seed_db")
def seed_db():
    db.session.add(User(username="Wes Bailey", email="jwb4@clemson.edu", password="jwb4"))
    db.session.add(User(username="Shelton Shaw", email="sshaw5@clemson.edu", password="sshaw"))
    db.session.add(User(username="Sean Borbely", email="sborbel@clemson.edu", password="sborbel"))
    db.session.commit()


if __name__ == "__main__":
    cli()
