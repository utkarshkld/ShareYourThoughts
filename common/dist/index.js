"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePost = exports.createPostInput = exports.signinInput = exports.signupInput = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupInput = zod_1.default.object({
    name: zod_1.default.string().max(30),
    password: zod_1.default.string().min(6).max(20),
    email: zod_1.default.string()
});
exports.signinInput = zod_1.default.object({
    email: zod_1.default.string(),
    password: zod_1.default.string()
});
exports.createPostInput = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.string()
});
exports.updatePost = zod_1.default.object({
    title: zod_1.default.string().optional(),
    content: zod_1.default.string().optional()
});
