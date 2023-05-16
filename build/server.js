"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var product_handle_1 = __importDefault(require("./handlers/product.handle"));
var users_1 = __importDefault(require("./handlers/users"));
var app = (0, express_1.default)();
// @ts-ignore
var address = 'http://localhost:3000';
app.use(body_parser_1.default.json());
(0, product_handle_1.default)(app);
(0, users_1.default)(app);
app.listen(3000, function () {
    console.log("App listening on ".concat(address));
});
