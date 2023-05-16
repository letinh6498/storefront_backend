"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.UserModel = void 0;
var database_1 = __importDefault(require("../database"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var dotenv_1 = __importDefault(require("dotenv"));
var jwt = __importStar(require("jsonwebtoken"));
dotenv_1.default.config();
var PEPPER = process.env.PEPPER;
var TOKEN_SECRET = process.env.TOKEN_SECRET;
var SALTROUNDS = 10;
var UserModel = /** @class */ (function () {
    function UserModel() {
        var _this = this;
        this.refreshToken = function (oldRefreshToken) { return __awaiter(_this, void 0, void 0, function () {
            var decoded, userId, newAccessToken, newRefreshToken;
            return __generator(this, function (_a) {
                try {
                    decoded = jwt.verify(oldRefreshToken, TOKEN_SECRET);
                    userId = decoded.userId;
                    newAccessToken = jwt.sign({ userId: userId }, TOKEN_SECRET, {
                        expiresIn: '15m',
                    });
                    newRefreshToken = jwt.sign({ userId: userId }, TOKEN_SECRET, {
                        expiresIn: '7d',
                    });
                    return [2 /*return*/, { newAccessToken: newAccessToken, newRefreshToken: newRefreshToken }];
                }
                catch (error) {
                    throw new Error('Invalid refresh token');
                }
                return [2 /*return*/];
            });
        }); };
    }
    UserModel.prototype.createUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var query, conn, salt, passwordHash, values, rows, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        query = "INSERT INTO users (username, email, password)\n                        SELECT $1, $2, $3\n                        WHERE NOT EXISTS (\n                            SELECT username FROM users WHERE username = ($4)\n                        ) RETURNING *";
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        salt = bcrypt_1.default.genSaltSync(SALTROUNDS);
                        passwordHash = bcrypt_1.default.hashSync(user.password + PEPPER, salt);
                        values = [user.username, user.email, passwordHash, user.username];
                        return [4 /*yield*/, conn.query(query, values)];
                    case 2:
                        rows = (_a.sent()).rows;
                        conn.release();
                        return [2 /*return*/, rows[0]];
                    case 3:
                        error_1 = _a.sent();
                        throw new Error("Could not add new user ".concat(user.username, ". Error: ").concat(error_1));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserModel.prototype.getAllUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, query, result, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        query = 'SELECT * FROM users';
                        return [4 /*yield*/, conn.query(query)];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows];
                    case 3:
                        error_2 = _a.sent();
                        throw new Error("Could not get Users. Error: ".concat(error_2));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserModel.prototype.getUserById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, conn, result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        query = 'SELECT * FROM users WHERE id = $1';
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(query, [id])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows[0]];
                    case 3:
                        error_3 = _a.sent();
                        throw new Error("Could not find User ".concat(id, ". Error: ").concat(error_3));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserModel.prototype.updateUser = function (user) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var query, values, conn, rows, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        query = 'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *';
                        values = [user.username, user.email, user.password, (_a = user.id) !== null && _a !== void 0 ? _a : 1];
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _b.sent();
                        return [4 /*yield*/, conn.query(query, values)];
                    case 2:
                        rows = (_b.sent()).rows;
                        conn.release();
                        return [2 /*return*/, rows[0]];
                    case 3:
                        error_4 = _b.sent();
                        throw new Error("Could not alter user ".concat(user.username, ". Error: ").concat(error_4));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserModel.prototype.deleteUser = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query, conn, result, rows, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        query = 'DELETE FROM users WHERE id = $1';
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(query, [id])];
                    case 2:
                        result = _a.sent();
                        rows = result.rows[0];
                        conn.release();
                        return [2 /*return*/, rows];
                    case 3:
                        error_5 = _a.sent();
                        throw new Error("Could not delete user ".concat(id, ". Error: ").concat(error_5));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserModel.prototype.authenticate = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = 'SELECT * FROM users WHERE username=($1)';
                        return [4 /*yield*/, conn.query(sql, [username])];
                    case 2:
                        result = _a.sent();
                        if (result.rows.length) {
                            user = result.rows[0];
                            if (bcrypt_1.default.compareSync(password + PEPPER, user.password_digest)) {
                                return [2 /*return*/, user];
                            }
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    UserModel.prototype.login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var conn, result, user, isPasswordCorrect, accessToken, refreshToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query('SELECT * FROM users WHERE username = $1', [
                                username,
                            ])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        if (result.rows.length === 0) {
                            throw new Error('User not found');
                        }
                        user = result.rows[0];
                        return [4 /*yield*/, bcrypt_1.default.compareSync(password + PEPPER, user.password_digest)];
                    case 3:
                        isPasswordCorrect = _a.sent();
                        if (!isPasswordCorrect) {
                            throw new Error('Incorrect password');
                        }
                        accessToken = jwt.sign({ userId: user.id }, TOKEN_SECRET, {
                            expiresIn: '15m',
                        });
                        refreshToken = jwt.sign({ userId: user.id }, TOKEN_SECRET, {
                            expiresIn: '7d',
                        });
                        return [2 /*return*/, { accessToken: accessToken, refreshToken: refreshToken }];
                }
            });
        });
    };
    return UserModel;
}());
exports.UserModel = UserModel;