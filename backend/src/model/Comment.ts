import mongoose, { Model, Schema } from "mongoose";
import { IUsersLikesComment, UsersLikesCommentSchema } from "./UsersLikesComment";

export interface IComment extends Document {
    author: string;
    comment: string;
    timestamp: string;
    usersLikesComment: IUsersLikesComment[];
}

export const CommentSchema: Schema<IComment> = new mongoose.Schema({
    author: { type: String, required: true },
    comment: { type: String, required: true },
    timestamp: { type: String, required: true },
    usersLikesComment: [UsersLikesCommentSchema]
});

export const Comment: Model<IComment> = mongoose.model<IComment>('Comments', CommentSchema);