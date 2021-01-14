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
exports.queryMultiple = exports.updateGraph = exports.queryGraphSelect = exports.queryProjectSelect = exports.deleteGraph = exports.deleteResource = exports.getGraphMetadata = exports.deleteDocument = exports.deleteProject = exports.getDocumentMetadata = exports.getOneProject = exports.getDocument = exports.uploadGraph = exports.uploadDocument = exports.createProject = exports.getUserProjects = exports.login = exports.register = exports.logout = exports.getOpenProjects = void 0;
var axios_1 = require("axios");
var sparqlalgebrajs_1 = require("sparqlalgebrajs");
/////////////////// USER OBJECTS //////////////////
/**
 *
 * @typedef {Object} User
 * @property {string} username
 * @property {string} email
 * @property {string[]} projects
 * @property {string} uri
 */
/**
 *
 * @typedef {Object} returnUser
 * @property {User} user
 * @property {string} token
 */
//////////////////// USER FUNCTIONS ////////////////////
/**
 * Register as a user to the local LBDserver (backend defined in process.env.REACT_APP_BACKEND).
 * @param {string} username Your username will be used to create a webID (personal URL) that can be used for access control in a Linked Data world. Should be unique.
 * @param {string} email Your e-mail address. Should be unique.
 * @param {string} password Your LBDserver passsword.
 * @returns {Promise<returnUser>} Returns a User object and a token.
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
 * @param {string} email Your e-mail address.
 * @param {string} password Your LBDserver password.
 * @returns {Promise<returnUser>} Returns a User object and a token.
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
 * @param {string} token The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @returns {void}
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
///////////////// RESOURCE OBJECTS //////////////////
/**
 * @typedef {Object} Metadata
 * @property {string} uri URI of the document
 * @property {Object} metadata The metadata as JSON-LD.
 */
//////////////////// PROJECT OBJECTS ////////////////////
/**
 * @typedef {Object} Project
 * @property {Object} metadata A JSON-LD object of the project metadata
 * @property {string} id The project id
 * @property {string} [uri] The project uri. Optional (only when creating a project => otherwise it is just the url of the request)
 * @property {resource} graphs An object containing all the graphs in the project. The object key is the graph url, the value is its metadata as JSON-LD.
 * @property {resource} documents An object containing all the documents in the project. The object key is the document url, the value is its metadata as JSON-LD.
 * @property {QueryResults} [results] the result of an eventual SPARQL SELECT query. Only if a query was sent along.
 */
/**
 * @typedef {Object} QueryResults
 * @property {Object} head
 * @property {string[]} head.vars
 * @property {Object} results
 * @property {Object[]} results.bindings links the variables to the results.
 */
//////////////////// PROJECT FUNCTIONS ////////////////////
/**
 * Get all the documents accessible to unauthenticated users (public projects) on the local LBDserver (backend defined in process.env.REACT_APP_BACKEND)
 * @returns {Project[]}
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
 * @param {string} token The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @returns {Project[]}
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
 * @param {Object.<string, any>} project The project object.
 * @param {string} project.title The title "name" of the project. It will be registered in the project metadata graph of the project as rdfs:label.
 * @param {string} project.description A small description of the project. It will be registered in the project metadata graph as rdfs:comment.
 * @param {boolean} project.open Whether the project should be visible for the broader public or only for the creator. This is registered within the default ACL file (which can be changed afterwards as well).
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @returns {Project}
 */
