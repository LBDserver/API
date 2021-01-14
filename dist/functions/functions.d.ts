/// <reference types="node" />
import * as USER from "../interfaces/userInterface";
import * as PROJECT from '../interfaces/projectInterface';
/**
 * Register as a user to the local LBDserver (backend defined in process.env.REACT_APP_BACKEND).
 * @param {string} username Your username will be used to create a webID (personal URL) that can be used for access control in a Linked Data world. Should be unique.
 * @param {string} email Your e-mail address. Should be unique.
 * @param {string} password Your LBDserver passsword.
 */
declare function register(username: string, email: string, password: string): Promise<USER.IReturnUser>;
/**
 * Login as an existing user to the LBDserver (backend defined in process.env.REACT_APP_BACKEND)
 * @param {string} email Your e-mail address.
 * @param {string} password Your LBDserver password.
 */
declare function login(email: string, password: string): Promise<USER.IReturnUser>;
/**
 * Log out on the LBDserver (backend defined in process.env.REACT_APP_BACKEND)
 * @param {string} token The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
declare function logout(token: string): Promise<void>;
/**
 * Get all the documents accessible to unauthenticated users (public projects) on the local LBDserver (backend defined in process.env.REACT_APP_BACKEND)
 */
declare function getOpenProjects(): Promise<PROJECT.IReturnProject[]>;
/**
 * Get all the projects associated with the currently authenticated user.
 * @param {string} token The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
declare function getUserProjects(token: string): Promise<PROJECT.IReturnProject[]>;
/**
 * Create a new project on the local LBDserver
 * @param {Object.<string, any>} project The project object.
 * @param {string} project.title The title "name" of the project. It will be registered in the project metadata graph of the project as rdfs:label.
 * @param {string} project.description A small description of the project. It will be registered in the project metadata graph as rdfs:comment.
 * @param {boolean} project.open Whether the project should be visible for the broader public or only for the creator. This is registered within the default ACL file (which can be changed afterwards as well).
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
declare function createProject(project: PROJECT.ICreateProject, token?: string): Promise<PROJECT.IReturnProject>;
/**
 * Get a project by its URL or ID. If an ID is given, the URL is reconstructed via the backend URL defined in process.env.REACT_APP_BACKEND.
 * @param {string} project The URL or the ID of the project.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. Optional
 */
