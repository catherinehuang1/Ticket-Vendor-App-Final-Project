import { MongoClient, Db, Collection } from "mongodb";
import {UserCreated} from './events.js';

interface Log {
    timestamp: number,
    event_data: UserCreated
}

class EmailUserDatabase {

    client:MongoClient;
    database: Db;

    logs_collection: Collection<Log>;

    constructor() {
        const uri:string = "mongodb://email-user-id-db:27017";
        this.client = new MongoClient(uri);
    }
    
    async connect(): Promise<void> {
        await this.client.connect();
        this.database = await this.client.db("email-user-id");
        this.logs_collection = await this.database.collection<Log>("logs");
    }

    async create_log(event_data: UserCreated): Promise<void> {
        const current_time:number = Date.now();
        await this.logs_collection.insertOne({
            timestamp: current_time,
            event_data
        });
    }
}

export default EmailUserDatabase;