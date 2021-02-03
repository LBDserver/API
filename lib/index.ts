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
    IQueryResult
} from './interfaces/projectInterface'

import {
    login,
    processSession,
    logout,
    register,

    createProject,
    deleteProject,
    getUserProjects,
    getOneProject,
    getOpenProjects,

    uploadResource,
    uploadGraph,
    uploadDocument,
    deleteResource,
    deleteGraph,
    deleteDocument,

    createContainer,
    getContainerContent,
    uploadMetadataGraph,

    query,
    getLbdLocation
}
 from './functions/lbd-solid'

export {
    ICreateProject,
    IReturnProject,
    IReturnMetadata,
    IReturnGraph,
    IQueryResult,
    IUser,
    IRegisterRequest,
    ILoginRequest,
    IReturnUser,
    login,
    processSession,
    logout,
    createProject,
    uploadDocument,
    uploadGraph,
    getOneProject,
    deleteProject,
    deleteDocument,
    deleteResource,
    deleteGraph,
    uploadResource,
    createContainer,
    getContainerContent,
    uploadMetadataGraph,
    getUserProjects,
    query,
    getOpenProjects,
    register,
    getLbdLocation
}