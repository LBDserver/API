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
        while (_) try {
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
exports.__esModule = true;
exports.updateGraph = exports.queryGraphSelect = exports.queryProjectSelect = exports.deleteGraph = exports.deleteResource = exports.getGraphMetadata = exports.deleteDocument = exports.deleteProject = exports.getDocumentMetadata = exports.getOneProject = exports.getDocument = exports.uploadGraph = exports.uploadDocument = exports.createProject = exports.getUserProjects = exports.login = exports.register = exports.logout = exports.getOpenProjects = void 0;
var axios_1 = require("axios");
var sparqlalgebrajs_1 = require("sparqlalgebrajs");
//////////////////// PROJECT FUNCTIONS ////////////////////
/**
 * Register as a user to the local LBDserver (backend defined in process.env.REACT_APP_BACKEND).
 * @param username
 * @param email
 * @param password
 */
function register(username, email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1["default"].post(process.env.REACT_APP_BACKEND + "/register", {
                            username: username,
                            password: password,
                            email: email
                        })];
                case 1:
                    response = _a.sent();
                    data = response.data;
                    return [2 /*return*/, data];
                case 2:
                    error_1 = _a.sent();
                    error_1.message = "Unable to register; " + error_1.message;
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.register = register;
/**
 * Login as an existing user to the LBDserver (backend defined in process.env.REACT_APP_BACKEND)
 * @param email
 * @param password
 */
function login(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1["default"].post(process.env.REACT_APP_BACKEND + "/login", {}, {
                            auth: {
                                username: email,
                                password: password
                            }
                        })];
                case 1:
                    response = _a.sent();
                    data = response.data;
                    return [2 /*return*/, data];
                case 2:
                    error_2 = _a.sent();
                    error_2.message = "Unable to login; " + error_2.message;
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.login = login;
/**
 * Log out on the LBDserver (backend defined in process.env.REACT_APP_BACKEND)
 * @param token
 */
function logout(token) {
    return __awaiter(this, void 0, void 0, function () {
        var config, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!token) return [3 /*break*/, 2];
                    config = {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    };
                    return [4 /*yield*/, axios_1["default"].post(process.env.REACT_APP_BACKEND + "/logout", null, config)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
                case 2: throw new Error("Token not found");
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    error_3.message = "Unable to log out; " + error_3.message;
                    throw error_3;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.logout = logout;
// PROJECT ROUTES
/**
 * Get all the documents accessible to unauthenticated users (public projects) on the local LBDserver (backend defined in process.env.REACT_APP_BACKEND)
 */
function getOpenProjects() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1["default"].get(process.env.REACT_APP_BACKEND + "/lbd/public")];
                case 1:
                    response = _a.sent();
                    data = response.data;
                    return [2 /*return*/, data];
                case 2:
                    error_4 = _a.sent();
                    error_4.message = "Unable to fetch open projects; " + error_4.message;
                    throw error_4;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getOpenProjects = getOpenProjects;
/**
 * Get all the projects associated with the currently authenticated user.
 * @param token
 */
function getUserProjects(token) {
    return __awaiter(this, void 0, void 0, function () {
        var config, response, data, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!token) return [3 /*break*/, 2];
                    config = {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    };
                    return [4 /*yield*/, axios_1["default"].get(process.env.REACT_APP_BACKEND + "/lbd", config)];
                case 1:
                    response = _a.sent();
                    data = response.data;
                    return [2 /*return*/, data];
                case 2: throw new Error("Token not found");
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_5 = _a.sent();
                    error_5.message = "Unable to fetch open projects; " + error_5.message;
                    throw error_5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.getUserProjects = getUserProjects;
/**
 * Create a new project on the local LBDserver
 * @param body
 * @param token
 */
function createProject(body, token) {
    return __awaiter(this, void 0, void 0, function () {
        var config, response, data, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!token) return [3 /*break*/, 2];
                    config = {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: "Bearer " + token
                        }
                    };
                    return [4 /*yield*/, axios_1["default"].post(process.env.REACT_APP_BACKEND + "/lbd", body, config)];
                case 1:
                    response = _a.sent();
                    data = response.data;
                    return [2 /*return*/, data];
                case 2: throw new Error("Token not found");
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_6 = _a.sent();
                    error_6.message = "Could not create new project; " + error_6.message;
                    throw error_6;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.createProject = createProject;
/**
 * Get a project by its URL or ID. If an ID is given, the URL is reconstructed via the backend URL defined in process.env.REACT_APP_BACKEND.
 * @param project
 * @param token
 */
function getOneProject(project, token) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, config, data, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    url = modifyProjectUrl(project);
                    response = void 0;
                    if (!token) return [3 /*break*/, 2];
                    config = {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    };
                    return [4 /*yield*/, axios_1["default"].get(url, config)];
                case 1:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, axios_1["default"].get(url)];
                case 3:
                    response = _a.sent();
                    _a.label = 4;
                case 4:
                    data = response.data;
                    console.log('data', data);
                    return [2 /*return*/, data];
                case 5:
                    error_7 = _a.sent();
                    error_7.message = "Unable to fetch open projects; " + error_7.message;
                    throw error_7;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.getOneProject = getOneProject;
/**
 * Delete a project by ID or URL. If an ID is provided; the URL is reconstructed based on the backend URL defined in process.env.REACT_APP_BACKEND.
 * @param project
 * @param token
 */
function deleteProject(project, token) {
    return __awaiter(this, void 0, void 0, function () {
        var url, config, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    url = modifyProjectUrl(project);
                    if (!token) return [3 /*break*/, 2];
                    config = {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    };
                    return [4 /*yield*/, axios_1["default"]["delete"](url, config)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, axios_1["default"]["delete"](url)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
                case 5:
                    error_8 = _a.sent();
                    error_8.message = "Unable to delete project; " + error_8.message;
                    throw error_8;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.deleteProject = deleteProject;
///////////////// RESOURCE FUNCTIONS //////////////////
/**
 * Delete a resource and its metadata graph.
 * @param url
 * @param token
 */
function deleteResource(url, token) {
    return __awaiter(this, void 0, void 0, function () {
        var response, config, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    url = modifyUrl(url);
                    response = void 0;
                    if (!token) return [3 /*break*/, 2];
                    config = {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    };
                    return [4 /*yield*/, axios_1["default"]["delete"](url, config)];
                case 1:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, axios_1["default"]["delete"](url)];
                case 3:
                    response = _a.sent();
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_9 = _a.sent();
                    error_9.message = "Unable to delete resource; " + error_9.message;
                    throw error_9;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.deleteResource = deleteResource;
/**
 * Upload a document to a defined project. Props include a "label", a "description" and a "resource", with the "resource" referring to the actual file to be uploaded. The "label" and "description" are used in the automatically created metadata file, which is equal to {fileurl}.meta.
 * @param props
 * @param project
 * @param token
 */
function uploadDocument(props, project, token) {
    return __awaiter(this, void 0, void 0, function () {
        var baseUrl, url, bodyFormData, myHeaders, config, response, data, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    baseUrl = modifyProjectUrl(project);
                    url = baseUrl + "/files";
                    bodyFormData = new FormData();
                    bodyFormData.append("resource", props.file);
                    bodyFormData.append("label", props.label);
                    bodyFormData.append("description", props.description);
                    myHeaders = new Headers();
                    if (token) {
                        myHeaders.append("Authorization", "Bearer " + token);
                    }
                    config = {
                        method: "POST",
                        redirect: "follow",
                        body: bodyFormData,
                        headers: myHeaders
                    };
                    return [4 /*yield*/, fetch(url, config)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 3:
                    error_10 = _a.sent();
                    error_10.message = "Unable to upload document; " + error_10.message;
                    throw error_10;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.uploadDocument = uploadDocument;
/**
 * Get a (non RDF) document from the LBDserver by providing its URL. Authenticate with a token.
 * @param uri
 * @param context
 */
function getDocument(url, token) {
    return __awaiter(this, void 0, void 0, function () {
        var fullUrl, realUrl, response, config, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    fullUrl = new URL(url);
                    realUrl = url.replace(fullUrl.protocol + "//" + fullUrl.host, "" + process.env.REACT_APP_BACKEND);
                    response = void 0;
                    if (!token) return [3 /*break*/, 2];
                    config = {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    };
                    return [4 /*yield*/, axios_1["default"].get(realUrl, config)];
                case 1:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, axios_1["default"].get(realUrl)];
                case 3:
                    response = _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, response.data];
                case 5:
                    error_11 = _a.sent();
                    error_11.message = "Unable to fetch document; " + error_11.message;
                    throw error_11;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.getDocument = getDocument;
/**
 * Get the metadata of a document resource on the lbdserver. The url of the document should be provided; either with .meta or without (if without; the ".meta" suffix is automatically added).
 * @param uri
 * @param context
 */
function getDocumentMetadata(url, token) {
    return __awaiter(this, void 0, void 0, function () {
        var response, config, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!url.endsWith(".meta")) {
                        url = url.concat('.meta');
                    }
                    url = modifyUrl(url);
                    response = void 0;
                    if (!token) return [3 /*break*/, 2];
                    config = {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    };
                    return [4 /*yield*/, axios_1["default"].get(url, config)];
                case 1:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, axios_1["default"].get(url)];
                case 3:
                    response = _a.sent();
                    _a.label = 4;
                case 4:
                    console.log('response.data', response.data);
                    return [2 /*return*/, response.data];
                case 5:
                    error_12 = _a.sent();
                    error_12.message = "Unable to fetch document metadata; " + error_12.message;
                    throw error_12;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.getDocumentMetadata = getDocumentMetadata;
/**
 * Erase a document (and its corresponding metadata graph) from existence.
 * @param url
 * @param token
 */
function deleteDocument(url, token) {
    return __awaiter(this, void 0, void 0, function () {
        var error_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, deleteResource(url, token)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_13 = _a.sent();
                    error_13.message = "Unable to delete document; " + error_13.message;
                    throw error_13;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.deleteDocument = deleteDocument;
////////////// GRAPH FUNCTIONS ///////////////
/**
 * Upload an RDF graph to a defined project. Props include a "label", a "description" and a "resource", with the "resource" referring to the actual RDF graph to be uploaded. In the case no resource is passed, an empty graph gets created, using the label and description in the metadata, which is equal to {graphurl}.meta.
 * @param props
 * @param project
 * @param token
 */
function uploadGraph(props, project, token) {
    return __awaiter(this, void 0, void 0, function () {
        var baseUrl, url, bodyFormData, myHeaders, config, response, data, error_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    baseUrl = modifyProjectUrl(project);
                    url = baseUrl + "/graphs";
                    bodyFormData = new FormData();
                    if (props.file) {
                        bodyFormData.append("resource", props.file);
                    }
                    bodyFormData.append("label", props.label);
                    bodyFormData.append("description", props.description);
                    myHeaders = new Headers();
                    if (token) {
                        myHeaders.append("Authorization", "Bearer " + token);
                    }
                    config = {
                        method: "POST",
                        redirect: "follow",
                        body: bodyFormData,
                        headers: myHeaders
                    };
                    return [4 /*yield*/, fetch(url, config)];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 3:
                    error_14 = _a.sent();
                    error_14.message = "Unable to upload document";
                    throw error_14;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.uploadGraph = uploadGraph;
/**
 * Get a graph by its URI. You can also request metadata graphs explicitly in with this function. However, you may also use the function "getGraphMetadata" for this purpose.
 * @param url
 * @param token
 */
function getGraph(url, token) {
    return __awaiter(this, void 0, void 0, function () {
        var fullUrl, realUrl, response, config, error_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    fullUrl = new URL(url);
                    realUrl = url.replace(fullUrl.protocol + "//" + fullUrl.host, "" + process.env.REACT_APP_BACKEND);
                    response = void 0;
                    if (!token) return [3 /*break*/, 2];
                    config = {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    };
                    return [4 /*yield*/, axios_1["default"].get(realUrl, config)];
                case 1:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, axios_1["default"].get(realUrl)];
                case 3:
                    response = _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, response.data];
                case 5:
                    error_15 = _a.sent();
                    error_15.message = "Unable to fetch document; " + error_15.message;
                    throw error_15;
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Get the metadata graph of a given graph. You may either provide the ".meta" suffix or skip it.
 * @param url
 * @param token
 */
function getGraphMetadata(url, token) {
    return __awaiter(this, void 0, void 0, function () {
        var data, error_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    if (!url.endsWith(".meta")) {
                        url = url.concat('.meta');
                    }
                    url = modifyUrl(url);
                    return [4 /*yield*/, getGraph(url, token)];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 2:
                    error_16 = _a.sent();
                    error_16.message = "Error finding metdata graph; " + error_16.message;
                    throw error_16;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getGraphMetadata = getGraphMetadata;
/**
 * Erase a project graph and its corresponding metadata graph from existence.
 * @param url
 * @param token
 */
function deleteGraph(url, token) {
    return __awaiter(this, void 0, void 0, function () {
        var error_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, deleteResource(url, token)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_17 = _a.sent();
                    error_17.message = "Unable to delete graph; " + error_17.message;
                    throw error_17;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.deleteGraph = deleteGraph;
///////////////// QUERY FUNCTIONS ////////////////
/**
 * Query a project with SPARQL SELECT.
 * @param project
 * @param query
 * @param token
 */
function queryProjectSelect(project, query, token) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, config, data, error_18;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    url = modifyProjectUrl(project);
                    url = url + "?query=" + query.toString();
                    console.log('url', url);
                    response = void 0;
                    if (!token) return [3 /*break*/, 2];
                    config = {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    };
                    return [4 /*yield*/, axios_1["default"].get(url, config)];
                case 1:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, axios_1["default"].get(url)];
                case 3:
                    response = _a.sent();
                    _a.label = 4;
                case 4:
                    data = response.data.results;
                    return [2 /*return*/, data];
                case 5:
                    error_18 = _a.sent();
                    error_18.message = "Unable to query project; " + error_18.message;
                    throw error_18;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.queryProjectSelect = queryProjectSelect;
/**
 * Query a graph with SPARQL SELECT.
 * @param project
 * @param query
 * @param token
 */
function queryGraphSelect(url, query, token) {
    return __awaiter(this, void 0, void 0, function () {
        var response, config, data, error_19;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    url = modifyUrl(url);
                    url = url + "?query=" + query.toString();
                    console.log('url', url);
                    response = void 0;
                    if (!token) return [3 /*break*/, 2];
                    config = {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    };
                    return [4 /*yield*/, axios_1["default"].get(url, config)];
                case 1:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, axios_1["default"].get(url)];
                case 3:
                    response = _a.sent();
                    _a.label = 4;
                case 4:
                    data = response.data.results;
                    return [2 /*return*/, data];
                case 5:
                    error_19 = _a.sent();
                    error_19.message = "Unable to query graph; " + error_19.message;
                    throw error_19;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.queryGraphSelect = queryGraphSelect;
function updateProject(project, query, token) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, config, error_20;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    url = modifyProjectUrl(project);
                    url = url + "?update=" + encodeURIComponent(query.toString());
                    console.log(url);
                    response = void 0;
                    if (!token) return [3 /*break*/, 2];
                    config = {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    };
                    return [4 /*yield*/, axios_1["default"].put(url, config)];
                case 1:
                    response = _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, axios_1["default"].put(url)];
                case 3:
                    response = _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
                case 5:
                    error_20 = _a.sent();
                    error_20.message = "Unable to update; " + error_20.message;
                    throw error_20;
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Update a named graph in the project (SPARQL INSERT/DELETE). Be careful.
 * @param url
 * @param query
 * @param token
 */
function updateGraph(url, query, token) {
    return __awaiter(this, void 0, void 0, function () {
        var urlProps, project, algebra, _i, _a, key, error_21;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    console.log('url', url);
                    urlProps = new URL(url);
                    project = urlProps.pathname.split("/")[2];
                    algebra = sparqlalgebrajs_1.translate(query, { quads: true });
                    console.log('algebra', algebra);
                    for (_i = 0, _a = Object.keys(algebra); _i < _a.length; _i++) {
                        key = _a[_i];
                        switch (key) {
                            case 'delete':
                                algebra[key].forEach(function (quad) {
                                    quad.graph = { termType: "NamedNode", value: url };
                                });
                                break;
                            case "insert":
                                algebra[key].forEach(function (quad) {
                                    quad.graph = { termType: "NamedNode", value: url };
                                });
                                break;
                            default:
                                break;
                        }
                    }
                    query = sparqlalgebrajs_1.toSparql(algebra);
                    // update project
                    return [4 /*yield*/, updateProject(project, query, token)];
                case 1:
                    // update project
                    _b.sent();
                    return [2 /*return*/];
                case 2:
                    error_21 = _b.sent();
                    error_21.message = "Unable to update graph; " + error_21.message;
                    throw error_21;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.updateGraph = updateGraph;
///////////////// HELPER FUNCTIONS ///////////////
/**
 * Makes sure an url is present. If an url is already given to the function, the base of the url gets modified (for localhost usage). If not, the project url is reconstructed using the backend url (provided in the process.env.REACT_APP_BACKEND) and the project id.
 * @param id
 */
function modifyProjectUrl(id) {
    var url;
    try {
        url = modifyUrl(id);
    }
    catch (error) {
        url = process.env.REACT_APP_BACKEND + "/lbd/" + id;
    }
    return url;
}
/**
 * Modifies the url to the backend, if the backend is running locally. Therefore, the process.env.REACT_APP_BACKEND should be defined.
 * @param url
 */
function modifyUrl(url) {
    try {
        var fullUrl = new URL(url);
        url = url.replace(fullUrl.protocol + "//" + fullUrl.host, "" + process.env.REACT_APP_BACKEND);
        return url;
    }
    catch (error) {
        error.message = "Unable to modify URL; " + error.message;
        throw error;
    }
}
