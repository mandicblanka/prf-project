"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersLikesComment = exports.UsersLikesCommentSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
exports.UsersLikesCommentSchema = new mongoose_1.default.Schema({
    username: { type: String }
});
exports.UsersLikesComment = mongoose_1.default.model('UsersLikesComment', exports.UsersLikesCommentSchema);
