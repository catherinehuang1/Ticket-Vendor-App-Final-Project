## Starting the website using Docker Compose

To start the website using Docker Compose, run the following command:

    docker compose up

## Using the Postman collections for testing and debugging your services

There are two Postman collections of requests in this directory you can import into Postman:

- girliezz_endpoints.postman_collection.json
- girliezz_events.postman_collection.json

The events collection has a request for every API endpoint in the project.

The events collection makes requests to the debug services's /events/emit-event endpoint. This requires you to spin up the debug service to use it. This endpoint takes in the event type and data in the body of the request, and sends them to the event bus. This is good for testing your services and to see if their functionality when listening to events is correct.

## Connecting to a MongoDB container using MongoDB Compass

MongoDB Compass is a nice GUI application for MongoDB which allows you to view and modify your databases by hand, which is useful for debugging.

Here is the link to download MongoDB Compass: https://www.mongodb.com/products/compass

Let's say I'm working on the "timers" microservice, and I want to inspect it's database, "timers-db", using MongoDB Compass.

To do so, I'd first look at the "docker-compose.yml" file to find the publicly exposed port for the database.

Here is the listing for "timers-db" in "docker-compose.yml":

    seats-db:
        build: seats-db
        ports:
          - "50004:27017"

On that last line, you can see that the publicly exposed port is 50004. Each service's database has it's own unique publicly exposed port in the form of 5000X

So, the URI for accessing this MongoDB server from your local machine is: "mongodb://localhost:50004"

When you start MongoDB Compass, it will ask for a URI to start a new connection. If you enter in the URI above with the proper port, then press connect, you will be able to inspect your database using the MongoDB Compass GUI.

## Starting the website using Kubernetes
In terminal type : "sh deploy.sh"