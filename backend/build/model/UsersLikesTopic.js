"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersLikesTopic = exports.UsersLikesTopicSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
exports.UsersLikesTopicSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true }
});
exports.UsersLikesTopic = mongoose_1.default.model('UsersLikesTopic', exports.UsersLikesTopicSchema);
