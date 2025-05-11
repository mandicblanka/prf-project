import { UsersLikesComment } from "./UsersLikesComment";

export interface Comment {
    _id: string;
    author: string;
    comment: string;
    usersLikesComment: UsersLikesComment[];
    timestamp: Date;
}