import fetch from 'node-fetch'
import { v4 } from 'uuid'
import {validateTTL, hasPermission} from '../helperfunctions'
import { IAgent, PermissionType } from '../interfaces/consolidInterface'
import { aclTemplate, stakeholderTemplate } from '../templates'
import {Session} from '@inrupt/solid-client-authn-browser'
import mime from 'mime-types'
import { IReturnMetadata, IReturnProject } from '../interfaces/projectInterface'

import {query as queryJS} from '../helperfunctions/query'

import {QueryEngineComunicaSolid} from "graphql-ld-comunica-solid";
import { Operation } from 'sparqlalgebrajs/lib/algebra'

const newEngine = require('@comunica/actor-init-sparql').newEngine;
const URL = (typeof window !== 'undefined' && window.URL)
  ? window.URL : require('url').URL

/////////////////////// USER FUNCTIONS //////////////////////////

/**
 * Log in using OIDC and a Solid Session.
 * @param {string} oidcIssuer URL for the OIDC issuer. E.g. 'https://broker.pod.inrupt.com'.
 * @param {string} redirectUrl URL for redirect after login via OIDC. E.g. window.location.href. to return to the original page.
 * @param {Session} session The solid session object. Will be returned, but if successful, the session will be authenticated and linked to the logged in user/webID.
 * @returns {Promise<Session>} Returns a Solid Session object
 */
async function login(oidcIssuer: string, redirectUrl: string, session: Session): Promise<Session> {
    try {
        await session.login({
            oidcIssuer,
            redirectUrl
        })
        return session
    } catch (error) {
        error.message = `Unable to login - ${error.message}`
        throw error
    }
}

/////////////////////// USER FUNCTIONS //////////////////////////

/**
 * Log in using OIDC and a Solid Session.
 * @param {string} oidcIssuer URL for the OIDC issuer. E.g. 'https://broker.pod.inrupt.com'.
 * @param {string} redirectUrl URL for redirect after login via OIDC. E.g. window.location.href. to return to the original page.
 * @param {Session} session The solid session object. Will be returned, but if successful, the session will be authenticated and linked to the logged in user/webID.
 * @returns {Promise<Session>} Returns a Solid Session object
 */
async function register(oidcIssuer: string, redirectUrl: string, session: Session): Promise<Session> {
    try {
        throw new Error(`not implemented in Solid LBD server environment`)
    } catch (error) {
        error.message = `Unable to register - ${error.message}`
        throw error
    }
}

/**
 * Helper function to process the session after OIDC login. Retrieves the "code" from the current url.
 * @param {Session} session The Solid Session object. 
 * @returns {Promise<Session>} Returns a Solid Session object
 */
async function processSession(session: Session): Promise<Session> {
    try {
        const authCode = new URL(window.location.href).searchParams.get("code");
        if (authCode) {
          console.log("Being redirected from the IdP");
          await session.handleIncomingRedirect(window.location.href)
        }
        return session
    } catch (error) {
        error.message = `Unable to process session - ${error.message}`
        throw error
    }
}

/**
 * Log out from a Solid Session.
 * @param {Session} session The Solid Session object. 
 * @returns {Promise<Session>} Returns a Solid Session object
 */
async function logout(session: Session): Promise<Session> {
    try {
        await session.logout()
        return session
    } catch (error) {
        error.message = `Unable to logout - ${error.message}`
        throw error
    }
}


/////////////////////// PROJECT FUNCTIONS ///////////////////////
/**
 * 
 * @param {string} metadata a valid TTL string for the metadata of the project. Should contain default metadata such as rdfs:label, rdfs:comment. NOTE: in later versions, will be checked with SHACL shape
 * @param {Array<IAgent>} stakeholders Array of stakeholders to be involved in the project, as well as their access rights to the project in general.
 * @param {Session} session 
 */
async function createProject(stakeholders: Array<IAgent>, session: Session): Promise<any> {
    try {
        // whenever CSS is an ID provider as well ...
        // const myUrl = new URL(session.info.webId)

        // for now: 
        const myUrl = new URL('http://localhost:3000')

        // check if a dedicated folder exists for lbd projects (if not: create one)
        let lbdLocation = await getLbdLocation(session.info.webId)
        if (!lbdLocation) {
            lbdLocation = `${myUrl.origin}/lbd/`
            await createContainer(lbdLocation, session)
        }

        const id = v4()

        // create project acl in  project directory
        const acl = await aclTemplate(stakeholders)
        await uploadResource(`${lbdLocation}${id}/.acl`, acl, {mimeType: "text/turtle"}, session)

        const stakeholderGraph = await stakeholderTemplate(stakeholders)
        await uploadResource(`${lbdLocation}${id}/stakeholders.ttl`, stakeholderGraph, {mimeType: "text/turtle"}, session)
        
        await createContainer(`${lbdLocation}${id}/files/`, session)
        await createContainer(`${lbdLocation}${id}/graphs/`, session)

        // invite agents and make aware of their role in the project
        let permissions = []
        stakeholders.forEach(st => {
            if (st.uri === session.info.webId) {
                permissions =  st.permissions
            }
        })

        // return project
        const project = {
            id,
            permissions,
            uri: lbdLocation + id + '/',
            graphs: {},
            documents: {},
        }

        return project
    } catch (error) {
        error.message = `Could not create project - ${error.message}`
        throw error
    }
}

