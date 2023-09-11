
import { Consumer, Kafka, logLevel, Producer, EachMessagePayload } from "kafkajs";

enum EventType {
    USER_CREATED = "UserCreated",
    USER_CONFIRMED = "UserConfirmed",
    SEATS_SELECTED = "SeatsSelected",
    TIMER_EXPIRED = "TimerExpired",
    CARD_CREATED = "CardCreated",
    CARD_ACCEPTED = "CardAccepted",
    CARD_DENIED = "CardDenied",
    ORDER_CONFIRMED = "OrderConfirmed"
}

interface UserCreated {
    user_id: string,
    full_name: string,
    email_address: string
}

interface UserConfirmed {
    user_id: string,
    full_name: string,
    email_address: string
}

interface Seat {
    row: number,
    column: number
}

interface SeatsSelected {
    user_id: string,
    seats: Seat[]
}

interface TimerExpired {
    user_id: string
}

interface CardCreated {
    user_id: string,
    card_number: string,
    billing_address: string,
    expiration_date: string,
    cvv: string
}

interface CardAccepted {
    user_id: string
}

interface CardDenied {
    user_id: string
}

interface Card {
    card_number: string,
    billing_address: string,
    expiration_date: string,
    cvv: string
}

interface OrderConfirmed {
    user_id: string,
    full_name: string,
    email_address: string,
    order_status: string,
    seats: Seat[] | null,
    card_info: Card | null
}

type EventData = UserCreated | UserConfirmed | SeatsSelected | TimerExpired | CardCreated | CardAccepted | CardDenied | OrderConfirmed;

class EventBusConnection {

    kafka: Kafka;
    consumer?: Consumer;
    producer?: Producer;
    client_name: string;

    RECONNECT_PERIOD: number;

    constructor(client_name: string) {
        this.kafka = new Kafka({
            clientId: client_name,
            brokers: ["event-bus:9092"],
            logLevel: logLevel.NOTHING
        });
        this.consumer = undefined;
        this.producer = undefined;
        this.client_name = client_name;

        this.RECONNECT_PERIOD = 1000; // time to retry reconnecting in milliseconds
    }

    async listen(event_types: EventType[], event_handler: (event_type: EventType, event_data: EventData) => void) {
        const context: this = this;
        context.consumer = context.kafka.consumer({ groupId: this.client_name });
        await context.consumer.connect();
        const subscribeInterval: NodeJS.Timer = setInterval(async function() {
            try {
              await context?.consumer?.subscribe({ topics: event_types, fromBeginning: true });
              console.log("Currently listening to the event bus.");
              clearInterval(subscribeInterval);
              await context?.consumer?.run({
                eachMessage: async function(consumer_message: EachMessagePayload) {
                    const { topic, partition, message } = consumer_message;
                    await event_handler(topic as EventType, JSON.parse(message.value!.toString()) as EventData);
                }
              });
            } catch (err) {
                // Just ignore errors
            }
          }, context.RECONNECT_PERIOD);
    }

    async emit(event_type: EventType, event_data: EventData) {
        const context: this = this;
        if (context.producer === undefined) {
            context.producer = context.kafka.producer();
            await context.producer.connect();
        }
        try {
            await context.producer.send({
                topic: event_type,
                messages: [{
                    value: JSON.stringify(event_data)
                }]
            });
        } catch (err) {
            setTimeout(async function() {
                await context.emit(event_type, event_data);
            }, context.RECONNECT_PERIOD);
        }
    }
}

export {
    EventBusConnection,
    EventType,
    UserCreated,
    UserConfirmed,
    Seat,
    SeatsSelected,
    TimerExpired,
    CardCreated,
    CardAccepted,
    CardDenied,
    Card,
    OrderConfirmed,
    EventData
};