interface ICreateProject {
    title: string;
    description: string;
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
    results?: IQueryResults;
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
interface IReturnMetadata {
    uri: string;
    metadata: string;
    permissions: string[];
}
interface IReturnGraph {
    uri: string;
    permissions?: string[];
    data?: IResourceObject;
    results?: IQueryResults;
    metadata?: string;
}
export { ICreateProject, IReturnProject, IReturnMetadata, IReturnGraph, IQueryResults, ICreateProjectWithMetadata };
