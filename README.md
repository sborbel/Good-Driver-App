# Introduction 
## Good (Truck) Driver Incentive Program

This program provides an easy to use application to help trucking companies encourage good driving through incentives. It is hosted on AWS at the URL:

Good Driver App - http://good-driver-alb-1469583345.us-east-1.elb.amazonaws.com/login

You can login to test using the following credentials:

| Type | User | Password|
|:-----|:----:|:--------:|
Driver Credentials | fred@bedrock.com | fred
Sponsor Credentials | sborbel@clemson.edu | sborbel
Admin Credentials | jwb4@clemson.edu  | jwb4

You can interact directly with the API by navigating to:

API - http://good-driver-alb-1469583345.us-east-1.elb.amazonaws.com/doc/

---

## Setup for Local Development

This project requires [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/). Please verify that these are installed and running correctly before proceeding.



### Clone the Repo
```
$ git clone https://F20-Team14-Borbely-Bailey-Shaw@dev.azure.com/F20-Team14-Borbely-Bailey-Shaw/F20-Team14-Borbely.Bailey.Shaw/_git/F20-Team14-Borbely.Bailey.Shaw
$ cd F20-Team14-Borbely.Bailey.Shaw
```
### Set the following environment variable

This defines the base URL for AJAX requests from the React app. 
 
```
$ export REACT_APP_USERS_SERVICE_URL=http://localhost:5001
```
**PRO TIP** - put this in your `.bashrc` file so you don't have to enter it every time you open a shell. It becomes a pain, and I promise that you'll forget.

If you do it this way, be sure to add double quotes around the value like this:
```
export REACT_APP_USERS_SERVICE_URL="http://localhost:5001"
```
## Important for testing this repo for CPSC4910

We have used an offline file to manage our confidential environment variables called `dev_env.env`. This file is not included in the DevOps repo, it is included in the zipped files that are included with the final project submission. You will need to copy this file into the project ROOT (same directory as `docker-compose.yaml`). Then you can proceed with the container build as described in the next step.


### Build the images
```
$ docker-compose build
```

### Run the containers
```
$ docker-compose up -d
```
Note - the `-d` flag runs a detached container, meaning that it gives no shell logging. During development you may want to omit this flag for more verbose feedback. 

---

### Sanity Check

Type the following command:
```
http://localhost:5001/ping
```
If everything is running correctly on the server you should see:
```
{
  "message": "pong!",
  "status": "success"
}
```
---
## Database
### Create and Seed the database (1-step update)
```
$ docker-compose exec server python manage.py reset_db
```
**NOTE - If you get a key constraint error after running this command, run it again and see if it works. If not, follow the `Container update procedures` listed below.**

The database uses a persistent volume, meaning that you only need to create the database and seed it with data once. The data will be preserved between container restarts. If you have added a bunch of data and want to reset, you can nuke the database with the `reset_db` command.


Want to access the *Postgres* database via psql?
```
$ docker-compose exec good-drivers-db psql -U postgres
```
Then, you can connect to the database and run SQL queries. For example:
```
# \c good_drivers_dev
# select * from users; //or another table
```

---
## Endpoints

### Application

This is the URL for the client side of the application, the *React* web application user interface:
```
http://localhost:3007
```

### Users

You can directly access the *Flask* backend users endpoint via the exposed endpoint:
```
http://localhost:5001/users
```

### Swagger UI

