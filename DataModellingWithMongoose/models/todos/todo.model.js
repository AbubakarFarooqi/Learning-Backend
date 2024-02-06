import mongoose, { Mongoose, mongo } from "mongoose";

const todoSchema = new mongoose.Schema({
    complete: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    subTodos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubTodo"
        }
    ]
}, { timestamps: true })

export const Todo = mongoose.model("Todo", todoSchema);
