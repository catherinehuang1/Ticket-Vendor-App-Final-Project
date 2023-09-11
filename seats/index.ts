import express, { Request, Response} from "express";
import logger from "morgan";
import cors from "cors";

import {
    EventBusConnection,
    EventType,
    UserConfirmed,
    CardAccepted,
    CardDenied,
    TimerExpired

} from "./events.js";

import SeatsDatabase from "./db.js";

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

const db: SeatsDatabase = new SeatsDatabase();
await db.connect();

const event_bus: EventBusConnection = new EventBusConnection("seats");

const event_types = [
    EventType.USER_CONFIRMED,
    EventType.CARD_ACCEPTED,
    EventType.CARD_DENIED,
    EventType.TIMER_EXPIRED
];

await event_bus.listen(event_types, async (event_type:string, event_data:any) => {
    if (event_type === EventType.USER_CONFIRMED) {
        const { user_id, full_name, email_address } = event_data as UserConfirmed;
        await db.insert_user(user_id);
    } else if (event_type === EventType.CARD_ACCEPTED){
        const { user_id } = event_data as CardAccepted;
        await db.update_seats(user_id, "sold");
    } else if (event_type === EventType.CARD_DENIED) {
        const { user_id } = event_data as CardDenied;
        await db.update_seats(user_id, "open");
    } else if (event_type === EventType.TIMER_EXPIRED) {
        const { user_id } = event_data as TimerExpired;
        await db.update_seats(user_id, "open");
    }
});


app.get("/api/v1/seats/:user_id", async (req: Request, res: Response) => {
    const { user_id } = req.params;
    if (user_id !== undefined && typeof(user_id) === "string") {
        if (await db.find_user(user_id) === null) {
            res.status(400).json({ "error" : "Bad request, either user, seats, row, or column undefined."})
            return;
        }
        const seats = await db.get_seats();
        if (seats !== null) {
            res.status(200).json(seats);
        } else {
            res.status(500).json({
                "error": "Bad request, seats don't exist."
            });
        }
    } else {
        res.status(500).json({
            "error": "Bad request, request data is incomplete, or user ID isn't valid."
        });
    }
});


app.post("/api/v1/seats/", async (req: Request, res: Response) => {
    const { user_id, seats } = req.body;
    try {
        if( user_id === undefined || seats === undefined ) {
            res.status(400).json({ "error" : "Bad request, either user, seats, row, or column undefined."})
        }
        else {
            if (await db.find_user(user_id) === null) {
                res.status(400).json({ "error" : "Bad request, either user, seats, row, or column undefined."})
                return;
            }
            const selection = { user_id, seats }

            for(let seat of seats) {
                if( await db.check_seat(seat.row, seat.column) !== "open"){
                    res.status(400).json({ "error" : "One or more seats already selected."});
                    return;
                }
            }
            
            await event_bus.emit(EventType.SEATS_SELECTED, selection);
            
            for(let seat of seats) {
                await db.claim_seat(user_id, seat.row, seat.column);
            }

            res.status(200).send(req.body);
        }
    }
    catch (err:any) {
        res.status(500).send(JSON.stringify(err.message));
    }
});

app.listen(4002, function() {
    console.log("Seats Selected service listening on 4002.");
});