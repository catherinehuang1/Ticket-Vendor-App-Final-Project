import { MongoClient, Db, Collection } from "mongodb";

// SHOULDN'T SEATS INCLUDE STATUS AND USER ID? 
// and if so, add them to confirm order db

interface Seat {
    row: number,
    column: number,
    status: "open" | "processing" | "sold",
    user_id: string | undefined
}

interface SelectedSeat {
    row: number,
    column: number
}

interface User {
    user_id: string
}

class SeatsDatabase {

    client: MongoClient;
    database!: Db;

    seats_collection!: Collection<Seat>
    valid_user_ids_collection!: Collection<User>

    constructor() {
        const uri: string = "mongodb://seats-db:27017";
        this.client = new MongoClient(uri);
    }

    async connect(): Promise<void> {
        await this.client.connect();
        this.database = await this.client.db("seats-selected");

        this.seats_collection = await this.database.collection<Seat>("seats");
        this.valid_user_ids_collection = await this.database.collection<User>("valid_user_ids");

        const NUM_ROWS: number = 8;
        const NUM_COLUMNS: number = 8;

        const seats_array: Array<Seat> = [];

        if (await this.seats_collection.count() === 0) {
            for (let row = 0; row < NUM_ROWS; row++) {
                for (let column = 0; column < NUM_COLUMNS; column++) {
                    seats_array.push({
                        row,
                        column,
                        status: "open",
                        user_id: undefined
                    });
                }
            }
            await this.seats_collection.insertMany(seats_array);
        }
    }

    async find_user(user_id: string): Promise<User> {
        return await this.valid_user_ids_collection.findOne({ user_id }) as User;
    }

    async insert_user(user_id: string): Promise<void> {
        await this.valid_user_ids_collection.insertOne({ user_id });
    }

    async update_seats( user_id: string, status: "open" | "processing" | "sold"): Promise<void> {
        if(status === "open") {
            await this.seats_collection.updateMany({ user_id }, { $set: { status, user_id: undefined} }); 
        } else {
            await this.seats_collection.updateMany({ user_id }, { $set: { status } });
        }
    }

    async claim_seat(user_id: string, row: number, column: number) {
        await this.seats_collection.updateOne({ row, column}, { $set: { user_id, status: "processing" } });
    }

    async get_seats(): Promise<Array<Object>> {
        return await this.seats_collection.find().project({ row: 1, column: 1, status: 1}).toArray();
    }

    async check_seat(row: number, column: number): Promise<string> {
        const seat = await this.seats_collection.findOne({row, column}) as Seat;
        return seat.status;
    }
    
}

export default SeatsDatabase