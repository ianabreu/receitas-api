"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
const AuthUserService = {
    execute: async ({ email, password }) => {
        const user = await prisma_1.default.user.findFirst({
            where: {
                email,
            },
        });
        if (!user)
            throw new Error("user/password incorrect");
        const passwordMatch = await (0, bcryptjs_1.compare)(password, user.password);
        if (!passwordMatch)
            throw new Error("user/password incorrect");
        const token = (0, jsonwebtoken_1.sign)({
            name: user.name,
            email: user.email,
        }, process.env.SECRET_JWT, {
            subject: user.id,
            expiresIn: "30d",
        });
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: token,
        };
    },
};
exports.AuthUserService = AuthUserService;
