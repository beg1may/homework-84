import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('users');
    } catch (e) {
        console.error(e);
    }

    await User.create(
        {
            username: 'Jane',
            password: '12345',
            token: crypto.randomUUID(),
        },
        {
            username: 'Alex',
            password: '12345',
            token: crypto.randomUUID(),
        }
    )

    await db.close();
}

run().catch(console.error);