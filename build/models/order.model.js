"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
var database_1 = __importDefault(require("../database"));
var lodash_1 = __importDefault(require("lodash"));
var OrderModel = /** @class */ (function () {
    function OrderModel() {
    }
    OrderModel.prototype.createOrder = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, resData, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        console.log('userID:model:::', userId);
                        sql = "\n        INSERT INTO orders (user_id, current_status, created_at)\n        SELECT $1, 'active', NOW()\n        WHERE NOT EXISTS (\n          SELECT id FROM orders WHERE user_id = $1 AND current_status = 'active'\n        )\n        RETURNING *;\n      ";
                        return [4 /*yield*/, conn.query(sql, [userId])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        if (result.rows.length === 0) {
                            throw new Error('An active order already exists for this user.');
                        }
                        resData = lodash_1.default.pick(result.rows[0], [
                            'id',
                            'user_id',
                            'current_status',
                            'created_at',
                        ]);
                        return [2 /*return*/, resData];
                    case 3:
                        err_1 = _a.sent();
                        throw new Error("Failed to create order: ".concat(err_1));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrderModel.prototype.updateStatus = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, checkActiveQuery, checkActiveQueryRes, orderId, sql, result, resData, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        checkActiveQuery = 'SELECT id FROM orders WHERE user_id = $1 AND current_status = $2;';
                        return [4 /*yield*/, conn.query(checkActiveQuery, [
                                userId,
                                'active',
                            ])];
                    case 2:
                        checkActiveQueryRes = _a.sent();
                        if (!checkActiveQueryRes.rows[0]) {
                            conn.release();
                            throw new Error("There are no active orders for user ".concat(userId));
                        }
                        orderId = checkActiveQueryRes.rows[0].id;
                        sql = "\n        UPDATE orders \n        SET current_status = $1 \n        WHERE id = $2 \n        RETURNING *;\n      ";
                        return [4 /*yield*/, conn.query(sql, ['complete', orderId])];
                    case 3:
                        result = _a.sent();
                        conn.release();
                        resData = lodash_1.default.pick(result.rows[0], [
                            'id',
                            'user_id',
                            'current_status',
                            'created_at',
                        ]);
                        return [2 /*return*/, resData];
                    case 4:
                        err_2 = _a.sent();
                        throw new Error("Failed to update order status: ".concat(err_2));
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    OrderModel.prototype.getActiveOrder = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, resData, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT * FROM orders WHERE user_id = $1 AND current_status = $2';
                        return [4 /*yield*/, conn.query(sql, [userId, 'active'])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        if (result.rows.length === 0) {
                            throw new Error("No active order found for user ".concat(userId));
                        }
                        resData = lodash_1.default.pick(result.rows[0], [
                            'id',
                            'user_id',
                            'current_status',
                            'created_at',
                        ]);
                        return [2 /*return*/, resData];
                    case 3:
                        err_3 = _a.sent();
                        throw new Error("Failed to retrieve active order: ".concat(err_3));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrderModel.prototype.getCompletedOrders = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, orderList, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT * FROM orders WHERE user_id = $1 AND current_status = $2';
                        return [4 /*yield*/, conn.query(sql, [userId, 'complete'])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        orderList = result.rows.map(function (order) { return ({
                            id: order.id,
                            user_id: order.user_id,
                            current_status: order.current_status,
                            created_at: order.created_at,
                        }); });
                        return [2 /*return*/, orderList];
                    case 3:
                        err_4 = _a.sent();
                        throw new Error("Failed to retrieve completed orders: ".concat(err_4));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrderModel.prototype.addProductToOrder = function (userId, productId, quantity) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var conn, orderQuery, orderResult, orderId, checkProductQuery, checkProductResult, updateProductQuery, updateResult, resData, addProductQuery, insertResult, resData, err_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 13, , 14]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _b.sent();
                        return [4 /*yield*/, conn.query('BEGIN')];
                    case 2:
                        _b.sent();
                        orderQuery = "SELECT id FROM orders WHERE user_id = $1 AND current_status = 'active' FOR UPDATE;";
                        return [4 /*yield*/, conn.query(orderQuery, [userId])];
                    case 3:
                        orderResult = _b.sent();
                        orderId = (_a = orderResult.rows[0]) === null || _a === void 0 ? void 0 : _a.id;
                        if (!!orderId) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.query('ROLLBACK')];
                    case 4:
                        _b.sent();
                        conn.release();
                        console.error("There are no active orders for user ".concat(userId));
                        return [2 /*return*/, undefined];
                    case 5:
                        checkProductQuery = 'SELECT * FROM order_details WHERE order_id = $1 AND product_id = $2;';
                        return [4 /*yield*/, conn.query(checkProductQuery, [
                                orderId,
                                productId,
                            ])];
                    case 6:
                        checkProductResult = _b.sent();
                        if (!(checkProductResult.rows.length > 0)) return [3 /*break*/, 9];
                        updateProductQuery = 'UPDATE order_details SET quantity = $1 WHERE order_id = $2 AND product_id = $3 RETURNING *;';
                        return [4 /*yield*/, conn.query(updateProductQuery, [
                                quantity,
                                orderId,
                                productId,
                            ])];
                    case 7:
                        updateResult = _b.sent();
                        return [4 /*yield*/, conn.query('COMMIT')];
                    case 8:
                        _b.sent();
                        conn.release();
                        resData = lodash_1.default.pick(updateResult.rows[0], [
                            'id',
                            'product_id',
                            'quantity',
                            'order_id',
                        ]);
                        return [2 /*return*/, resData];
                    case 9:
                        addProductQuery = 'INSERT INTO order_details (product_id, quantity, order_id) VALUES ($1, $2, $3) RETURNING *;';
                        return [4 /*yield*/, conn.query(addProductQuery, [
                                productId,
                                quantity,
                                orderId,
                            ])];
                    case 10:
                        insertResult = _b.sent();
                        return [4 /*yield*/, conn.query('COMMIT')];
                    case 11:
                        _b.sent();
                        conn.release();
                        resData = lodash_1.default.pick(insertResult.rows[0], [
                            'id',
                            'product_id',
                            'quantity',
                            'order_id',
                        ]);
                        return [2 /*return*/, resData];
                    case 12: return [3 /*break*/, 14];
                    case 13:
                        err_5 = _b.sent();
                        throw new Error("Cannot add product ".concat(productId, " to order: ").concat(err_5));
                    case 14: return [2 /*return*/];
                }
            });
        });
    };
    OrderModel.prototype.removeProductFromOrder = function (userId, productId) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var conn, orderQuery, orderResult, orderId, deleteProductQuery, result, resData, err_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _b.sent();
                        return [4 /*yield*/, conn.query('BEGIN')];
                    case 2:
                        _b.sent();
                        orderQuery = "SELECT id FROM orders WHERE user_id = $1 AND current_status = 'active' FOR UPDATE;";
                        return [4 /*yield*/, conn.query(orderQuery, [userId])];
                    case 3:
                        orderResult = _b.sent();
                        orderId = (_a = orderResult.rows[0]) === null || _a === void 0 ? void 0 : _a.id;
                        if (!!orderId) return [3 /*break*/, 5];
                        return [4 /*yield*/, conn.query('ROLLBACK')];
                    case 4:
                        _b.sent();
                        conn.release();
                        console.error("There are no active orders for user ".concat(userId));
                        return [2 /*return*/, undefined];
                    case 5:
                        deleteProductQuery = 'DELETE FROM order_details WHERE order_id = $1 AND product_id = $2 RETURNING *;';
                        return [4 /*yield*/, conn.query(deleteProductQuery, [orderId, productId])];
                    case 6:
                        result = _b.sent();
                        return [4 /*yield*/, conn.query('COMMIT')];
                    case 7:
                        _b.sent();
                        conn.release();
                        resData = lodash_1.default.pick(result.rows[0], [
                            'id',
                            'product_id',
                            'quantity',
                            'order_id',
                        ]);
                        return [2 /*return*/, resData];
                    case 8:
                        err_6 = _b.sent();
                        throw new Error("Could not delete product ".concat(productId, " from order: ").concat(err_6));
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    return OrderModel;
}());
exports.OrderModel = OrderModel;
