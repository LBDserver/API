/// <reference types="node" />
import { IAgent } from '../interfaces/consolidInterface';
import { Session } from '@inrupt/solid-client-authn-browser';
import { ICreateProject, IQueryResult, IReturnMetadata, IReturnProject } from '../interfaces/projectInterface';
/**
 * Log in using OIDC and a Solid Session.
 * @param {string} oidcIssuer uri for the OIDC issuer. E.g. 'https://broker.pod.inrupt.com'.
 * @param {string} redirectUrl uri for redirect after login via OIDC. E.g. window.location.href. to return to the original page.
 * @param {Session} session The solid session object. Will be returned, but if successful, the session will be authenticated and linked to the logged in user/webID.
 * @returns {Promise<Session>} Returns a Solid Session object
 */
declare function login(oidcIssuer: string, redirectUrl: string, session: Session): Promise<Session>;
/**
 * Log in using OIDC and a Solid Session.
 * @param {string} oidcIssuer uri for the OIDC issuer. E.g. 'https://broker.pod.inrupt.com'.
 * @param {string} redirecturi uri for redirect after login via OIDC. E.g. window.location.href. to return to the original page.
 * @param {Session} session The solid session object. Will be returned, but if successful, the session will be authenticated and linked to the logged in user/webID.
 * @returns {Promise<Session>} Returns a Solid Session object
 */
declare function register(oidcIssuer: string, redirecturi: string, session: Session): Promise<Session>;
/**
 * Helper function to process the session after OIDC login. Retrieves the "code" from the current uri.
 * @param {Session} session The Solid Session object.
 * @returns {Promise<Session>} Returns a Solid Session object
 */
declare function processSession(session: Session): Promise<Session>;
/**
 * Log out from a Solid Session.
 * @param {Session} session The Solid Session object.
 * @returns {Promise<Session>} Returns a Solid Session object
 */
declare function logout(session: Session): Promise<Session>;
/**
 * Create a new project environment. As the project ID is created here, the project metadata graph (.props) should be created afterwards (createGraph)
 * @param {Array<IAgent>} stakeholders Array of stakeholders to be involved in the project, as well as their access rights to the project in general.
 * @param {Session} session The Solid Session object.
 * @returns {Promise<ICreateProject>}
 */
declare function createProject(stakeholders: Array<IAgent>, session: Session): Promise<ICreateProject>;
/**
 * Delete an LBD project. The project will only be deleted in your own POD, of course.
 * @param {string} uri The uri of the project to delete in your repository.
 * @param {Session} session The Solid Session object.
 * @returns {Promise<void>}
 */
declare function deleteProject(uri: string, session: Session): Promise<void>;
/**
 * Get all the LBD projects in the POD of the authenticated user.
 * @param {Session} session The Solid Session object.
 * @returns {Promise<IReturnProject[]>}
 */
declare function getUserProjects(session: Session): Promise<IReturnProject[]>;
/**
 * Get a single project by its uri. From your local project, other stakeholders are determined and the federated project data you have access to is fetched.
 * @param {string} uri The uri of the project.
 * @param {Session} session The Solid Session object.
 * @returns {Promise<IReturnProject>}
 */
declare function getOneProject(uri: string, session: Session): Promise<IReturnProject>;
/**
 * Get the open projects on a specific LBDlocation.
 * @param {string} lbdLocation The LBD project location to search for open projects
 * @returns {Promise<IReturnProject[]>}
 */
declare function getOpenProjects(lbdLocation: any): Promise<IReturnProject[]>;
/**
 * Upload a resource to your POD. You may also use uploadGraph and uploadDocument.
 * @param {string} url the to-be url of the resource
 * @param {Buffer | string} data The data to be uploaded. Can be a buffer or a plain string.
 * @param {Object} options Upload options
 * @param {boolean} [options.overwrite] Whether the resource is an existing object that should be overwritten.
 * @param {string} [options.mimeType] The mimetype of the resource. If not passed, the mimetype is guessed by the extension. If this files, the mimetype is st to 'text/plain'.
 * @param {Session} session The Solid session object
 * @returns {Promise<void>}
 */
declare function uploadResource(url: string, data: Buffer | string, options: {
    overwrite?: boolean;
    mimeType?: string;
}, session: Session): Promise<void>;
/**
 * Upload a graph (TTL) to your POD.
 * @param {string} url the to-be url of the resource
 * @param {Buffer | string} data The data to be uploaded. Can be a buffer or a plain string.
 * @param {string} metadata The metadata graph as Turtle.
 * @param {Object} options Upload options
 * @param {boolean} options.overwrite Whether the resource is an existing object that should be overwritten.
 * @param {string} [options.mimeType] The mimetype of the resource. If not passed, the mimetype is guessed by the extension. If this files, the mimetype is st to 'text/plain'.
 * @param {Session} session The Solid session object
 * @returns {Promise<IReturnMetadata>}
 */
