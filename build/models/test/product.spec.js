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
var supertest_1 = __importDefault(require("supertest"));
var database_1 = __importDefault(require("../../database"));
var product_model_1 = require("../product.model");
var base_url = 'http://localhost:3000';
var productUrl = '/products/';
var request = (0, supertest_1.default)(base_url);
var productInstance = new product_model_1.ProductModel();
describe('Product model', function () {
    it('has an create method', function () {
        expect(productInstance.createProduct).toBeDefined();
    });
    it('has a get product by id method', function () {
        expect(productInstance.getProductById).toBeDefined();
    });
    it('has a get all products method', function () {
        expect(productInstance.getAllProducts).toBeDefined();
    });
    it('has an update method', function () {
        expect(productInstance.updateProduct).toBeDefined();
    });
    it('has an delete method', function () {
        expect(productInstance.deleteProduct).toBeDefined();
    });
});
describe('test handle', function () {
    var data = {
        name: 'Product test',
        description: 'description',
        price: 100000,
    };
    var dataPut = {
        name: 'Product updated',
        description: 'description update',
        price: 200000,
    };
    var temporaryProductId;
    var token;
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepareDB()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, request.post('/users').send({
                            username: 'usertest',
                            email: 'abc@gmail.com',
                            password: '123',
                            first_name: 'Tinh',
                            last_name: 'Le',
                        })];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, request
                            .post('/login')
                            .send({ username: res.body.username, password: '123' })];
                case 3:
                    response = _a.sent();
                    token = "bearer ".concat(response.body.accessToken);
                    return [2 /*return*/];
            }
        });
    }); });
    beforeEach(function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request
                        .post(productUrl)
                        .set('Authorization', token)
                        .send(data)];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(200);
                    temporaryProductId = response.body.id;
                    return [2 /*return*/];
            }
        });
    }); });
    it('should get all products', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request.get(productUrl).set('Authorization', token)];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(200);
                    expect(Array.isArray(response.body)).toBe(true);
                    expect(response.body.length).toBeGreaterThan(0);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should get a product by id', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request
                        .get("".concat(productUrl).concat(temporaryProductId))
                        .set('Authorization', token)];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(200);
                    expect(response.body.id).toBe(temporaryProductId);
                    expect(response.body.name).toBe(data.name);
                    expect(response.body.description).toBe(data.description);
                    expect(parseFloat(response.body.price)).toBe(data.price);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should update a product', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request
                        .put("".concat(productUrl).concat(temporaryProductId))
                        .set('Authorization', token)
                        .send(dataPut)];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(200);
                    expect(response.body.id).toBe(temporaryProductId);
                    expect(response.body.name).toBe(dataPut.name);
                    expect(response.body.description).toBe(dataPut.description);
                    expect(parseFloat(response.body.price)).toBe(dataPut.price);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should delete a product', function () { return __awaiter(void 0, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request
                        .delete("".concat(productUrl).concat(temporaryProductId))
                        .set('Authorization', token)];
                case 1:
                    response = _a.sent();
                    expect(response.statusCode).toBe(200);
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prepareDB()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
});
function prepareDB() {
    return __awaiter(this, void 0, void 0, function () {
        var conn, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, database_1.default.connect()];
                case 1:
                    conn = _a.sent();
                    return [4 /*yield*/, conn.query('DELETE FROM products')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, conn.query('DELETE FROM users')];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, conn.query('ALTER SEQUENCE users_id_seq RESTART WITH 1')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, conn.query('ALTER SEQUENCE products_id_seq RESTART WITH 1')];
                case 5:
                    _a.sent();
                    conn.release();
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
