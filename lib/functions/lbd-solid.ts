import fetch from 'node-fetch'
import { v4 } from 'uuid'
import {validateTTL, hasPermission} from '../helperfunctions'
import { IAgent, PermissionType } from '../interfaces/consolidInterface'
import { aclTemplate, stakeholderTemplate } from '../templates'
import {Session} from '@inrupt/solid-client-authn-browser'
import mime from 'mime-types'
import { ICreateProject, IQueryResult, IReturnMetadata, IReturnProject, IReturnResources } from '../interfaces/projectInterface'

import {query as queryJS} from '../helperfunctions/query'

import {QueryEngineComunicaSolid} from "graphql-ld-comunica-solid";
import { Operation } from 'sparqlalgebrajs/lib/algebra'

const newEngine = require('@comunica/actor-init-sparql').newEngine;
const URL = (typeof window !== 'undefined' && window.URL)
  ? window.URL : require('url').URL

/////////////////////// USER FUNCTIONS //////////////////////////

/**
 * Log in using OIDC and a Solid Session.
 * @param {string} oidcIssuer uri for the OIDC issuer. E.g. 'https://broker.pod.inrupt.com'.
 * @param {string} redirectUrl uri for redirect after login via OIDC. E.g. window.location.href. to return to the original page.
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
 * @param {string} oidcIssuer uri for the OIDC issuer. E.g. 'https://broker.pod.inrupt.com'.
 * @param {string} redirecturi uri for redirect after login via OIDC. E.g. window.location.href. to return to the original page.
 * @param {Session} session The solid session object. Will be returned, but if successful, the session will be authenticated and linked to the logged in user/webID.
 * @returns {Promise<Session>} Returns a Solid Session object
 */
async function register(oidcIssuer: string, redirecturi: string, session: Session): Promise<Session> {
    try {
        throw new Error(`not implemented in Solid LBD server environment`)
    } catch (error) {
        error.message = `Unable to register - ${error.message}`
        throw error
    }
}

/**
 * Helper function to process the session after OIDC login. Retrieves the "code" from the current uri.
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
 * Create a new project environment. As the project ID is created here, the project metadata graph (.props) should be created afterwards (createGraph)
 * @param {Array<IAgent>} stakeholders Array of stakeholders to be involved in the project, as well as their access rights to the project in general.
 * @param {Session} session The Solid Session object. 
 * @returns {Promise<ICreateProject>}
 */
