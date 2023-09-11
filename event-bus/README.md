
## Kafka event bus service

Authors:
- Seth Franklin (GitHub ID: SethFranklin)
- Catherine Huang (GitHub ID: catherinehuang1)
- Simona Zilberberg (GitHub ID: simonaz)

This is the event bus service, which runs a single Apache Kafka broker. Kafka is an event store that lets clients connect to it, and produce and/or consume messages. Kafka stores all of the events it recieves, which basically creates a log of events. This is helpful because if a service goes down and misses some events, once it boots up again and reconnects to Kafka, Kafka will automatically send it all of the events it missed.

The other services in this project use the Kafka client "kafkajs" to connect to this event bus. All of the logic for them to connect to the event bus is contained in the "events.ts" file. "events.ts" exports a class called EventBusConnection, which abstracts out connecting to the event bus, and makes it easy for us to listen to and emit events while developing our services. The "events.ts" file also has datatypes for the different events and an enum called EventType for the different kinds of events.

In the Kafka, every different event type has it's own Kafka topic. This means that our services have to specify which event types they want to listen to.

Kafka doesn't have any HTTP API endpoints. For connections, it uses it's own TCP protocol. Services can connect to it at this URI: event-bus:9092

## How to run this service

You can run this service using docker compose using the docker-compose.yaml file and this command:

    docker-compose up event-bus