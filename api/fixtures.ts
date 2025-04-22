import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import Task from "./models/Task";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('users');
        await db.dropCollection('tasks');
    } catch (e) {
        console.error(e);
    }

    const [userJane, userAlex] = await User.create(
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
    );

    await Task.create(
        {
            user: userJane,
            title: 'Homework',
            description: 'Do your homework',
            status: 'complete',
        },
        {
            user: userAlex,
            title: 'Homework',
            description: 'Do your homework',
            status: 'complete',
        }
    )

    await db.close();
}

run().catch(console.error);