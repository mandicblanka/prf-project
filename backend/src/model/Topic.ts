import mongoose, { Model, Schema } from "mongoose";
import { CommentSchema, IComment } from "./Comment";
import { IUsersLikesTopic, UsersLikesTopicSchema } from "./UsersLikesTopic";

interface ITopic extends Document {
    author: string;
    title: string;
    timestamp: string;
    comments: IComment[];
    usersLikesTopic: IUsersLikesTopic[];
}

const TopicSchema: Schema<ITopic> = new mongoose.Schema({
    author: { type: String, required: true },
    title: { type: String, required: true },
    timestamp: { type: String, required: true },
    comments: [CommentSchema],
    usersLikesTopic: [UsersLikesTopicSchema]
});

export const Topic: Model<ITopic> = mongoose.model<ITopic>('Topics', TopicSchema);