
import {
  EventBusConnection,
  EventType,
  EventData,
  Card,
  OrderConfirmed
} from "./events.js";

import EmailOrderDatabase from "./db.js";
import EmailConnection from "./email.js";

const db: EmailOrderDatabase = new EmailOrderDatabase();
await db.connect();

const email: EmailConnection = new EmailConnection();

const event_bus: EventBusConnection = new EventBusConnection("email-order");

const event_types: EventType[] = [
  EventType.ORDER_CONFIRMED
];

await event_bus.listen(event_types, async function(event_type: EventType, event_data: EventData) {
  if (event_type === EventType.ORDER_CONFIRMED) {
    const order_confirmed: OrderConfirmed = event_data as OrderConfirmed;
    const { user_id, full_name, email_address, order_status, seats, card_info } = order_confirmed;
    const { card_number, billing_address, expiration_date, cvv } = card_info as Card;
    await db.create_log(order_confirmed);
    const subject: string = "Your ticket order has been confirmed!";
    const seats_string: string = seats?.map(seat => `(Row: ${seat.row}, Column: ${seat.column})`).join(", ") as string;
    const card_number_last_four: string = card_number.substring(card_number.length - 4);
    const body: string = `Hi ${full_name}!\n\nYou have successfully bought tickets to the concert! Here's your order information:\n\nUser ID: ${user_id}\nSeats purchased: ${seats_string}\nCredit card: XXXX-XXXX-XXXX-${card_number_last_four}`;
    email.send(email_address, subject, body);
  }
});
