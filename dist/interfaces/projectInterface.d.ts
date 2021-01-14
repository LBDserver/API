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
}
interface IReturnGraph {
    uri: string;
    data?: IResourceObject;
    results?: IQueryResults;
    metadata?: string;
}
export { ICreateProject, IReturnProject, IReturnMetadata, IReturnGraph, IQueryResults };
