/// <reference types="node" />
import * as USER from "../interfaces/userInterface";
import * as PROJECT from '../interfaces/projectInterface';
/**
 * Register as a user to the local LBDserver (backend defined in process.env.REACT_APP_BACKEND).
 * @param username
 * @param email
 * @param password
 */
declare function register(username: string, email: string, password: string): Promise<USER.IReturnUser>;
/**
 * Login as an existing user to the LBDserver (backend defined in process.env.REACT_APP_BACKEND)
 * @param email
 * @param password
 */
declare function login(email: string, password: string): Promise<USER.IReturnUser>;
/**
 * Log out on the LBDserver (backend defined in process.env.REACT_APP_BACKEND)
 * @param token
 */
declare function logout(token: string): Promise<void>;
/**
 * Get all the documents accessible to unauthenticated users (public projects) on the local LBDserver (backend defined in process.env.REACT_APP_BACKEND)
 */
declare function getOpenProjects(): Promise<PROJECT.IReturnProject[]>;
/**
 * Get all the projects associated with the currently authenticated user.
 * @param token
 */
declare function getUserProjects(token: string): Promise<PROJECT.IReturnProject[]>;
/**
 * Create a new project on the local LBDserver
 * @param body
 * @param token
 */
declare function createProject(body: PROJECT.ICreateProject, token?: string): Promise<PROJECT.IReturnProject>;
/**
 * Get a project by its URL or ID. If an ID is given, the URL is reconstructed via the backend URL defined in process.env.REACT_APP_BACKEND.
 * @param project
 * @param token
 */
declare function getOneProject(project: string, token?: string): Promise<PROJECT.IReturnProject>;
/**
 * Delete a project by ID or URL. If an ID is provided; the URL is reconstructed based on the backend URL defined in process.env.REACT_APP_BACKEND.
 * @param project
 * @param token
 */
declare function deleteProject(project: string, token?: string): Promise<void>;
/**
 * Delete a resource and its metadata graph.
 * @param url
 * @param token
 */
declare function deleteResource(url: string, token?: string): Promise<void>;
interface IUploadResource {
    label: string;
    description: string;
    file?: any;
}
/**
 * Upload a document to a defined project. Props include a "label", a "description" and a "resource", with the "resource" referring to the actual file to be uploaded. The "label" and "description" are used in the automatically created metadata file, which is equal to {fileurl}.meta.
 * @param props
 * @param project
 * @param token
 */
declare function uploadDocument(props: IUploadResource, project: string, token?: string): Promise<PROJECT.IReturnMetadata>;
/**
 * Get a (non RDF) document from the LBDserver by providing its URL. Authenticate with a token.
 * @param uri
 * @param context
 */
declare function getDocument(url: string, token?: string): Promise<Buffer>;
/**
 * Get the metadata of a document resource on the lbdserver. The url of the document should be provided; either with .meta or without (if without; the ".meta" suffix is automatically added).
 * @param uri
 * @param context
 */
declare function getDocumentMetadata(url: string, token?: string): Promise<PROJECT.IReturnMetadata>;
/**
 * Erase a document (and its corresponding metadata graph) from existence.
 * @param url
 * @param token
 */
declare function deleteDocument(url: string, token?: string): Promise<void>;
/**
 * Upload an RDF graph to a defined project. Props include a "label", a "description" and a "resource", with the "resource" referring to the actual RDF graph to be uploaded. In the case no resource is passed, an empty graph gets created, using the label and description in the metadata, which is equal to {graphurl}.meta.
 * @param props
 * @param project
 * @param token
 */
declare function uploadGraph(props: IUploadResource, project: string, token: string): Promise<PROJECT.IReturnMetadata>;
/**
 * Get the metadata graph of a given graph. You may either provide the ".meta" suffix or skip it.
 * @param url
 * @param token
 */
declare function getGraphMetadata(url: string, token?: string): Promise<PROJECT.IReturnMetadata>;
/**
 * Erase a project graph and its corresponding metadata graph from existence.
 * @param url
 * @param token
 */
declare function deleteGraph(url: string, token?: string): Promise<void>;
/**
 * Query a project with SPARQL SELECT.
 * @param project
 * @param query
 * @param token
 */
declare function queryProjectSelect(project: string, query: string, token?: string): Promise<PROJECT.IQueryResults>;
/**
 * Query a graph with SPARQL SELECT.
 * @param project
 * @param query
 * @param token
 */
declare function queryGraphSelect(url: string, query: string, token?: string): Promise<PROJECT.IQueryResults>;
/**
 * Update a named graph in the project (SPARQL INSERT/DELETE). Be careful.
 * @param url
 * @param query
 * @param token
 */
declare function updateGraph(url: string, query: string, token?: string): Promise<void>;
export { getOpenProjects, logout, register, login, getUserProjects, createProject, uploadDocument, uploadGraph, getDocument, getOneProject, getDocumentMetadata, deleteProject, deleteDocument, getGraphMetadata, deleteResource, deleteGraph, queryProjectSelect, queryGraphSelect, updateGraph };
