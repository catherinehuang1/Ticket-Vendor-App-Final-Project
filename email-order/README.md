
## Email order service

Author: Seth Franklin (GitHub ID: SethFranklin)

This is the email-order service. Upon recieving an OrderConfirmed event, it will send the user an email with information about their order, and store information about the email in a log in it's database.

This service communicates with other services via the event bus by listening to events. It listens to the OrderConfirmed event.

This service has no API endpoints, and exclusively communicates with the event bus.

## How to run this service

If you want to run the service, you can do it on your machine using npm. First run this to install the dependencies:

    npm install

Then run this to start the service:

    npm start

Alternatively, you can use docker compose to run this service and all of the services it depends on using:

    docker-compose up email-order