declare function uploadGraph(url: string, data: Buffer | string, metadata: string, options: {
    overwrite: boolean;
    mimeType: string;
}, session: Session): Promise<IReturnMetadata>;
/**
 * Upload a non-RDF resource to your POD.
 * @param {string} url the to-be url of the resource
 * @param {Buffer | string} data The data to be uploaded. Can be a buffer or a plain string.
 * @param {string} metadata The metadata graph as Turtle.
 * @param {Object} options Upload options
 * @param {boolean} options.overwrite Whether the resource is an existing object that should be overwritten.
 * @param {string} [options.mimeType] The mimetype of the resource. If not passed, the mimetype is guessed by the extension. If this files, the mimetype is st to 'text/plain'.
 * @param {Session} session The Solid session object
 * @returns {Promise<IReturnMetadata>}
 */
declare function uploadDocument(url: any, data: Buffer | string, metadata: string, options: {
    overwrite: boolean;
    mimeType: string;
}, session: Session): Promise<IReturnMetadata>;
/**
 * Delete a resource
 * @param {string} url The url of the resource to be deleted
 * @param {Session} session The Solid session object
 * @returns {Promise<void>}
 */
declare function deleteResource(url: string, session: Session): Promise<void>;
/**
 * Delete an RDF resource and its metadata
 * @param {string} url The url of the resource to be deleted
 * @param {Session} session The Solid session object
 * @returns {Promise<void>}
 */
declare function deleteGraph(url: any, session: Session): Promise<void>;
/**
 * Delete an non-RDF resource and its metadata
 * @param {string} url The url of the resource to be deleted
 * @param {Session} session The Solid session object
 * @returns {Promise<void>}
 */
declare function deleteDocument(url: any, session: Session): Promise<void>;
/**
 * Create a container with a given url
 * @param {string} url The url of the container to be created
 * @param {Session} session The Solid session object
 * @returns {Promise<void>}
 */
declare function createContainer(url: string, session: Session): Promise<void>;
/**
 * Get the content of the container as an object with a list of resources and subcontainers.
 * @param {string} url The url of the container
 * @param {Session} session The Solid session object
 * @returns {Promise<{containers: string[], resources: string[]}>}
 */
declare function getContainerContent(url: string, session: Session): Promise<{
    containers: string[];
    resources: string[];
}>;
/**
 * Upload the metadata graph for a given resource. Metadata graph urls will end with ".props".
 * @param {string} url The url of the resource (if it doesn't end with ".props", the suffix is added automatically)
 * @param {string} data The metadata as Turtle
 * @param {Object} options Options for uploading
 * @param {boolean} options.overwrite Whether the resource is an existing object that should be overwritten.
 * @param {string} [options.mimeType] The mimetype of the resource. If not passed, the mimetype is guessed by the extension. If this files, the mimetype is st to 'text/plain'.
 * @param {Session} session The Solid session object
 * @returns {Promise<void>}
 */
declare function uploadMetadataGraph(url: string, data: string, options: {
    overwrite: boolean;
    mimeType: string;
}, session: Session): Promise<void>;
/**
 * Query (SPARQL SELECT) a (set of) resource(s) with Comunica. As for now, only openly accessible graphs (i.e. Read permissions) can be queried
 * @param {string} query The SPARQL query string
 * @param {string[]} graphs The resources to be queried as an Array
 * @param {Session} session The Solid session object
 * @returns {Promise<IQueryResult[]>}
 */
declare function query(query: string, graphs: string[], session: Session): Promise<IQueryResult[]>;
/**
 * Get the location where LBD projects are stored. At this point, standard './lbd/' will be returned. Later phases may include more complex mechanisms such as Shape Tree discovery or Index Types. Authenticated sessions may thus be required in the future.
 * @param {string} webId The web id to find the LBD location for.
 * @param {Session} session The Solid session object
 * @returns {Promise<string>}
 */
declare function getLbdLocation(webId: string, session: Session): Promise<string>;
export { login, processSession, logout, register, createProject, deleteProject, getUserProjects, getOneProject, getOpenProjects, uploadResource, uploadGraph, uploadDocument, deleteResource, deleteGraph, deleteDocument, createContainer, getContainerContent, uploadMetadataGraph, getLbdLocation, query };