async function deleteProject(url: string,session: Session): Promise<void> {
    try {
        const {containers, resources} = await getContainerContent(url, session)
        for (const container of containers) {
            if (container !== url) {
                const {containers, resources} = await getContainerContent(container, session)
                for (const res of resources) {
                    await deleteResource(res, session)
                }
                await deleteResource(container, session)
            }
        }
        for (const res of resources) {
            await deleteResource(res, session)
        }
        await deleteResource(url, session)
        return
    } catch (error) {
        error.message = `Could not delete project - ${error.message}`
        throw error
    }
}

// interface IReturnProject {
//     metadata: string;
//     id: string;
//     uri: string;
//     graphs: IResourceObject;
//     documents: IResourceObject;
//     permissions: string[];
//     results?: IQueryResults;
// }

async function getUserProjects(session: Session): Promise<IReturnProject[]> {
    try {
        const lbdLocation = await getLbdLocation(session.info.webId)
        const {containers, resources} = await getContainerContent(lbdLocation, session)
        const projects = []
        for (const container of containers) {
            if (container !== lbdLocation) {
                const project = await getOneProject(container, session)
                projects.push(project)
            }
        }
        return projects

    } catch (error) {
        error.message = `Unable to get user projects - ${error.message}`
        throw error
    }
}

async function getOneProject(uri: string, session: Session): Promise<IReturnProject> {
    try {
        // get the information the authenticated agent himself has about the project (e.g. to fetch the other stakeholders)
        const project: IReturnProject = await getLocalProject(uri, session)
        // fetch stakeholder list locally
        const stakeholderList = await query("PREFIX lbd: <http://lbdserver.org/vocabulary/> SELECT ?st WHERE {?st a lbd:Stakeholder}", [`${uri}stakeholders.ttl`], session)

        for (const st of stakeholderList) {
            const webId = st["st"].value
            if (webId !== session.info.webId) {
                const projectLocation = await getLbdLocation(webId)
                const {graphs, documents} = await getLocalProject(`${projectLocation}${project.id}/`, session)
                project.graphs = {...project.graphs, ...graphs}
                project.documents = {...project.documents, ...documents}
            }            
        }

        return project
    } catch (error) {
        error.message = `Unable to get project with url ${uri} - ${error.message}`
        throw error
    }
}

async function getLocalProject(uri: string, session: Session): Promise<IReturnProject> {
    try {
        const id = uri.split('/')[uri.split('/').length - 2]
        const {graphs, documents} = await getProjectResources(uri, session)
        const {metadata, permissions} = await getResourceMetadata(uri, session)

        const project: IReturnProject = {
            id,
            uri,
            metadata,
            permissions,
            graphs,
            documents
        }
        
        return project
    } catch (error) {
        error.message = `Unable to get local project with url ${uri} - ${error.message}`
        throw error
    }
}

async function getProjectResources(uri, session): Promise<{graphs: {[x:string]: any}, documents: {[x:string]: any}}> {
    try {
        const id = uri.split('/')[uri.split('/').length - 2]
        const {resources: fileList} = await getContainerContent(`${uri}files/`, session)
        const {resources: graphList} = await getContainerContent(`${uri}graphs/`, session)

        const graphs = {}
        for (const graph of graphList) {
            try {
                if (!graph.endsWith('.props')) {
                    graphs[graph] = await getResourceMetadata(graph, session)
                }
            } catch (error) {
                console.log(error)
            }
        }

        const documents = {}
        for (const file of fileList) {
            try {
                if (!file.endsWith('.props')) {
                    documents[file] = await getResourceMetadata(file, session)
                }
            } catch (error) {
                console.log(error)
            }
        }

        const projectResources = {
            graphs,
            documents
        }

        return projectResources
    } catch (error) {
        error.message = `Unable to get local project with url ${uri} - ${error.message}`
        throw error
    }
}

