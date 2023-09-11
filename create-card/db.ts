import { MongoClient, Db, Collection } from "mongodb";

interface Card {
    user_id: string,
    card_number: string,
    billing_address: string,
    expiration_date: string,
    cvv: string
}

interface User {
    user_id: string
}

class CreateCardDatabase {

    client: MongoClient;
    database!: Db;

    cards_collection!: Collection<Card>;
    valid_user_ids_collection!: Collection<User>;

    constructor() {
        const uri: string = "mongodb://create-card-db:27017";
        this.client = new MongoClient(uri);
    }

    async connect(): Promise<void> {
        await this.client.connect();
        this.database = await this.client.db("create-card");
        this.cards_collection = await this.database.collection<Card>("cards");
        this.valid_user_ids_collection = await this.database.collection<User>("valid_user_ids");
    }

    async find_user(user_id: string): Promise<User> {
        return await this.valid_user_ids_collection.findOne({ user_id }) as User;
    }

    async insert_user(user_id: string): Promise<void> {
        await this.valid_user_ids_collection.insertOne({ user_id });
    }

    async create_card(card: Card): Promise<void> {
        await this.cards_collection.insertOne(card);
    }
}

export default CreateCardDatabase;