declare function getOneProject(project: string, token?: string): Promise<PROJECT.IReturnProject>;
/**
 * Delete a project by ID or URL. If an ID is provided; the URL is reconstructed based on the backend URL defined in process.env.REACT_APP_BACKEND.
 * @param {string} project The URL or the ID of the project.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
declare function deleteProject(project: string, token?: string): Promise<void>;
/**
 * Delete a resource and its metadata graph.
 * @param {string} url The url of the resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
declare function deleteResource(url: string, token?: string): Promise<void>;
interface IUploadResource {
    label: string;
    description: string;
    file?: Blob;
    acl?: Blob;
}
/**
 * Upload a document to a defined project. Props include a "label", a "description" and a "resource", with the "resource" referring to the actual file to be uploaded. The "label" and "description" are used in the automatically created metadata file, which is equal to {fileurl}.meta.
 * @param {Object.<string, any>} props The properties of the object to be uploaded.
 * @param {string} props.label A label for the resource. It will be registered in the metadata graph of the resource as rdfs:label.
 * @param {string} props.description A description for the resource. It will be registered in the metadata graph of the resource as rdfs:comment.
 * @param {Blob} props.file The file originating from a HTMLInputElement upload. Only one file at a time.
 * @param {string|Blob} [props.acl] An optional parameter to indicate the ACL graph for the resource. Can be a string pointing at the URL of an already existing ACL graph or a new ACL graph, uploaded via a HTMLInputElement.
 * @param {string} project The URL or the ID of the project.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
declare function uploadDocument(props: IUploadResource, project: string, token?: string): Promise<PROJECT.IReturnMetadata>;
/**
 * Get a (non RDF) document from the LBDserver by providing its URL. Authenticate with a token.
 * @param {string} url The URL of the requested resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
declare function getDocument(url: string, token?: string): Promise<Buffer>;
/**
 * Get the metadata of a document resource on the lbdserver. The url of the document should be provided; either with .meta or without (if without; the ".meta" suffix is automatically added).
 * @param {string} url The URL of the requested resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
declare function getDocumentMetadata(url: string, token?: string): Promise<PROJECT.IReturnMetadata>;
/**
 * Erase a document (and its corresponding metadata graph) from existence.
 * @param {string} url The URL of the resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
declare function deleteDocument(url: string, token?: string): Promise<void>;
/**
 * Upload an RDF graph to a defined project. Props include a "label", a "description" and a "resource", with the "resource" referring to the actual RDF graph to be uploaded. In the case no resource is passed, an empty graph gets created, using the label and description in the metadata, which is equal to {graphurl}.meta. A custom ACL graph or reference may be provided.
 * @param {Object.<string, any>} props The properties of the object to be uploaded.
 * @param {string} props.label A label for the resource. It will be registered in the metadata graph of the resource as rdfs:label.
 * @param {string} props.description A description for the resource. It will be registered in the metadata graph of the resource as rdfs:comment.
 * @param {Blob} props.file The file originating from a HTMLInputElement upload. Only one file at a time.
 * @param {string|Blob} [props.acl] An optional parameter to indicate the ACL graph for the resource. Can be a string pointing at the URL of an already existing ACL graph or a new ACL graph, uploaded via a HTMLInputElement.
 * @param {string} project The URL or the ID of the project.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
declare function uploadGraph(props: IUploadResource, project: string, token?: string): Promise<PROJECT.IReturnMetadata>;
/**
 * Get the metadata graph of a given graph. You may either provide the ".meta" suffix or skip it.
 * @param {string} url The URL of the resource corresponding with the metadata graph or the URL of the metadata graph itself.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
declare function getGraphMetadata(url: string, token?: string): Promise<PROJECT.IReturnMetadata>;
/**
 * Erase a project graph and its corresponding metadata graph from existence.
 * @param {string} url The URL of the resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
declare function deleteGraph(url: string, token?: string): Promise<void>;
/**
 * Query a project with SPARQL SELECT. Only the graphs to which the user has access will be queried.
 * @param {string} project The URL or the ID of the project.
 * @param {string} query A SPARQL select query.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
declare function queryProjectSelect(project: string, query: string, token?: string): Promise<PROJECT.IQueryResults>;
/**
 * Query multiple graphs with SPARQL SELECT.
 * @param {string} project The URL or the ID of the project.
 * @param {string} query A SPARQL select query.
 * @param {string[]} graphs An array of the graphs that are to be included in the query.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
declare function queryMultiple(project: string, query: string, graphs: string[], token?: string): Promise<PROJECT.IQueryResults>;
/**
 * Query a graph with SPARQL SELECT.
 * @param {string} url The url of the graph to be queried.
 * @param {string} query A SPARQL select query.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
declare function queryGraphSelect(url: string, query: string, token?: string): Promise<PROJECT.IQueryResults>;
/**
 * Update a named graph in the project (SPARQL INSERT/DELETE). Be careful.
 * @param {string} url The url of the graph to be updated.
 * @param {string} query A SPARQL INSERT/DELETE query.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
declare function updateGraph(url: string, query: string, token?: string): Promise<void>;
export { getOpenProjects, logout, register, login, getUserProjects, createProject, uploadDocument, uploadGraph, getDocument, getOneProject, getDocumentMetadata, deleteProject, deleteDocument, getGraphMetadata, deleteResource, deleteGraph, queryProjectSelect, queryGraphSelect, updateGraph, queryMultiple };