async function getOpenProjects() {
    try {
        const session = new Session()
        const lbdLocation = "http://localhost:3000/lbd/"
        const {containers} = await getContainerContent(lbdLocation, session)
        const projects = []
        for (const container of containers) {

            if (container !== lbdLocation) {
                const project = await getOneProject(container, session)
                projects.push(project)
            }
        }
        return projects
    } catch (error) {
        error.message = `Could not get open projects - ${error.message}`
        throw error
    }
}

/////////////////////// RESOURCE FUNCTIONS //////////////////////
async function uploadResource(url: string, data: Buffer | string, options, session: Session): Promise<void> {
        if (!options.overwrite) {
            // check if graph does not exist yet  
            const exists = await checkExistence(url)
            if (exists) {
                throw new Error("Resource already exists")
            }
        }

        //content-type is guessed by url (default: text/plain)
        let mimeType
        if (!options.mimeType) {
            mimeType = mime.lookup(url)
            if (mimeType === false) {
                // set default mimetype
                mimeType = "text/plain"
            }
        } else {
            mimeType = options.mimeType
        }

        // if (mimeType === "text/turtle") {
        //     // check if data is valid turtle
        //     await validateTTL(data)
        // }

        var requestOptions = {
            method: 'PUT',
            headers: {
                "Content-Type": mimeType
            },
            body: data,
            redirect: 'follow' as RequestRedirect
        };

        const response = await session.fetch(url, requestOptions)
        const text = await response.text()
        return

}

async function getResource(url: string, session: Session) {
    try {
        const resource = await session.fetch(url)
        return resource
    } catch (error) {
        error.message = `Unable to fetch resource with url ${url} - ${error.message}`
        throw error
    }
}

async function getResourceMetadata(url: string, session: Session) {
    try {
        const permissions = await getPermissions(url, session)
        if (!permissions.includes("http://www.w3.org/ns/auth/acl#Read")) {
            throw new Error(`No acl:Read rights for resource with url ${url}`)
        }

        const metadataRaw = await session.fetch(`${url}.props`)
        const metadata = await metadataRaw.text()
        return {metadata, permissions}
    
    } catch (error) {
        error.message = `Unable to fetch resource with url ${url} - ${error.message}`
        throw error
    }
}


async function uploadGraph(url, data, metadata, options, session: Session): Promise<IReturnMetadata> {
    try {
        await validateTTL(metadata)
        await uploadResource(url, data, options, session)
        await uploadResource(url + '.props', metadata, {...options, mimeType: "text/turtle"}, session)

        return {uri: url, metadata, permissions: ["http://www.w3.org/ns/auth/acl#Read", "http://www.w3.org/ns/auth/acl#Write", "http://www.w3.org/ns/auth/acl#Append", "http://www.w3.org/ns/auth/acl#Control"]}
    } catch (error) {
        error.message = `Could not create graph - ${error.message}`
        throw error
    }
}

async function uploadDocument(url, data: Buffer | string, metadata: string, options, session: Session): Promise<IReturnMetadata> {
    try {
        await validateTTL(metadata)
        await uploadResource(url, data, options, session)
        await uploadResource(url + '.props', metadata, {...options, mimeType: "text/turtle"}, session)
        return {uri: url, metadata, permissions: ["http://www.w3.org/ns/auth/acl#Read", "http://www.w3.org/ns/auth/acl#Write", "http://www.w3.org/ns/auth/acl#Append", "http://www.w3.org/ns/auth/acl#Control"]}
    } catch (error) {
        error.message = `Could not upload document - ${error.message}`
        throw error
    }
}

async function deleteResource(url, session: Session): Promise<void> {
    try {
        var requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
          };
          
          await session.fetch(url, requestOptions as RequestInit)
    } catch (error) {
        error.message = `Could not delete resource ${url} - ${error.message}`
        throw error
    }
}

async function deleteGraph(url, session: Session): Promise<void> {
    await deleteResource(url, session)
    await deleteResource(url + '.props', session)
}

async function deleteDocument(url, session: Session): Promise<void> {
    await deleteResource(url, session)
    await deleteResource(url + '.props', session)
}

async function createContainer(url, session: Session): Promise<void> {
    try {

        if (!url.endsWith("/")) {
            throw new Error('Url must end with a "/"')
        }

        const requestOptions: RequestInit = {
        method: 'PUT',
        headers: {
            "Content-Type": "text/turtle"
        },
        redirect: 'follow'
        };

        const response = await session.fetch(url, requestOptions)
        const text = await response.text()
    } catch (error) {
        error.message = `Unable to create container - ${error.message}`
        throw error
    }
}

