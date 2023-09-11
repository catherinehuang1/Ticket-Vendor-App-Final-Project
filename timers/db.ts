
import { MongoClient, Db, Collection, Filter } from "mongodb";

interface Timer {
    user_id: string,
    expiration_timestamp: number
}

class TimersDatabase {

    client: MongoClient;
    database: Db;

    timers_collection: Collection<Timer>;

    constructor() {
        const uri: string = "mongodb://timers-db:27017";
        this.client = new MongoClient(uri);
    }
    
    async connect(): Promise<void> {
        await this.client.connect();
        this.database = await this.client.db("timers");
        this.timers_collection = await this.database.collection<Timer>("timers");
    }

    async create_timer(user_id: string, timer_duration: number): Promise<void> {
        const current_time: number = Date.now();
        await this.timers_collection.insertOne({
            user_id,
            expiration_timestamp: current_time + timer_duration
        });
    }

    async delete_timer(user_id: string): Promise<void> {
        await this.timers_collection.deleteOne({
            user_id
        });
    }

    async expire_timers(): Promise<Timer[]> {
        const current_time: number = Date.now();
        const expired_filter: Filter<Timer> = { expiration_timestamp: { $lte: current_time } };
        const expired_timers: Timer[] = await this.timers_collection.find(expired_filter).toArray();
        await this.timers_collection.deleteMany(expired_filter);
        return expired_timers;
    }
}

export default TimersDatabase;