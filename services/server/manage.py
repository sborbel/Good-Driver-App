# services/server/manage.py

import sys

from flask.cli import FlaskGroup

from project import create_app, db
from project.api.events.models import Event
from project.api.users.models import User
from project.api.users.models import Affiliation
from project.api.announcements.models import Announcement
from project.api.catalogs.models import Catalog
from project.api.catalogs.models import CatalogItem
from project.api.catalogs.models import Source
from project.api.orders.models import Order
from project.api.orders.models import OrderItem
from project.api.threads.models import Thread
from project.api.threads.models import Message


app = create_app()
cli = FlaskGroup(create_app=create_app)

def recreate_db():
    db.drop_all()
    db.create_all()
    db.session.commit()

def seed_users():
    db.session.add(User(username="Yellow Freight", email="info@yf.com", password="yellow", role="sponsor"))
    db.session.add(User(username="Great Big Freight", email="big@freight.com", password="big", role="sponsor"))
    db.session.add(User(username="Wes Bailey", email="jwb4@clemson.edu", password="jwb4", role="admin"))
    db.session.add(User(username="Shelton Shaw", email="sshaw5@clemson.edu", password="sshaw", role="sponsor_mgr"))
    db.session.add(User(username="Sean Borbely", email="sborbel@clemson.edu", password="sborbel", role="sponsor_mgr"))
    db.session.add(User(username="Fred Flintstone", email="fred@bedrock.com", password="fred", role="driver"))
    db.session.add(User(username="Barney Rubble", email="barney@bedrock.com", password="barney", role="driver"))
    db.session.add(User(username="George Jetson", email="g.jet@spacelysprockets.com", password="george", role="driver"))
    db.session.add(User(username="Boris Badenov", email="boris@bad.com", password="killmooseandsquirrel", role="driver"))
    # db.session.add(User(username="", email="", password="", role="", sponsor_name=""))
    db.session.commit()

def seed_affiliations():
    db.session.add(Affiliation(user_id=3, sponsor_name="", current_points=0, status="active"))
    db.session.add(Affiliation(user_id=4, sponsor_name="Yellow Freight", current_points=0, status="active"))
    db.session.add(Affiliation(user_id=5, sponsor_name="Great Big Freight", current_points=0, status="active"))
    db.session.add(Affiliation(user_id=6, sponsor_name="Yellow Freight", current_points="500", status="active"))
    db.session.add(Affiliation(user_id=6, sponsor_name="Great Big Freight", current_points="900", status="active"))
    db.session.add(Affiliation(user_id=7, sponsor_name="Yellow Freight", current_points="850", status="active"))
    db.session.add(Affiliation(user_id=8, sponsor_name="Great Big Freight", current_points="25", status="active"))
    db.session.add(Affiliation(user_id=9, sponsor_name="Great Big Freight", current_points="1500", status="active"))
    # db.session.add(Affiliation(user_id="", sponsor_name="", current_points="", status=""))
    db.session.commit()

def seed_events(): 
    db.session.add(Event(description="Safe driving award.", points=15, user_id=7))
    db.session.add(Event(description="Avoided hitting pedestrian.", points=25, user_id=8))
    # db.session.add(Event(description="", points=, user_id=))
    db.session.commit()

def seed_annc(): 
    db.session.add(Announcement(content="Try not to run over anything!", sponsor_name="Yellow Freight"))
    db.session.add(Announcement(content="Be careful out there.", sponsor_name="Great Big Freight"))
    # db.session.add(Announcement(content="", sponsor_id=))
    db.session.commit()

