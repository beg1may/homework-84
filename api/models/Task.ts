import mongoose, {Types} from "mongoose";
import User from "./User";

const TaskSchema = new mongoose.Schema({
    user: {
        type: [mongoose.Schema.Types.ObjectId, 'User not found'],
        ref: "User",
        required: true,
        validate: {
            validator: async (value: Types.ObjectId) => {
                const user = await User.findById(value);
                return !!user;
            },
            message: 'User not found'
        }
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    status: {
        type: String,
        enum: ['new', 'in_progress', 'complete'],
        required: true,
    }
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;