// import express, {Express} from "express";
import EmailUserDatabase from "./db.js";
import EmailConnection from "./email.js";
import {UserCreated,EventType,EventData,EventBusConnection} from './events.js';

const db:EmailUserDatabase = new EmailUserDatabase();
await db.connect();

const email:EmailConnection = new EmailConnection();

const event_bus:EventBusConnection = new EventBusConnection("email-user-id");

const event_types: EventType[] = [
  EventType.USER_CREATED
];

await event_bus.listen(event_types, async function(event_type: EventType, event_data: EventData) {
  if (event_type === EventType.USER_CREATED) {
    const user_created: UserCreated = event_data as UserCreated; 
    const {user_id, full_name, email_address} = user_created;
    await db.create_log(user_created);
    email.send(email_address, "CacheMoneyGirlies Concert Ticket", `Hi ${full_name}!\n\nHere is your UserID : ${user_id}  \n\nThanks!`);
  }
});