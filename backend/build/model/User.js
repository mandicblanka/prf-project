"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.UserSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    name: { type: String, required: false },
    address: { type: String, required: false },
    nickname: { type: String, required: false },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true }
});
const SALT_FACTOR = 10;
exports.UserSchema.pre('save', function (next) {
    const user = this;
    bcrypt_1.default.genSalt(SALT_FACTOR, (error, salt) => {
        if (error) {
            return next(error);
        }
        bcrypt_1.default.hash(user.password, salt, (err, hashedPassword) => {
            if (err) {
                return next(err);
            }
            user.password = hashedPassword;
            next();
        });
    });
});
exports.UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    const user = this;
    bcrypt_1.default.compare(candidatePassword, user.password, (error, isMatch) => {
        if (!isMatch) {
            callback(new Error('Password does not match'), false);
        }
        else
            callback(null, isMatch);
    });
};
exports.User = mongoose_1.default.model('User', exports.UserSchema);
