"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = exports.CommentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const UsersLikesComment_1 = require("./UsersLikesComment");
exports.CommentSchema = new mongoose_1.default.Schema({
    author: { type: String, required: true },
    comment: { type: String, required: true },
    timestamp: { type: String, required: true },
    usersLikesComment: [UsersLikesComment_1.UsersLikesCommentSchema]
});
exports.Comment = mongoose_1.default.model('Comments', exports.CommentSchema);
