"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var TOKEN_SECRET = process.env.TOKEN_SECRET;
var verifyAuthToken = function (req, res, next) {
    try {
        var authorizationHeader = req.headers.authorization;
        var token = authorizationHeader.split(' ')[1];
        if (!token)
            return res
                .status(401)
                .send({ auth: false, message: 'No token provided.' });
        jsonwebtoken_1.default.verify(token, TOKEN_SECRET, function (err, decoded) {
            if (err)
                return res
                    .status(500)
                    .send({ auth: false, message: 'Failed to authenticate token.' });
            //req.userId = decoded.id;
            next();
        });
    }
    catch (error) {
        res.status(500).send({
            auth: false,
            message: 'An error occurred while authenticating the token.',
        });
    }
};
exports.verifyAuthToken = verifyAuthToken;
