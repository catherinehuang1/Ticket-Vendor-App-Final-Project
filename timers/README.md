
## Timers service

Author: Seth Franklin (GitHub ID: SethFranklin)

This is the timers service. It handles all of the timers for users to enter in their credit card information within a specified time period. If a timer runs out of time, it will emit a TimerExpired event.

This service communicates with other services via the event bus, by listening to and recieving events. It listens to the SeatsSelected, CardAccepted, and CardDenied events, and emits the TimerExpired event.

This service has no API endpoints, and exclusively communicates with the event bus.

## How to run this service

If you want to run the service, you can do it on your machine using npm. First run this to install the dependencies:

    npm install

Then run this to start the service:

    npm start

Alternatively, you can use docker compose to run this service and all of the services it depends on using:

    docker-compose up timers