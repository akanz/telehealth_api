import mongoose, { model, Schema } from "mongoose";

export interface IUser {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    date: Date;
}
const UserSchema = new Schema<IUser>({
    firstname: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    lastname: {
        type: String,
        required: true,
        min: 2,
        max: 50
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
    },
    password: {
        type: String,
        required: true,
        max: 2048,
        min: 6,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})
module.exports = model<IUser>('User', UserSchema)