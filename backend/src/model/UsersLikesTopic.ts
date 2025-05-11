import mongoose, { Model, Schema } from "mongoose";


export interface IUsersLikesTopic extends Document {
    username: string;
};

export const UsersLikesTopicSchema: Schema<IUsersLikesTopic> = new mongoose.Schema({
    username: { type: String, required: true }
});

export const UsersLikesTopic: Model<IUsersLikesTopic> = mongoose.model<IUsersLikesTopic>('UsersLikesTopic', UsersLikesTopicSchema);