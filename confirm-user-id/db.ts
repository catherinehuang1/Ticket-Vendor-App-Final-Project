import { MongoClient, Db, Collection } from "mongodb";

interface User{
    user_id: string,
    full_name: string,
    email_address: string,
    confirmed : boolean
}

class ConfirmUserIdDatabase {

    client: MongoClient;
    database: Db;

    users_collection: Collection<User>;

    constructor() {
        const uri:string = "mongodb://confirm-user-id-db:27017";
        this.client = new MongoClient(uri);
    }

    async connect(): Promise<void>  {
        await this.client.connect();
        this.database = await this.client.db("confirm-user-id");
        this.users_collection = await this.database.collection("users");
    }

    async find_user(user_id:string): Promise<User>  {
        return await this.users_collection.findOne({ user_id }) as User;
    }

    async create_user(user_id:string, full_name:string, email_address:string): Promise<void>  {
        await this.users_collection.insertOne({
            user_id,
            full_name,
            email_address,
            confirmed: false
        });
    }

    async update_user_confirmed(user_id:string, user_confirmed:boolean): Promise<void>  {
        await this.users_collection.updateOne({ user_id }, { $set: { confirmed: user_confirmed} });
    }
}

export default ConfirmUserIdDatabase;