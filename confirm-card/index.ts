
import express from "express";
import logger from "morgan";
import cors from "cors";
import { Request, Response } from "express";

import Luhn from "luhn-js";

import {
    EventBusConnection,
    EventType,
    EventData,
    CardCreated
} from "./events.js";

import ConfirmOrderDatabase from "./db.js";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

const db: ConfirmOrderDatabase = new ConfirmOrderDatabase();
await db.connect();

const event_bus = new EventBusConnection("confirm-card");

const event_types = [
  EventType.CARD_CREATED
];

function isNumeric(s: string) {
    const i: number = +s;
  return !isNaN(i - parseFloat(s));
}

await event_bus.listen(event_types, async function(event_type: EventType, event_data: EventData) {
  if(event_type === EventType.CARD_CREATED ) {
    const { user_id, card_number, billing_address, expiration_date, cvv } = event_data as CardCreated;
   
    const card = {
        user_id, 
        card_number, 
        billing_address, 
        expiration_date, 
        cvv
    }

    // checks if card info is valid
    if(isNumeric(card_number) && Luhn.isValid(card_number)) {
      
        // checks if expiration date format is: MM/YY

        const firstTwo = parseInt(expiration_date.substring(0,2))
        const slash = expiration_date[2]
        const lastTwo = expiration_date.substring(3,5)

        if( 
            expiration_date.length === 5 && 
            firstTwo > 0 && firstTwo < 13 &&
            isNumeric(lastTwo) &&
            slash === "/"
          ) {
            if(cvv.length == 3 && isNumeric(cvv)) {
              // card successfully authorized
              await event_bus.emit(EventType.CARD_ACCEPTED, {user_id});
              const confirm_status = "accepted"
              await db.log_card(confirm_status, card)
              return
            } else {
              await event_bus.emit(EventType.CARD_DENIED, {user_id});
              const confirm_status = "denied"
              await db.log_card(confirm_status, card)
              return
            }
          } else {
            await event_bus.emit(EventType.CARD_DENIED, {user_id});
            const confirm_status = "denied"
            await db.log_card(confirm_status, card)
            return
          }
    }
    else {
      await event_bus.emit(EventType.CARD_DENIED, {user_id});
      const confirm_status = "denied"
      await db.log_card(confirm_status, card)
      return
    }
  }
});





