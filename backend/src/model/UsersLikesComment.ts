import mongoose, { Model, Schema } from "mongoose";


export interface IUsersLikesComment extends Document {
    username: string;
};

export const UsersLikesCommentSchema: Schema<IUsersLikesComment> = new mongoose.Schema({
    username: { type: String }
});

export const UsersLikesComment: Model<IUsersLikesComment> = mongoose.model<IUsersLikesComment>('UsersLikesComment', UsersLikesCommentSchema);