function createProject(project, token) {
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
                    return [4 /*yield*/, axios_1["default"].post(process.env.REACT_APP_BACKEND + "/lbd", project, config)];
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
 * @param {string} project The URL or the ID of the project.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. Optional.
 * @returns {Project}
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
 * @param {string} project The URL or the ID of the project.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @returns {void}
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
 * @param {string} url The url of the resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @returns {void}
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
 * @param {Object.<string, any>} props The properties of the object to be uploaded.
 * @param {string} props.label A label for the resource. It will be registered in the metadata graph of the resource as rdfs:label.
 * @param {string} props.description A description for the resource. It will be registered in the metadata graph of the resource as rdfs:comment.
 * @param {Blob} props.file The file originating from a HTMLInputElement upload. Only one file at a time.
 * @param {string|Blob} [props.acl] An optional parameter to indicate the ACL graph for the resource. Can be a string pointing at the URL of an already existing ACL graph or a new ACL graph, uploaded via a HTMLInputElement.
 * @param {string} project The URL or the ID of the project.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @returns {Metadata}
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
                    if (props.acl) {
                        bodyFormData.append("acl", props.acl);
                    }
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
 * @param {string} url The URL of the requested resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @returns {Buffer}
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
 * @param {string} url The URL of the requested resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @returns {Metadata}
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
 * @param {string} url The URL of the resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @returns {void}
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
///////////////// GRAPH OBJECTS //////////////////
/**
 * @typedef {Object} Graph
 * @property {string} uri URI of the document
 * @property {Object} metadata The metadata as JSON-LD.
 * @property {Object} data The graph content as JSON-LD
 */
////////////// GRAPH FUNCTIONS ///////////////
/**
 * Upload an RDF graph to a defined project. Props include a "label", a "description" and a "resource", with the "resource" referring to the actual RDF graph to be uploaded. In the case no resource is passed, an empty graph gets created, using the label and description in the metadata, which is equal to {graphurl}.meta. A custom ACL graph or reference may be provided.
 * @param {Object.<string, any>} props The properties of the object to be uploaded.
 * @param {string} props.label A label for the resource. It will be registered in the metadata graph of the resource as rdfs:label.
 * @param {string} props.description A description for the resource. It will be registered in the metadata graph of the resource as rdfs:comment.
 * @param {Blob} props.file The file originating from a HTMLInputElement upload. Only one file at a time.
 * @param {string|Blob} [props.acl] An optional parameter to indicate the ACL graph for the resource. Can be a string pointing at the URL of an already existing ACL graph or a new ACL graph, uploaded via a HTMLInputElement.
 * @param {string} project The URL or the ID of the project.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @returns {Metadata}
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
                    if (props.acl) {
                        bodyFormData.append("acl", props.acl);
                    }
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
 * Get a graph by its URL. You can also request metadata graphs explicitly in with this function. However, you may also use the function "getGraphMetadata" for this purpose.
 * @param {string} url The URL of the requested resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @returns {Graph}
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
 * @param {string} url The URL of the resource corresponding with the metadata graph or the URL of the metadata graph itself.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @returns {Metadata}
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
 * @param {string} url The URL of the resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @returns {void}
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
 * Query a project with SPARQL SELECT. Only the graphs to which the user has access will be queried.
 * @param {string} project The URL or the ID of the project.
 * @param {string} query A SPARQL select query.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @returns {QueryResults}
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
 * Query multiple graphs with SPARQL SELECT.
 * @param {string} project The URL or the ID of the project.
 * @param {string} query A SPARQL select query.
 * @param {string[]} graphs An array of the graphs that are to be included in the query.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @returns {QueryResults}
 */
function queryMultiple(project, query, graphs, token) {
    return __awaiter(this, void 0, void 0, function () {
        var algebra, rdfGraphs_1, newAlgebra, url, response, config, data, error_19;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    algebra = sparqlalgebrajs_1.translate(query, { quads: true });
                    rdfGraphs_1 = [];
                    graphs.forEach(function (graph) {
                        rdfGraphs_1.push({ termType: "NamedNode", value: graph });
                    });
                    newAlgebra = {
                        input: algebra,
                        "default": rdfGraphs_1,
                        type: "from",
                        named: []
                    };
                    query = sparqlalgebrajs_1.toSparql(newAlgebra);
                    console.log('query', query);
                    url = modifyProjectUrl(project);
                    url = url + "?query=" + encodeURIComponent(query.toString());
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
                    error_19.message = "Unable to query project; " + error_19.message;
                    throw error_19;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.queryMultiple = queryMultiple;
/**
 * Query a graph with SPARQL SELECT.
 * @param {string} url The url of the graph to be queried.
 * @param {string} query A SPARQL select query.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @return {QueryResults}
 */
function queryGraphSelect(url, query, token) {
    return __awaiter(this, void 0, void 0, function () {
        var response, config, data, error_20;
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
                    error_20 = _a.sent();
                    error_20.message = "Unable to query graph; " + error_20.message;
                    throw error_20;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.queryGraphSelect = queryGraphSelect;
function updateProject(project, query, token) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, config, error_21;
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
                    error_21 = _a.sent();
                    error_21.message = "Unable to update; " + error_21.message;
                    throw error_21;
                case 6: return [2 /*return*/];
            }
        });
    });
}
/**
 * Update a named graph in the project (SPARQL INSERT/DELETE). Be careful.
 * @param {string} url The url of the graph to be updated.
 * @param {string} query A SPARQL INSERT/DELETE query.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 * @returns {void}
 */
function updateGraph(url, query, token) {
    return __awaiter(this, void 0, void 0, function () {
        var urlProps, project, algebra, _i, _a, key, error_22;
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
                    error_22 = _b.sent();
                    error_22.message = "Unable to update graph; " + error_22.message;
                    throw error_22;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.updateGraph = updateGraph;
///////////////// HELPER FUNCTIONS ///////////////
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
