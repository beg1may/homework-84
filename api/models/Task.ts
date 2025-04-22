import mongoose, {Types} from "mongoose";
import User from "./User";

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    user: {
        type: [Schema.Types.ObjectId, 'User not found'],
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
        required:  [true, 'Заголовок обьязательное поле'],
    },
    description: String,
    status: {
        type: String,
        enum: ['new', 'in_progress', 'complete'],
        required:  [true, 'Статус обьязательное поле'],
    }
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;