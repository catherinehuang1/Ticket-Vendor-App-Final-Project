import { Db, MongoClient, Collection } from "mongodb";
import { EventData } from "./events.js";

interface Log {
    timestamp: number,
    confirm_status: "accepted" | "denied",
    card: Card
}


// will this cause problems from the event.ts EventData?
interface Card {
    user_id: string,
    card_number: string,
    billing_address: string,
    expiration_date: string,
    cvv: string
}


class ConfirmCardDatabase {

    client: MongoClient;
    database!: Db;

    logs_collection!: Collection<Log>;

    constructor() {
        const uri = "mongodb://confirm-card-db:27017";
        this.client = new MongoClient(uri);
    }

    async connect(): Promise<void> {
        await this.client.connect();
        this.database = await this.client.db("confirm-card");
        this.logs_collection = await this.database.collection<Log>("logs");
    }

    async log_card(confirm_status: "accepted" | "denied", card: Card) {
        const timestamp: number = Date.now();
        await this.logs_collection.insertOne({
            timestamp,
            confirm_status,
            card
        });
    }
}

export default ConfirmCardDatabase;