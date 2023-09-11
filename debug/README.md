
## Debug service

Author: Seth Franklin (GitHub ID: SethFranklin)

**NOTE:** This is not one of my 3 services I originally planned, and is meant to be extra. Please don't count this as one of my 3 services to grade. My services to be graded are: confirm-order, timers, and email-order.

This is the debug service. This was an extra service I decided to make while working on this project, to help in developing the other services. It listens to every event and prints them out in a log for the developer to work at. It also has an API endpoint where the developer can send in event data in the request body, so that the service can send them to the event bus. This lets the developer send events to a service their working on without depending on other services that emit them being already finished and working to test it.

This service communicates with other services via the event bus. It listens to every event. It's also able to emit every kind of event, depending on what the developer sends through it's endpoint

## How to run this service

If you want to run the service, you can do it on your machine using npm. First run this to install the dependencies:

    npm install

Then run this to start the service:

    npm start

Alternatively, you can use docker compose to run this service and all of the services it depends on using:

    docker-compose up debug