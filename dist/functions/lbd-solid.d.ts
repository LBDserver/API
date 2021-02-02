/// <reference types="node" />
import { IAgent } from '../interfaces/consolidInterface';
import { Session } from '@inrupt/solid-client-authn-browser';
import { IReturnMetadata, IReturnProject } from '../interfaces/projectInterface';
/**
 * Log in using OIDC and a Solid Session.
 * @param {string} oidcIssuer URL for the OIDC issuer. E.g. 'https://broker.pod.inrupt.com'.
 * @param {string} redirectUrl URL for redirect after login via OIDC. E.g. window.location.href. to return to the original page.
 * @param {Session} session The solid session object. Will be returned, but if successful, the session will be authenticated and linked to the logged in user/webID.
 * @returns {Promise<Session>} Returns a Solid Session object
 */
declare function login(oidcIssuer: string, redirectUrl: string, session: Session): Promise<Session>;
/**
 * Log in using OIDC and a Solid Session.
 * @param {string} oidcIssuer URL for the OIDC issuer. E.g. 'https://broker.pod.inrupt.com'.
 * @param {string} redirectUrl URL for redirect after login via OIDC. E.g. window.location.href. to return to the original page.
 * @param {Session} session The solid session object. Will be returned, but if successful, the session will be authenticated and linked to the logged in user/webID.
 * @returns {Promise<Session>} Returns a Solid Session object
 */
declare function register(oidcIssuer: string, redirectUrl: string, session: Session): Promise<Session>;
/**
 * Helper function to process the session after OIDC login. Retrieves the "code" from the current url.
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
 *
 * @param {string} metadata a valid TTL string for the metadata of the project. Should contain default metadata such as rdfs:label, rdfs:comment. NOTE: in later versions, will be checked with SHACL shape
 * @param {Array<IAgent>} stakeholders Array of stakeholders to be involved in the project, as well as their access rights to the project in general.
 * @param {Session} session
 */
declare function createProject(stakeholders: Array<IAgent>, session: Session): Promise<any>;
declare function deleteProject(url: string, session: Session): Promise<void>;
declare function getUserProjects(session: Session): Promise<IReturnProject[]>;
declare function getOneProject(uri: string, session: Session): Promise<IReturnProject>;
declare function getOpenProjects(): Promise<any[]>;
declare function uploadResource(url: string, data: Buffer | string, options: any, session: Session): Promise<void>;
declare function uploadGraph(url: any, data: any, metadata: any, options: any, session: Session): Promise<IReturnMetadata>;
declare function uploadDocument(url: any, data: Buffer | string, metadata: string, options: any, session: Session): Promise<IReturnMetadata>;
declare function deleteResource(url: any, session: Session): Promise<void>;
declare function deleteGraph(url: any, session: Session): Promise<void>;
declare function deleteDocument(url: any, session: Session): Promise<void>;
declare function createContainer(url: any, session: Session): Promise<void>;
declare function getContainerContent(url: any, session: any): Promise<{
    containers: string[];
    resources: string[];
}>;
declare function uploadMetadataGraph(url: any, data: any, options: any, session: Session): Promise<void>;
declare function query(query: string, graphs: string[], session: Session): Promise<any>;
/**
 * Get the location where LBD projects are stored. At this point, standard './lbd/' will be returned. Later phases may include more complex mechanisms such as Shape Tree discovery or Index Types. Authenticated sessions may thus be required in the future.
 * @param webId
 */
declare function getLbdLocation(webId: any): Promise<string>;
export { login, processSession, logout, register, createProject, deleteProject, getUserProjects, getOneProject, getOpenProjects, uploadResource, uploadGraph, uploadDocument, deleteResource, deleteGraph, deleteDocument, createContainer, getContainerContent, uploadMetadataGraph, getLbdLocation, query };
