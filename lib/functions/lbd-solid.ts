import fetch from 'node-fetch'
import { v4 } from 'uuid'
import {URL} from 'url'
import {validateTTL, hasPermission} from '../helperfunctions'
import { IAgent } from '../interfaces/consolidInterface'
import { aclTemplate } from '../templates/aclTemplate'
import {Session} from '@inrupt/solid-client-authn-browser'

const newEngine = require('@comunica/actor-init-sparql').newEngine;

const mime = require('mime-types')

/////////////////////// USER FUNCTIONS //////////////////////////
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

async function createProject(metadata, stakeholders: Array<IAgent>, session: Session): Promise<void> {
    try {
        const myUrl = new URL(session.info.webId)

        // check if a dedicated folder exists for lbd projects (if not: create one)
        let lbdLocation = await getLbdLocation(session)
        if (!lbdLocation) {
            lbdLocation = `${myUrl.origin}/lbd/`
            await createContainer(lbdLocation, session)
        }

        // check if metadata is valid TTL
        await validateTTL(metadata)

        // create project ID
        const id = v4()

        // create metadata file in project directory (& create project directory in lbdlocation with the same request)
        await uploadResource(`${lbdLocation}${id}/.meta`, metadata, null, session)

        // create project acl in  project directory
        const acl = await aclTemplate(stakeholders)
        await uploadResource(`${lbdLocation}${id}/.acl`, acl, null, session)

        // invite agents and make aware of their role in the project


        // return project

    } catch (error) {
        error.message = `Could not create project - ${error.message}`
        throw error
    }
}

async function deleteProject(projectId: string,session: Session) {
    try {

    } catch (error) {
        error.message = `Could not delete project - ${error.message}`
        throw error
    }
}

async function getUserProjects(session: Session) {
    try {
        return
    } catch (error) {
        error.message = `Unable to get user projects - ${error.message}`
        throw error
    }
}

async function getOneProject(projectId: string, session: Session): Promise<void> {
    try {
        
    } catch (error) {
        error.message = `Unable to get project with ID ${projectId} - ${error.message}`
        throw error
    }
}

/////////////////////// RESOURCE FUNCTIONS //////////////////////
async function uploadResource(url: string, data: string, options, session: Session): Promise<void> {
        if (!options.overwrite) {
            // check if graph does not exist yet  
            const exists = await checkExistence(url)
            if (exists) {
                throw new Error("Resource already exists")
            }
        }

        //content-type is guessed by url (default: text/plain)
        let mimetype = mime.lookup(url)
        if (mimetype === false) {
            // set default mimetype
            mimetype = "text/plain"
        } else if (mimetype === "text/turtle") {
            // check if data is valid turtle
            await validateTTL(data)
        }

        var requestOptions = {
            method: 'PUT',
            headers: {
                "Content-Type": mimetype
            },
            body: data,
            redirect: 'follow' as RequestRedirect
        };

        const response = await session.fetch(url, requestOptions)
        const text = await response.text()
        return

}

async function uploadGraph(url, data, metadata, options, session: Session): Promise<void> {
    try {
        await validateTTL(metadata)
        await uploadResource(url, data, options, session)
        await uploadResource(url + '.meta', metadata, options, session)
        return
    } catch (error) {
        error.message = `Could not create graph - ${error.message}`
        throw error
    }
}

async function uploadDocument(url, data: Buffer | string, metadata: string, options, session: Session): Promise<void> {
    try {
        await validateTTL(metadata)
        await uploadResource(url, data, options, session)
        await uploadResource(url + ".meta", data, options, session)
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
          
          await fetch(url, requestOptions)
    } catch (error) {
        error.message = `Could not delete resource ${url} - ${error.message}`
        throw error
    }
}

async function deleteGraph(url, session: Session) {
    await deleteResource(url, session)
}

async function deleteDocument(url, session: Session) {
    await deleteResource(url, session)
}

async function createContainer(url, session: Session) {
    try {

        if (!url.endsWith("/")) {
            throw new Error('Url must end with a "/"')
        }

        const requestOptions = {
        method: 'PUT',
        headers: {
            "Content-Type": "text/turtle"
        },
        redirect: 'follow'
        };

        const response = await fetch(url, requestOptions)
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
                const q1 = await query(url, "prefix ldp: <http://www.w3.org/ns/ldp#> Select * where {?s a ldp:Container}", session)
                q1.forEach(container => {
                    const value = container.get("?s")
                    const val: string = value.id
                    containers.push(val)
                });

                if (!containers.includes(url)) {
                    throw new Error(`${url} is not recognised as a container.`)
                }
        
                const resources = []
                const q2 = await query(url, "prefix ldp: <http://www.w3.org/ns/ldp#> Select * where {?s a ldp:Resource . FILTER NOT EXISTS {?s a ldp:Container}}", session)
                q2.forEach(res => {
                    const value = res.get("?s")
        
                    // at this point - always true (placeholder)
                    if (!hasPermission(value.id, "http://www.w3.org/ns/auth/acl#Write")) {
                        throw Error(`No permission to delete this container`)
                    }
                    const val: string = value.id
                    resources.push(val)
                });

        return {containers, resources}

    } catch (error) {
        error.message = `Error fetching container content - ${error.message}`
        throw error
    }
}

async function uploadMetadataGraph(url, data, options, session: Session): Promise<void> {
    try {
        if (!url.endsWith(".meta")) {
            url = url.concat('.meta')
        }
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

async function query(resources: string[], query: string, session: Session): Promise<Array<Map<string, any>>> {
    try {
        const myEngine = newEngine();
        const result = await myEngine.query(query, { sources: resources });
        let bindings: Array<Map<string, any>> = await result.bindings();
        return bindings
    } catch (error) {
        error.message = `Could not query resource - ${error.message}`
        throw error
    }
}

///////////////////////////// HELPER FUNCTIONS //////////////////////////////////

/**
 * Get the location where LBD projects are stored. At this point, standard './lbd/' will be returned. Later phases may include more complex mechanisms such as Shape Tree discovery or Index Types. Authenticated sessions may thus be required in the future.
 * @param webId 
 */
async function getLbdLocation(session): Promise<string> {
    const url = new URL(session.info.webId)
    let lbdLocation: string = `${url.origin}/lbd/`
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
