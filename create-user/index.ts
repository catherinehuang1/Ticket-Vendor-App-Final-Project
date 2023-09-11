import express, {Express, Request, Response} from "express";
import logger from "morgan";
import cors from "cors";
import { randomBytes } from 'crypto';

import {UserConfirmed, EventType, EventData, EventBusConnection} from "./events.js";
import CreateUserDatabase from "./db.js"; 

const app:Express = express();

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

const db: CreateUserDatabase = new CreateUserDatabase();
await db.connect();

const event_bus: EventBusConnection = new EventBusConnection("create-user");

const event_types: EventType[] = [
    EventType.USER_CONFIRMED
];

await event_bus.listen(event_types, async (event_type:EventType, event_data:EventData) => {
    if (event_type === EventType.USER_CONFIRMED) {
        const user_confirmed: UserConfirmed = event_data as UserConfirmed;
        const {user_id, full_name, email_address} = user_confirmed;
        await db.update_user_confirmed(user_id,true);
    } 
});

app.post("/api/v1/users/", async (req: Request, res: Response) => {
    console.log(req.body)
    const {full_name,email_address} = req.body
    try{
        
        if(full_name === undefined || full_name === "" || email_address === undefined || email_address === "" || full_name.length > 64 || email_address.length > 64){
            res.status(400).json({
                "error": "Bad request, body ill-formed."
            }); 
        }
        else{
            let user = {
                full_name:full_name,email_address:email_address
            }
            const randomUserID = () => randomBytes(6).toString('hex');
            const id:string = randomUserID();
            let userWithID:UserConfirmed = {...user} as UserConfirmed;
            userWithID["user_id"] = id;
            // console.log(userWithID);
            
            await event_bus.emit(EventType.USER_CREATED, userWithID);
            await db.create_user(userWithID.user_id,userWithID.full_name,userWithID.email_address);
            
            res.status(201).send(req.body);
        }
    }
    catch (err:any) {
        res.status(500).send(JSON.stringify(err.message));
    }
  });

app.listen(4000, () => {
    console.log('Create User service listening on 4000.');
});