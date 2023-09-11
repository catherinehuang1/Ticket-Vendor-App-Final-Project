import express, {Express, Request, Response} from "express";
import logger from "morgan";
import cors from "cors";

import ConfirmUserIdDatabase from "./db.js"; 
import {UserConfirmed, UserCreated, EventType, EventData, EventBusConnection} from './events.js';

const app:Express = express();

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

const db: ConfirmUserIdDatabase = new ConfirmUserIdDatabase();
await db.connect();

const event_bus: EventBusConnection = new EventBusConnection("confirm-user-id");

const event_types: EventType[] = [
    EventType.USER_CREATED
];

await event_bus.listen(event_types, async function(event_type: EventType, event_data:EventData) {
    if (event_type === EventType.USER_CREATED) {
        const confirm_user_id:UserCreated = event_data as UserCreated;
        const { user_id, full_name, email_address } = confirm_user_id;
        await db.create_user(user_id, full_name, email_address);
    }
});

type CreateUserDB = {
    confirmed:boolean
}

type CUDB = CreateUserDB & UserConfirmed;

app.post("/api/v1/users/confirm", async function(req:Request, res:Response) {
    const { user_id } = req.body;
    // console.log(user_id)
    try{
        if (user_id !== undefined && typeof(user_id) === "string") {
            const user = await db.find_user(user_id);
            if(user != null){
                await db.update_user_confirmed(user_id,true);
                const user_emit:UserConfirmed = {
                    user_id: user.user_id,
                    full_name: user.full_name,
                    email_address: user.email_address
                };
                await event_bus.emit(EventType.USER_CONFIRMED, user_emit);
                res.status(201).send({user_id});
            }else{
                res.status(400).json({"error": "Bad request, user_id isn't valid."});
            }
            
        }
        else{
            res.status(400).json({"error": "Bad request, body ill-formed."});
        }
    }
    catch(err:any){
        res.status(500).send(JSON.stringify(err.message));
    }

});

app.listen(4001, () => {
    console.log("Confirm User Id service listening on 4001.");
});