"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var product_handle_1 = __importDefault(require("./handlers/product.handle"));
var user_handle_1 = __importDefault(require("./handlers/user.handle"));
var order_handle_1 = __importDefault(require("./handlers/order.handle"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3000;
app.use(body_parser_1.default.json());
(0, product_handle_1.default)(app);
(0, user_handle_1.default)(app);
(0, order_handle_1.default)(app);
app.listen(PORT, function () {
    console.log("App listening on PORT:::".concat(PORT));
});