def seed_catalogs():
    db.session.add(Catalog(name = "Yellow Freight Awards", supplier = "ebay", sponsor_name="Yellow Freight"))
    db.session.add(Catalog(name = "Great Big Awards Catalog", supplier = "ebay", sponsor_name="Great Big Freight"))
    # db.session.add(Catalog(name = "", supplier = "", sponsor_name =))

    db.session.add(CatalogItem( name = "Carfka Train Horn for Trucks", 
                                description = "Extremely Loud Train Horn. High Performance: 2020 upgraded air compressor with larger coil, premium material, stronger air pressure makes it better and more clear warning to other drivers over their actions", 
                                image_url = "https://images-na.ssl-images-amazon.com/images/I/61US3UARYyL._AC_SL1450_.jpg", 
                                points_cost = 150, 
                                actual_cost = 29.99, 
                                catalog_id = 1))
    db.session.add(CatalogItem( name = "Portable Car Vacuum Cleaner", 
                                description = "CLEAN YOUR CAR LIKE A PRO – Save time and money and get professional results yourself every time STRONG SUCTION – The car vacuum's powerful 106w motor and strong metal turbine leave nothing behind", 
                                image_url = "https://images-na.ssl-images-amazon.com/images/I/71vki0gmO3L._AC_SL1500_.jpg", 
                                points_cost = 200, 
                                actual_cost = 34.99, 
                                catalog_id = 1))
    db.session.add(CatalogItem( name = "Heavy Duty Truck Air Seat Blow Gun Kit", 
                                description = "The heavy duty air seat blow Gun kit for trucks, utility vehicles, buses and more. Designed for vehicles with an air ride seat system; the nylon Hose extends up to 8 feet long. The air seat blow Gun kit is used to clean from the Cab to the Sleeper. The blow Gun kit Includes 2 interchangeable nozzle tips", 
                                image_url = "https://images-na.ssl-images-amazon.com/images/I/61NfcOgslzL._AC_SL1200_.jpg", 
                                points_cost = 100, 
                                actual_cost = 19.41, 
                                catalog_id = 2))
    db.session.add(CatalogItem( name = "Collapsible Multi-Compartment Storage Organizer", 
                                description = "After seeing perpetual clutter and chaos inside our own cars, we embarked on a mission to create products for making our vehicles look and feel new again. Through iteration and engineering, we're striving for the perfect designs and created an entire line of award-winning products to make your life easier.", 
                                image_url = "https://images-na.ssl-images-amazon.com/images/I/91xQV7uto6L._AC_SL1500_.jpg", 
                                points_cost = 250, 
                                actual_cost = 23.99, 
                                catalog_id = 2))
    # db.session.add(CatalogItem(name = "", description = "", image_url = "", points_cost = , actual_cost =, catalog_id =))
    db.session.commit()

def seed_orders():
    db.session.add(Order(status = "active", user_id = 6, sponsor_name="Yellow Freight"))
    db.session.add(Order(status = "active", user_id = 6, sponsor_name="Great Big Freight"))
    # db.session.add(Order(status = "", user_id =))

    db.session.add(OrderItem(order_id = 1, catalog_id = 1, catalog_item_id = 1, quantity = 1, actual_cost = 29.99, points_cost = 150))
    db.session.add(OrderItem(order_id = 1, catalog_id = 1, catalog_item_id = 2, quantity = 1, actual_cost = 34.99, points_cost = 200))
    db.session.add(OrderItem(order_id = 2, catalog_id = 1, catalog_item_id = 2, quantity = 1, actual_cost = 34.99, points_cost = 200))
    # db.session.add(OrderItem(order_id =, catalog_id =, catalog_item_id =, quantity =, actual_cost =, points_cost =))
    
    db.session.commit()

def seed_threads():
    db.session.add(Thread(status = "active", creator_id = 8))
    db.session.add(Thread(status = "active", creator_id = 5))
    db.session.add(Thread(status = "active", creator_id = 4))
    db.session.add(Thread(status = "active", creator_id = 4))
    # db.session.add(Thread(status = "", creator_id =))
    db.session.commit()

def seed_messages():
    db.session.add(Message(thread_id = 1, sender_id = 8 , recipient_id = 4, created_date = "2020-09-26T18:08:49", subject = "Time off request", content = "Can I have Friday off?"))
    db.session.add(Message(thread_id = 1, sender_id = 4, recipient_id = 8, created_date = "2020-09-26T18:09:05", subject = "RE:Time off request", content = "No. Get to work."))
    db.session.add(Message(thread_id = 2, sender_id = 5, recipient_id = 6, created_date = "2020-09-26T18:09:05", subject = "Flat tire, need assistance", content = "I ran over a nail."))
    db.session.add(Message(thread_id = 2, sender_id = 6, recipient_id = 5, created_date = "2020-09-26T18:09:05", subject = "RE:Flat tire", content = "OK, I'm sending a service truck."))
    db.session.add(Message(thread_id = 2, sender_id = 5, recipient_id = 6, created_date = "2020-09-26T18:09:05", subject = "RE:Flat tire", content = "Standing by."))
    db.session.add(Message(thread_id = 3, sender_id = 4, recipient_id = 8, created_date = "2020-09-26T18:09:05", subject = "Not happy about working on Friday", content = "I'm not happy."))
    db.session.add(Message(thread_id = 3, sender_id = 8 , recipient_id = 4, created_date = "2020-09-26T18:08:49", subject = "RE: Not happy", content = "Better start looking for a new job then."))
    # db.session.add(Message(thread_id =, sender_id =, recipient_id =, created_date = "", subject = "", content = ""))
    # db.session.add(Message(thread_id =, sender_id =, recipient_id =, created_date = "", subject = "", content = ""))
    db.session.commit()

def seed_source():
    db.session.add(Source(supplier = "ebay"))
    db.session.commit()


@cli.command("reset_db")
def seed_all():
    recreate_db()
    seed_users()
    seed_affiliations()
    seed_events()
    seed_annc()
    seed_catalogs()
    seed_orders()
    seed_threads()
    seed_messages()
    seed_source()



if __name__ == "__main__":
    cli()


