"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Comment_1 = require("./Comment");
const UsersLikesTopic_1 = require("./UsersLikesTopic");
const TopicSchema = new mongoose_1.default.Schema({
    author: { type: String, required: true },
    title: { type: String, required: true },
    timestamp: { type: String, required: true },
    comments: [Comment_1.CommentSchema],
    usersLikesTopic: [UsersLikesTopic_1.UsersLikesTopicSchema]
});
exports.Topic = mongoose_1.default.model('Topics', TopicSchema);
