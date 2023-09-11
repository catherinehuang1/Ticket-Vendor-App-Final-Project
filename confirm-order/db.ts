
import { MongoClient, Db, Collection } from "mongodb";

interface Seat {
    row: number,
    column: number
}

interface Card {
    card_number: string,
    billing_address: string,
    expiration_date: string,
    cvv: string
}

interface Order {
    user_id: string,
    full_name: string,
    email_address: string,
    order_status: string,
    seats: Seat[] | null,
    card_info: Card | null
}

class ConfirmOrderDatabase {

    client: MongoClient;
    database: Db;

    orders_collection: Collection<Order>;

    constructor() {
        const uri: string = "mongodb://confirm-order-db:27017";
        this.client = new MongoClient(uri);
    }
    
    async connect(): Promise<void> {
        await this.client.connect();
        this.database = await this.client.db("confirm-order");
        this.orders_collection = await this.database.collection<Order>("orders");
    }

    async find_order(user_id: string): Promise<Order> {
        return await this.orders_collection.findOne({ user_id }) as Order;
    }

    async create_order(user_id: string, full_name: string, email_address: string): Promise<void> {
        await this.orders_collection.insertOne({
            user_id,
            full_name,
            email_address,
            order_status: "processing_card",
            seats: null,
            card_info: null
        });
    }

    async add_seats_to_order(user_id: string, seats: Seat[]): Promise<void> {
        await this.orders_collection.updateOne({ user_id }, { $set: { seats } });
    }

    async add_card_to_order(user_id: string, card_number: string, billing_address: string, expiration_date: string, cvv: string): Promise<void> {
        await this.orders_collection.updateOne({ user_id }, { $set: { card_info: { card_number, billing_address, expiration_date, cvv } } });
    }

    async update_order_status(user_id: string, order_status: string): Promise<void> {
        await this.orders_collection.updateOne({ user_id }, { $set: { order_status } });
    }
}

export default ConfirmOrderDatabase;