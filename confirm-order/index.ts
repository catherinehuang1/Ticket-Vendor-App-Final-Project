
import express, { Request, Response } from "express";
import logger from "morgan";
import cors from "cors";

import {
  EventBusConnection,
  EventType,
  EventData,
  UserConfirmed,
  SeatsSelected,
  CardDenied,
  CardAccepted,
  TimerExpired,
  CardCreated,
  OrderConfirmed,
} from "./events.js";

import ConfirmOrderDatabase from "./db.js";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

const db: ConfirmOrderDatabase = new ConfirmOrderDatabase();
await db.connect();

const event_bus: EventBusConnection = new EventBusConnection("confirm-order");

const event_types: EventType[] = [
  EventType.USER_CONFIRMED,
  EventType.SEATS_SELECTED,
  EventType.CARD_DENIED,
  EventType.CARD_ACCEPTED,
  EventType.TIMER_EXPIRED,
  EventType.CARD_CREATED
];

await event_bus.listen(event_types, async function(event_type: EventType, event_data: EventData) {
  if (event_type === EventType.USER_CONFIRMED) {
    const user_confirmed: UserConfirmed = event_data as UserConfirmed;
    const { user_id, full_name, email_address } = user_confirmed;
    await db.create_order(user_id, full_name, email_address);
  } else if (event_type === EventType.SEATS_SELECTED) {
    const seats_selected: SeatsSelected = event_data as SeatsSelected;
    const { user_id, seats } = seats_selected;
    await db.add_seats_to_order(user_id, seats);
  } else if (event_type === EventType.CARD_DENIED) {
    const card_denied: CardDenied = event_data as CardDenied;
    const { user_id } = card_denied;
    await db.update_order_status(user_id, "denied");
  } else if (event_type === EventType.CARD_ACCEPTED) {
    const card_accepted: CardAccepted = event_data as CardAccepted;
    const { user_id } = card_accepted;
    await db.update_order_status(user_id, "accepted");
    const order = await db.find_order(user_id);
    if (order !== null) {
      await event_bus.emit(EventType.ORDER_CONFIRMED, order as OrderConfirmed);
    }
  } else if (event_type === EventType.TIMER_EXPIRED) {
    const timer_expired: TimerExpired = event_data as TimerExpired;
    const { user_id } = event_data;
    await db.update_order_status(user_id, "timed_out");
  } else if (event_type === EventType.CARD_CREATED) {
    const card_created: CardCreated = event_data as CardCreated;
    const { user_id, card_number, billing_address, expiration_date, cvv } = card_created;
    await db.add_card_to_order(user_id, card_number, billing_address, expiration_date, cvv);
  }
});

app.get("/api/v1/orders/confirm/:user_id", async function(req: Request, res: Response) {
  const { user_id } = req.params;
  if (user_id !== undefined && typeof(user_id) === "string") {
    const order = await db.find_order(user_id);
    if (order !== null) {
      res.status(200).json(order);
    } else {
      res.status(400).json({"error": "Bad request, user_id isn't valid."});
    }
  } else {
    res.status(400).json({"error": "Bad request, body ill-formed."});
  }
});

app.listen(4004, function() {
    console.log("Confirm order service listening on 4004.");
});