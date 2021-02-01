/// <reference types="node" />
import { IAgent } from '../interfaces/consolidInterface';
import { Session } from '@inrupt/solid-client-authn-browser';
declare function login(oidcIssuer: string, redirectUrl: string, session: Session): Promise<Session>;
declare function processSession(session: Session): Promise<Session>;
declare function logout(session: Session): Promise<Session>;
declare function createProject(metadata: any, stakeholders: Array<IAgent>, session: Session): Promise<void>;
declare function deleteProject(projectId: string, session: Session): Promise<void>;
declare function getUserProjects(session: Session): Promise<void>;
declare function getOneProject(projectId: string, session: Session): Promise<void>;
declare function uploadResource(url: string, data: Buffer | string, options: any, session: Session): Promise<void>;
declare function uploadGraph(url: any, data: any, metadata: any, options: any, session: Session): Promise<void>;
declare function uploadDocument(url: any, data: Buffer | string, metadata: string, options: any, session: Session): Promise<void>;
declare function deleteResource(url: any, session: Session): Promise<void>;
declare function deleteGraph(url: any, session: Session): Promise<void>;
declare function deleteDocument(url: any, session: Session): Promise<void>;
declare function createContainer(url: any, session: Session): Promise<void>;
declare function getContainerContent(url: any, session: any): Promise<{
    containers: string[];
    resources: string[];
}>;
declare function uploadMetadataGraph(url: any, data: any, options: any, session: Session): Promise<void>;
declare function query(resources: string[], query: string, session: Session): Promise<Array<Map<string, any>>>;
export { login, processSession, logout, createProject, deleteProject, getUserProjects, getOneProject, uploadResource, uploadGraph, uploadDocument, deleteResource, deleteGraph, deleteDocument, createContainer, getContainerContent, uploadMetadataGraph, query };
