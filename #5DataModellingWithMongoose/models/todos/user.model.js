import mongoose, { Mongoose } from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: [true, "Please Provide Password"]
    }
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);