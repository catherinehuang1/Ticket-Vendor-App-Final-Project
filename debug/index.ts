
import express, { Request, Response } from "express";

import {
  EventBusConnection,
  EventType,
  EventData,
} from "./events.js";

const app = express();

app.use(express.json());

const event_bus: EventBusConnection = new EventBusConnection("debug");

const event_types: EventType[] = [
  EventType.USER_CREATED,
  EventType.USER_CONFIRMED,
  EventType.SEATS_SELECTED,
  EventType.TIMER_EXPIRED,
  EventType.CARD_CREATED,
  EventType.CARD_ACCEPTED,
  EventType.CARD_DENIED,
  EventType.ORDER_CONFIRMED
];

await event_bus.listen(event_types, async function(event_type: EventType, event_data: EventData) {
  console.log(`${event_type}:`);
  console.log(event_data);
});

app.post("/debug/emit-event", async function(req: Request, res: Response) {
  const { event_type, event_data } = req.body;
  if (event_type !== undefined
      && typeof(event_type) === "string"
      && event_data !== undefined
      && typeof(event_data) === "object") {
    if (event_types.includes(event_type as EventType)) {
      await event_bus.emit(event_type as EventType, event_data);
      res.status(200).json({"success": "The event was emitted."});
    } else {
      res.status(400).json({"error": "event_type wasn't valid.", "valid_event_types": event_types})
    }
  } else {
    res.status(400).json({"error": "Bad request, body ill-formed."});
  }
});

app.listen(4005, function() {
  console.log("Debug service listening on 4005.");
});