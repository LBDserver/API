import { PermissionType } from './consolidInterface';
interface ICreateProject {
    id: string;
    permissions: PermissionType[];
    uri: string;
    graphs: IResourceObject;
    documents: IResourceObject;
}
interface ICreateProjectWithMetadata {
    metadata: IResourceObject;
}
interface IReturnProject {
    metadata: string;
    id: string;
    uri: string;
    graphs: IResourceObject;
    documents: IResourceObject;
    permissions: string[];
    results?: IQueryResult[];
}
interface IQueryResult {
    [x: string]: {
        value: string;
        type: string;
    };
}
interface IResourceObject {
    [x: string]: IReturnMetadata;
}
interface IReturnResources {
    graphs: {
        [x: string]: any;
    };
    documents: {
        [x: string]: any;
    };
}
interface IReturnMetadata {
    metadata: string;
    permissions: PermissionType[];
}
interface IReturnGraph {
    uri: string;
    permissions?: string[];
    data?: IResourceObject;
    results?: IQueryResult[];
    metadata?: string;
}
export { ICreateProject, IReturnProject, IReturnMetadata, IReturnGraph, IQueryResult, ICreateProjectWithMetadata, IReturnResources };
