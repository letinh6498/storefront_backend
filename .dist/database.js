"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var pg_1 = require("pg");
dotenv_1.default.config();
var _a = process.env, POSTGRES_HOST = _a.POSTGRES_HOST, POSTGRES_USER = _a.POSTGRES_USER, POSTGRES_PASS = _a.POSTGRES_PASS, POSTGRES_DB = _a.POSTGRES_DB, POSTGRES_DB_DEV = _a.POSTGRES_DB_DEV, ENV = _a.ENV;
var client = new pg_1.Pool({
    host: POSTGRES_HOST,
    database: ENV === 'dev' ? POSTGRES_DB_DEV : POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASS,
});
exports.default = client;
