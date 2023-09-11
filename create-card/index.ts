import express from 'express';
import logger from 'morgan';
import cors from 'cors';
import { Request, Response } from 'express';

import {
    EventBusConnection,
    EventData,
    EventType,
    UserConfirmed,
} from "./events.js";

import CreateCardDatabase from "./db.js";

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(cors());

// event bus port: 4003

const db: CreateCardDatabase = new CreateCardDatabase();
await db.connect();

const event_bus: EventBusConnection = new EventBusConnection("create-card");

const event_types: EventType[] = [
    EventType.USER_CONFIRMED
]

/*
    Request Example:
        {
            "user_id": "d5b7ce",
            "card_number": "1234567890123456",
            "billing_address": "181 Presidents Drive, Amherst MA, 01003",
            "expiration_date": "01/01",
            "cvv": "123"
        }
*/

await event_bus.listen(event_types, async function(event_type: EventType, event_data: EventData) {
    if(event_type === EventType.USER_CONFIRMED) {
        const { user_id } = event_data as UserConfirmed;
        await db.insert_user(user_id);
    }
});

app.post("/api/v1/cards", async function(req: Request, res: Response) {
    const { user_id, card_number, billing_address, expiration_date, cvv } = req.body;
    if (user_id !== undefined && typeof(user_id) === "string") {
        const user = await db.find_user(user_id);
        if (user !== null) {
            const card = {
                user_id,
                card_number,
                billing_address,
                expiration_date,
                cvv
            }
            await db.create_card(card);
            await event_bus.emit(EventType.CARD_CREATED, card);
            res.status(201).json(card);

        } else {
            res.status(400).json({"error": "Bad request, user_id isn't valid."});
        } 
    } else {
        res.status(500).json({"error": "Bad request, body ill-formed."});
    } 
});

app.listen(4003, function() {
    console.log("Create card service listening on 4003.");
});