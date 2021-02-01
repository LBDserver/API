import {
    IUser,
    IRegisterRequest,
    ILoginRequest,
    IReturnUser
} from './interfaces/userInterface'

import {
    ICreateProject,
    IReturnProject ,
    IReturnMetadata,
    IReturnGraph,
    IQueryResults
} from './interfaces/projectInterface'

import {
    login,
    processSession,
    logout,

    createProject,
    deleteProject,
    getUserProjects,
    getOneProject,

    uploadResource,
    uploadGraph,
    uploadDocument,
    deleteResource,
    deleteGraph,
    deleteDocument,

    createContainer,
    getContainerContent,
    uploadMetadataGraph,

    query
}
 from './functions/lbd-solid'

export {
    ICreateProject,
    IReturnProject,
    IReturnMetadata,
    IReturnGraph,
    IQueryResults,
    IUser,
    IRegisterRequest,
    ILoginRequest,
    IReturnUser,
    logout,
    login,
    getUserProjects,
    createProject,
    uploadDocument,
    uploadGraph,
    getOneProject,
    deleteProject,
    deleteDocument,
    deleteResource,
    deleteGraph,
    processSession,
    uploadResource,
    createContainer,
    getContainerContent,
    uploadMetadataGraph
}