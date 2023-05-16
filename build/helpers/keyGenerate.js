"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var key1 = crypto_1.default.randomBytes(32).toString('hex');
var key2 = crypto_1.default.randomBytes(32).toString('hex');
console.table({ key1: key1, key2: key2 });