async function createProject(stakeholders: Array<IAgent>, session: Session): Promise<ICreateProject> {
    try {
        // whenever CSS is an ID provider as well ...
        // const myuri = new URL(session.info.webId)

        // for now: 
        const myuri = new URL('http://localhost:3000')

        // check if a dedicated folder exists for lbd projects (if not: create one)
        let lbdLocation = await getLbdLocation(session.info.webId, session)
        if (!lbdLocation) {
            lbdLocation = `${myuri.origin}/lbd/`
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

/**
 * Delete an LBD project. The project will only be deleted in your own POD, of course.
 * @param {string} uri The uri of the project to delete in your repository. 
 * @param {Session} session The Solid Session object. 
 * @returns {Promise<void>}
 */
async function deleteProject(uri: string,session: Session): Promise<void> {
    try {
        const {containers, resources} = await getContainerContent(uri, session)
        for (const container of containers) {
            if (container !== uri) {
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
        await deleteResource(uri, session)
        return
    } catch (error) {
        error.message = `Could not delete project - ${error.message}`
        throw error
    }
}

/**
 * Get all the LBD projects in the POD of the authenticated user.
 * @param {Session} session The Solid Session object. 
 * @returns {Promise<IReturnProject[]>}
 */
async function getUserProjects(session: Session): Promise<IReturnProject[]> {
    try {
        const lbdLocation = await getLbdLocation(session.info.webId, session)
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

/**
 * Get a single project by its uri. From your local project, other stakeholders are determined and the federated project data you have access to is fetched. 
 * @param {string} uri The uri of the project. 
 * @param {Session} session The Solid Session object. 
 * @returns {Promise<IReturnProject>}
 */
async function getOneProject(uri: string, session: Session): Promise<IReturnProject> {
    try {
        // get the information the authenticated agent himself has about the project (e.g. to fetch the other stakeholders)
        const project: IReturnProject = await getLocalProject(uri, session)
        // fetch stakeholder list locally
        const stakeholderList = await query("PREFIX lbd: <http://lbdserver.org/vocabulary/> SELECT ?st WHERE {?st a lbd:Stakeholder}", [`${uri}stakeholders.ttl`], session)

        for (const st of stakeholderList) {
            const webId = st["st"].value
            if (webId !== session.info.webId) {
                try {
                    const projectLocation = await getLbdLocation(webId, session)
                    const {graphs, documents} = await getLocalProject(`${projectLocation}${project.id}/`, session)
                    project.graphs = {...project.graphs, ...graphs}
                    project.documents = {...project.documents, ...documents}
                } catch (error) {
                    error.message = `Could not retrieve project data from ${webId} - ${error.message}`
                }
            }            
        }

        return project
    } catch (error) {
        error.message = `Unable to get project with uri ${uri} - ${error.message}`
        throw error
    }
}

/**
 * Get only the project data residing in your POD.
 * @param {string} uri The uri of the project. 
 * @param {Session} session The Solid Session object. 
 * @returns {Promise<IReturnProject>}
 */
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
        error.message = `Unable to get local project with uri ${uri} - ${error.message}`
        throw error
    }
}

/**
 * Gets only the graphs and documents, without other project info (i.e. their metadata & permissions)
 * @param {string} uri The uri of the project. 
 * @param {Session} session The Solid Session object. 
 * @returns {Promise<IReturnResources>}
 */
async function getProjectResources(uri, session): Promise<IReturnResources> {
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
        error.message = `Unable to get local project with uri ${uri} - ${error.message}`
        throw error
    }
}

/**
 * Get the open projects on a specific LBDlocation.
 * @param {string} lbdLocation The LBD project location to search for open projects
 * @returns {Promise<IReturnProject[]>}
 */
async function getOpenProjects(lbdLocation): Promise<IReturnProject[]> {
    try {
        const session = new Session()
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
        error.message = `Could not get open projects at LBDlocation ${lbdLocation} - ${error.message}`
        throw error
    }
}

/////////////////////// RESOURCE FUNCTIONS //////////////////////
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
async function uploadResource(url: string, data: Buffer | string, options: {overwrite?: boolean, mimeType?: string}, session: Session): Promise<void> {
    try {
        if (!options.overwrite) {
            // check if graph does not exist yet  
            const exists = await checkExistence(url, session)
            if (exists) {
                throw new Error("Resource already exists")
            }
        }

        //content-type is guessed by uri (default: text/plain)
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

        await session.fetch(url, requestOptions)
        return
    } catch (error) {
        error.message = `Unable to upload resource - ${error.message}`
        throw error
    }
}

/**
 * Get a resource actual data.
 * @param {string} uri The uri of the project. 
 * @param {Session} session The Solid Session object. 
 * @returns {Promise<any>}
 */
async function getResource(uri: string, session: Session): Promise<any> {
    try {
        const resource = await session.fetch(uri)
        return resource
    } catch (error) {
        error.message = `Unable to fetch resource with uri ${uri} - ${error.message}`
        throw error
    }
}

/**
 * Get a resource's metadata
 * @param {string} uri The uri of the project. 
 * @param {Session} session The Solid Session object. 
 * @returns {Promise<IReturnMetadata>}
 */
async function getResourceMetadata(uri: string, session: Session): Promise<IReturnMetadata> {
    try {
        const permissions = await getPermissions(uri, session)
        if (!permissions.includes("http://www.w3.org/ns/auth/acl#Read")) {
            throw new Error(`No acl:Read rights for resource with uri ${uri}`)
        }

        const metadataRaw = await session.fetch(`${uri}.props`)
        const metadata = await metadataRaw.text()
        return {metadata, permissions}
    
    } catch (error) {
        error.message = `Unable to fetch resource with uri ${uri} - ${error.message}`
        throw error
    }
}

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
async function uploadGraph(url: string, data: Buffer | string, metadata: string, options: {overwrite: boolean, mimeType: string}, session: Session): Promise<IReturnMetadata> {
    try {
        await validateTTL(metadata)
        await uploadResource(url, data, options, session)
        await uploadResource(url + '.props', metadata, {...options, mimeType: "text/turtle"}, session)

        return {metadata, permissions: ["http://www.w3.org/ns/auth/acl#Read", "http://www.w3.org/ns/auth/acl#Write", "http://www.w3.org/ns/auth/acl#Append", "http://www.w3.org/ns/auth/acl#Control"]}
    } catch (error) {
        error.message = `Could not create graph - ${error.message}`
        throw error
    }
}

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
async function uploadDocument(url, data: Buffer | string, metadata: string, options: {overwrite: boolean, mimeType: string}, session: Session): Promise<IReturnMetadata> {
    try {
        await validateTTL(metadata)
        await uploadResource(url, data, options, session)
        await uploadResource(url + '.props', metadata, {...options, mimeType: "text/turtle"}, session)
        return {metadata, permissions: ["http://www.w3.org/ns/auth/acl#Read", "http://www.w3.org/ns/auth/acl#Write", "http://www.w3.org/ns/auth/acl#Append", "http://www.w3.org/ns/auth/acl#Control"]}
    } catch (error) {
        error.message = `Could not upload document - ${error.message}`
        throw error
    }
}

/**
 * Delete a resource
 * @param {string} url The url of the resource to be deleted
 * @param {Session} session The Solid session object
 * @returns {Promise<void>}
 */
async function deleteResource(url: string, session: Session): Promise<void> {
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


/**
 * Delete an RDF resource and its metadata
 * @param {string} url The url of the resource to be deleted
 * @param {Session} session The Solid session object
 * @returns {Promise<void>}
 */
async function deleteGraph(url, session: Session): Promise<void> {
    await deleteResource(url, session)
    await deleteResource(url + '.props', session)
}

/**
 * Delete an non-RDF resource and its metadata
 * @param {string} url The url of the resource to be deleted
 * @param {Session} session The Solid session object
 * @returns {Promise<void>}
 */
async function deleteDocument(url, session: Session): Promise<void> {
    await deleteResource(url, session)
    await deleteResource(url + '.props', session)
}

/**
 * Create a container with a given url
 * @param {string} url The url of the container to be created
 * @param {Session} session The Solid session object
 * @returns {Promise<void>}
 */
async function createContainer(url: string, session: Session): Promise<void> {
    try {

        if (!url.endsWith("/")) {
            url = url.concat('/')
        }

        const requestOptions: RequestInit = {
        method: 'PUT',
        headers: {
            "Content-Type": "text/turtle"
        },
        redirect: 'follow'
        };

        await session.fetch(url, requestOptions)
        return
    } catch (error) {
        error.message = `Unable to create container - ${error.message}`
        throw error
    }
}

/**
 * Get the content of the container as an object with a list of resources and subcontainers.
 * @param {string} url The url of the container
 * @param {Session} session The Solid session object
 * @returns {Promise<{containers: string[], resources: string[]}>}
 */
async function getContainerContent(url: string, session: Session): Promise<{containers: string[], resources: string[]}> {
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
async function uploadMetadataGraph(url: string, data: string, options: {overwrite: boolean, mimeType: string}, session: Session): Promise<void> {
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

///////////////////////////// QUERY FUNCTIONS //////////////////////////////
/**
 * Query (SPARQL SELECT) a (set of) resource(s) with Comunica. As for now, only openly accessible graphs (i.e. Read permissions) can be queried
 * @param {string} query The SPARQL query string
 * @param {string[]} graphs The resources to be queried as an Array
 * @param {Session} session The Solid session object
 * @returns {Promise<IQueryResult[]>}
 */
async function query(query: string, graphs: string[], session: Session): Promise<IQueryResult[]> {
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

/**
 * Get the permissions for a specific resource. Placeholder until implemented (depends on authenticated or not). Only for UI purposes.
 * @param {string} url The url 
 * @param {Session} session The Solid session object
 * @returns {Promise<PermissionType[]>}
 */
async function getPermissions(uri: string, session: Session): Promise<PermissionType[]> {
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
        error.message = `Unable to get permissions for resource ${uri} - ${error.message}`
        throw error
    }
}

///////////////////////////// HELPER FUNCTIONS //////////////////////////////////

/**
 * Get the location where LBD projects are stored. At this point, standard './lbd/' will be returned. Later phases may include more complex mechanisms such as Shape Tree discovery or Index Types. Authenticated sessions may thus be required in the future.
 * @param {string} webId The web id to find the LBD location for.
 * @param {Session} session The Solid session object
 * @returns {Promise<string>}
 */
async function getLbdLocation(webId: string, session: Session): Promise<string> {
    let lbdLocation: string
    // const uri = new uri(session.info.webId)
    // lbdLocation: string = `${uri.origin}/lbd/`

    // until CSS is a provider
    lbdLocation = 'http://localhost:3000/lbd/'

    const exists = await checkExistence(lbdLocation, session)
    if (exists) {
        return lbdLocation
    } else {
        return null
    }
}

/**
 * Check the existence of a resource (HEAD request to the given URL)
 * @param {string} url The url of the resource
 * @param {Session} session The Solid session object 
 * @returns {Promise<boolean>}
 */
async function checkExistence(url: string, session: Session): Promise<boolean> {
    try {
        const requestOptions = {
            method: 'HEAD'
        };
        const response = await session.fetch(url, requestOptions)
        if (response.status === 200) {
            return true
        } else {
            return false
        }
    } catch (error) {
        error.message = `Could not check existence of graph ${url} - ${error.message}`
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