[Swagger UI](https://swagger.io/tools/swagger-ui/) is an open-source API documentation generator that allows developers to interact with the actual API and examine endpoints, signatures, and responses thorugh a convenient web interface. view The Swagger UI, navigate to the following URL. 

```
http://localhost:5001/doc/
```
---

# Other Commands

To stop the containers:
```
$ docker-compose stop
```
To bring down the containers:
```
$ docker-compose down
```
Want to force a build?
```
$ docker-compose build --no-cache
```
Remove images:
```
$ docker rmi $(docker images -q)
```

# Developing with Docker

The Docker containers offer a convenient way to create a consistent development environment so that all developers can have confidence that their work will run in the production environment.  

When you run the *docker-compose up* command, Docker references the *docker-compose.yml* file for a variety of instructions about how to build and run the containers. A couple of the commands are:
```
users:
    volumes:
      - './services/users:/usr/src/app'
```
and:
```
client:
    volumes:
      - './services/client:/usr/src/app'
```
These commands create *bindings* that connect the docker container with your local file system. This means that you can open the project in your code editor, make changes, and immediately see those changes updated into the running container.
If you navigate to the top-level directory in the project, `F20-Team14-Borbely.Bailey.Shaw`, and open your code editor you should be able to access any part of the code for development. 

## Client Development
The only folders that you will generally need to work in for client-side development are located at:
```
services
    client
        src
```
AND
```
services
    client
        src
            components
```

## Server-side Development
The only folder that you will generally need to work in for server-side development is located at:
```

services
    users
        project
           api

```


# Container update procedures

### Clear out the Existing Docker Artifacts

1. Stop all running containers
```
docker-compose down
```

2. Delete all containers using the following command:
```
docker rm -f $(docker ps -a -q)
```

3. Delete all volumes using the following command:
```
docker volume rm $(docker volume ls -q)
```

4. Rebuild the setup.
```
docker-compose build --no-cache 
```

5. Run the new setup.
```
docker-compose up
```

### Create and seed the database

```
$ docker-compose exec server python manage.py reset_db
```

# Developer References

## Docker
[How To Remove Docker Images, Containers, and Volumes](https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes)

---

## Postgresql

[Postgres Cheat Sheet](https://gist.github.com/Kartones/dd3ff5ec5ea238d4c546)

---

## Flask


[Flask-RESTX](https://flask-restx.readthedocs.io/en/latest/quickstart.html)


# eBay API Usage Documentation

## Helpful Links
[eBay Catalog API Overview](https://developer.ebay.com/api-docs/commerce/catalog/overview.html)
[eBay Developer Sandbox](https://developer.ebay.com/tools/sandbox)
[eBay Developer Login Page](https://developer.ebay.com/signin)

## eBay API
[All API Documents](https://developer.ebay.com/docs#Brs)

## eBay 'Browse' API

[search](https://developer.ebay.com/api-docs/buy/browse/resources/item_summary/methods/search) GET `/item_summary/search`
[getItem](https://developer.ebay.com/api-docs/buy/browse/resources/item/methods/getItem) GET `/item/{item_id}`
[addItem](https://developer.ebay.com/api-docs/buy/browse/resources/shopping_cart/methods/addItem) POST `/shopping_cart/add_item`

## eBay 'FINDING' API

There are two parts required in the `POST` data object when creating a call to the Finding API, `source` (string) and `keywords` (List):
```
{
  "source": "string",
  "keywords": [
    "string"
  ]
}
```
The `source` value must be one of the Vendors listed in the Source table of the database. I recommend that you create a dropdown list from a call to `GET /sources` which will return a list of all sources in the DB. 
Also, notice that `keywords` is a list of strings, even if there is only one item in the list. You can enter as many search elements as required, and spaces are accepted as long as they are enclosed in quotation marks as shown below: 

```
{
  "keywords": [
    "truck",
    "floor mat"
  ]
}
```

Each call will return a list of up to 100 items matching the keyword criteria. Here is a sample return object for one item from that call:

```
item: {
  'itemId': '202637310539',
  'title': 'Canon EOS Rebel T7 24.1MP Digital SLR Camera with EF-S 18-55 IS II Lens',
  'globalId': 'EBAY-US',
  'primaryCategory': {
    'categoryId': '31388',
    'categoryName': 'Digital Cameras'
  },
  'galleryURL': 'https://thumbs4.ebaystatic.com/m/m09-7Oxghw4Owumm5fmWMGA/140.jpg',
  'viewItemURL': 'https://www.ebay.com/itm/Canon-EOS-Rebel-T7-24-1MP-Digital-SLR-Camera-EF-S-18-55-II-Lens-/202637310539',
  'productId': {
    '_type': 'ReferenceID',
    'value': '4030072379'
  },
  'paymentMethod': 'PayPal',
  'autoPay': 'true',
  'postalCode': '112**',
  'location': 'Brooklyn,NY,USA',
  'country': 'US',
  'shippingInfo': {
    'shippingServiceCost': {
      '_currencyId': 'USD',
      'value': '0.0'
    },
    'shippingType': 'Free',
    'shipToLocations': 'Worldwide',
    'expeditedShipping': 'true',
    'oneDayShippingAvailable': 'true',
    'handlingTime': '1'
  },
  'sellingStatus': {
    'currentPrice': {
      '_currencyId': 'USD',
      'value': '372.99'
    },
    'convertedCurrentPrice': {
      '_currencyId': 'USD',
      'value': '372.99'
    },
    'sellingState': 'Active',
    'timeLeft': 'P8DT4H22M9S'
  },
  'listingInfo': {
    'bestOfferEnabled': 'false',
    'buyItNowAvailable': 'false',
    'startTime': datetime.datetime(2019, 3, 27, 20, 6, 40),
    'endTime': datetime.datetime(2020, 10, 27, 20, 6, 40),
    'listingType': 'FixedPrice',
    'gift': 'false',
    'watchCount': '180'
  },
  'returnsAccepted': 'true',
  'condition': {
    'conditionId': '1000',
    'conditionDisplayName': 'New'
  },
  'isMultiVariationListing': 'false',
  'discountPriceInfo': {
    'originalRetailPrice': {
      '_currencyId': 'USD',
      'value': '447.0'
    },
    'pricingTreatment': 'STP',
    'soldOnEbay': 'false',
    'soldOffEbay': 'false'
  },
  'topRatedListing': 'true'
}
```