async function getContainerContent(url, session): Promise<{containers: string[], resources: string[]}> {
    try {
                // fetch all resources in the container
                const containers = []
                const q1 = await query("prefix ldp: <http://www.w3.org/ns/ldp#> Select * where {?s a ldp:Container}", [url], session)
                q1.forEach(container => {
                    const value = container['s'].value
                    containers.push(value)
                });

                if (!containers.includes(url)) {
                    throw new Error(`${url} is not recognised as a container.`)
                }
        
                const resources = []
                const q2 = await query("prefix ldp: <http://www.w3.org/ns/ldp#> Select * where {?s a ldp:Resource . FILTER NOT EXISTS {?s a ldp:Container}}", [url], session)
                q2.forEach(res => {
                    const value = res.s.value
        
                    // at this point - always true (placeholder)
                    if (!hasPermission(value, "http://www.w3.org/ns/auth/acl#Write")) {
                        throw Error(`No permission to delete this container`)
                    }
                    resources.push(value)
                });

        return {containers, resources}

    } catch (error) {
        error.message = `Error fetching container content - ${error.message}`
        throw error
    }
}

async function uploadMetadataGraph(url, data, options, session: Session): Promise<void> {
    try {
        if (!url.endsWith(".props")) {
            url = url.concat('.props')
        }
        await validateTTL(data)
        const response = await uploadResource(url, data, options, session)
        return response
    } catch (error) {
        error.message = `Could not create metadata graph - ${error.message}`
        throw error
    }
}

// async function deleteContainer(url, session): Promise<void> {
//     try {
//         const {containers, resources} = await getContainerContent(url, session)
//         if (containers.length === 1) {
//             // check if permissions are present
//             for (const res of resources) {
//                 // at this point - always true (placeholder)
//                 if (!hasPermission(res, "http://www.w3.org/ns/auth/acl#Write")) {
//                     throw Error(`No permission to delete resources ${res}`)
//                 }
//             }
//             // check if permissions are present
//             for (const res of resources) {
//                 await deleteResource(res, session)
//             }

//             await deleteResource(containers[0], session)
//             return
//         } else {
//             for (const container of containers) {
//                 await deleteContainer(container, session)
//             }
//         }
//     } catch (error) {
//         error.message = `Could not delete graph ${url} - ${error.message}`
//         throw error
//     }
// }

// deleteContainer("http://localhost:3000/lbd/", null)

///////////////////////////// QUERY FUNCTIONS //////////////////////////////

async function query(query: string, graphs: string[], session: Session): Promise<any> {
    try {
        // const myEngine = newEngine();

        // const result = await myEngine.query(query, { sources: graphs, fetch: session.fetch });
        // let bindings: Array<Map<string, any>> = await result.bindings();
        // myEngine.invalidateHttpCache()
        

        // const client = new QueryEngineComunicaSolid({sources: graphs})
        // const res = await client.query({query, type: "distinct"})

        // console.log('res', res)
        const bindings = await queryJS(query, graphs, session)

        return bindings
    } catch (error) {
        error.message = `Could not query resource - ${error.message}`
        throw error
    }
}

async function getPermissions(url: string, session: Session): Promise<PermissionType[]> {
    try {
        // until we have proper functionality for getting my access rights (dev mode)
        let permissions
        if (session.info.webId) {
            permissions = ["http://www.w3.org/ns/auth/acl#Read", "http://www.w3.org/ns/auth/acl#Write", "http://www.w3.org/ns/auth/acl#Append", "http://www.w3.org/ns/auth/acl#Control"] as PermissionType[]
        } else {
            permissions = ["http://www.w3.org/ns/auth/acl#Read"] as PermissionType[]
        }
        return permissions
    } catch (error) {
        error.message = `Unable to get permissions for resource ${url} - ${error.message}`
        throw error
    }
}

///////////////////////////// HELPER FUNCTIONS //////////////////////////////////

/**
 * Get the location where LBD projects are stored. At this point, standard './lbd/' will be returned. Later phases may include more complex mechanisms such as Shape Tree discovery or Index Types. Authenticated sessions may thus be required in the future.
 * @param webId 
 */
async function getLbdLocation(webId): Promise<string> {
    let lbdLocation: string
    // const url = new URL(session.info.webId)
    // lbdLocation: string = `${url.origin}/lbd/`

    // until CSS is a provider
    lbdLocation = 'http://localhost:3000/lbd/'

    const exists = await checkExistence(lbdLocation)
    if (exists) {
        return lbdLocation
    } else {
        return null
    }
}

async function checkExistence(graph): Promise<boolean> {
    try {
        const requestOptions = {
            method: 'HEAD'
        };
        const response = await fetch(graph, requestOptions)
        if (response.status === 200) {
            return true
        } else {
            return false
        }
    } catch (error) {
        error.message = `Could not check existence of graph ${graph} - ${error.message}`
        throw error
    }
}

export {
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

    getLbdLocation,

    query
}
