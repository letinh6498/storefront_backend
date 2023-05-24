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
Object.defineProperty(exports, "__esModule", { value: true });
var user_model_1 = require("../models/user.model");
var verifyAuthToken_1 = require("../middleware/verifyAuthToken");
var userInstance = new user_model_1.UserModel();
var getAllUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, userInstance.getAllUsers()];
            case 1:
                users = _a.sent();
                res.json(users);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                res.status(500).json({ err: err_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getUserById = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, userInstance.getUserById(+id)];
            case 2:
                user = _a.sent();
                if (!user) {
                    res.status(404).json({ err: 'User not found.' });
                }
                else {
                    res.json(user);
                }
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                res.status(500).json({ err: err_2.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var createUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, email, password, first_name, last_name, user, newUser, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, email = _a.email, password = _a.password, first_name = _a.first_name, last_name = _a.last_name;
                user = { username: username, email: email, password: password, first_name: first_name, last_name: last_name };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, userInstance.createUser(user)];
            case 2:
                newUser = _b.sent();
                res.json(newUser);
                return [3 /*break*/, 4];
            case 3:
                err_3 = _b.sent();
                res.status(500).json({ err: err_3.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var deleteUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, userInstance.deleteUser(+id)];
            case 2:
                user = _a.sent();
                if (!user) {
                    res.status(404).json({ err: 'User not found.' });
                }
                else {
                    res.json(user);
                }
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                res.status(500).json({ err: err_4.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var updateUser = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, username, email, password, first_name, last_name, user, updatedUser, err_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.params.id;
                _a = req.body, username = _a.username, email = _a.email, password = _a.password, first_name = _a.first_name, last_name = _a.last_name;
                user = { username: username, email: email, password: password, first_name: first_name, last_name: last_name };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, userInstance.updateUser(+id, user)];
            case 2:
                updatedUser = _b.sent();
                if (!updatedUser) {
                    res.status(404).json({ err: 'User not found.' });
                }
                else {
                    res.json(updatedUser);
                }
                return [3 /*break*/, 4];
            case 3:
                err_5 = _b.sent();
                res.status(500).json({ err: err_5.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var authenticate = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, result, err_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, userInstance.authenticate(username, password)];
            case 2:
                result = _b.sent();
                res.json(result);
                return [3 /*break*/, 4];
            case 3:
                err_6 = _b.sent();
                res.status(500).json({ err: err_6.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, result, err_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, userInstance.login(username, password)];
            case 2:
                result = _b.sent();
                res.json(result);
                return [3 /*break*/, 4];
            case 3:
                err_7 = _b.sent();
                res.status(500).json({ err: err_7.message });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var users_routes = function (app) {
    app.get('/users', verifyAuthToken_1.verifyAuthToken, getAllUser);
    app.post('/users', createUser);
    app.get('/users/:id', verifyAuthToken_1.verifyAuthToken, getUserById);
    app.put('/users/:id', verifyAuthToken_1.verifyAuthToken, updateUser);
    app.delete('/users/:id', verifyAuthToken_1.verifyAuthToken, deleteUser);
    app.post('/authenticate', authenticate);
    app.post('/login', login);
};
exports.default = users_routes;
