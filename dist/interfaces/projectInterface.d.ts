/// <reference types="node" />
import * as express from 'express';
interface ICreateProject {
    title: string;
    description: string;
    open: boolean;
}
interface IReturnProject {
    metadata: string;
    id: string;
    uri?: string;
    graphs: IResourceObject;
    documents: IResourceObject;
    permissions?: string[];
    queryResults?: IQueryResults;
}
interface IQueryResults {
    head: {
        vars: string[];
    };
    results: {
        bindings: {
            [variable: string]: {
                type: string;
                value: string;
            }[];
        };
    };
}
interface IResourceObject {
    [x: string]: string;
}
interface IUploadResourceRequest extends express.Request {
    resource?: Buffer;
}
interface IReturnMetadata {
    uri: string;
    metadata?: string;
    data?: Buffer | string;
    results?: IQueryResults;
}
interface IReturnGraph extends IReturnMetadata {
    data?: Buffer | string;
    results?: IQueryResults;
}
export { ICreateProject, IReturnProject, IUploadResourceRequest, IReturnMetadata, IReturnGraph, IQueryResults };