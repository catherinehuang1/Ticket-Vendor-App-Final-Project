
import { MongoClient, Db, Collection } from "mongodb";

import { OrderConfirmed } from "./events.js"

interface Log {
    timestamp: number,
    event_data: OrderConfirmed
}

class EmailOrderDatabase {

    client: MongoClient;
    database: Db;

    logs_collection: Collection<Log>;

    constructor() {
        const uri: string = "mongodb://email-order-db:27017";
        this.client = new MongoClient(uri);
    }
    
    async connect(): Promise<void> {
        await this.client.connect();
        this.database = await this.client.db("email-order");
        this.logs_collection = await this.database.collection<Log>("logs");
    }

    async create_log(event_data: OrderConfirmed): Promise<void> {
        const current_time: number = Date.now();
        await this.logs_collection.insertOne({
            timestamp: current_time,
            event_data
        });
    }
}

export default EmailOrderDatabase;