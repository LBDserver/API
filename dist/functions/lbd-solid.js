import fetch from 'node-fetch';
import { v4 } from 'uuid';
import { URL } from 'url';
import { validateTTL, hasPermission } from '../helperfunctions';
import { aclTemplate } from '../templates/aclTemplate';
import mime from 'mime-types';
const newEngine = require('@comunica/actor-init-sparql').newEngine;
/////////////////////// USER FUNCTIONS //////////////////////////
async function login(oidcIssuer, redirectUrl, session) {
    try {
        await session.login({
            oidcIssuer,
            redirectUrl
        });
        return session;
    }
    catch (error) {
        error.message = `Unable to login - ${error.message}`;
        throw error;
    }
}
async function processSession(session) {
    try {
        const authCode = new URL(window.location.href).searchParams.get("code");
        if (authCode) {
            console.log("Being redirected from the IdP");
            await session.handleIncomingRedirect(window.location.href);
        }
        return session;
    }
    catch (error) {
        error.message = `Unable to process session - ${error.message}`;
        throw error;
    }
}
async function logout(session) {
    try {
        await session.logout();
        return session;
    }
    catch (error) {
        error.message = `Unable to logout - ${error.message}`;
        throw error;
    }
}
/////////////////////// PROJECT FUNCTIONS ///////////////////////
async function createProject(metadata, stakeholders, session) {
    try {
        const myUrl = new URL(session.info.webId);
        // check if a dedicated folder exists for lbd projects (if not: create one)
        let lbdLocation = await getLbdLocation(session);
        if (!lbdLocation) {
            lbdLocation = `${myUrl.origin}/lbd/`;
            await createContainer(lbdLocation, session);
        }
        // check if metadata is valid TTL
        await validateTTL(metadata);
        // create project ID
        const id = v4();
        // create metadata file in project directory (& create project directory in lbdlocation with the same request)
        await uploadResource(`${lbdLocation}${id}/.meta`, metadata, null, session);
        // create project acl in  project directory
        const acl = await aclTemplate(stakeholders);
        await uploadResource(`${lbdLocation}${id}/.acl`, acl, null, session);
        // invite agents and make aware of their role in the project
        // return project
    }
    catch (error) {
        error.message = `Could not create project - ${error.message}`;
        throw error;
    }
}
async function deleteProject(projectId, session) {
    try {
    }
    catch (error) {
        error.message = `Could not delete project - ${error.message}`;
        throw error;
    }
}
async function getUserProjects(session) {
    try {
        return;
    }
    catch (error) {
        error.message = `Unable to get user projects - ${error.message}`;
        throw error;
    }
}
async function getOneProject(projectId, session) {
    try {
    }
    catch (error) {
        error.message = `Unable to get project with ID ${projectId} - ${error.message}`;
        throw error;
    }
}
/////////////////////// RESOURCE FUNCTIONS //////////////////////
async function uploadResource(url, data, options, session) {
    if (!options.overwrite) {
        // check if graph does not exist yet  
        const exists = await checkExistence(url);
        if (exists) {
            throw new Error("Resource already exists");
        }
    }
    //content-type is guessed by url (default: text/plain)
    let mimetype = mime.lookup(url);
    if (mimetype === false) {
        // set default mimetype
        mimetype = "text/plain";
    }
    else if (mimetype === "text/turtle") {
        // check if data is valid turtle
        await validateTTL(data);
    }
    var requestOptions = {
        method: 'PUT',
        headers: {
            "Content-Type": mimetype
        },
        body: data,
        redirect: 'follow'
    };
    const response = await session.fetch(url, requestOptions);
    const text = await response.text();
    return;
}
async function uploadGraph(url, data, metadata, options, session) {
    try {
        await validateTTL(metadata);
        await uploadResource(url, data, options, session);
        await uploadResource(url + '.meta', metadata, options, session);
        return;
    }
    catch (error) {
        error.message = `Could not create graph - ${error.message}`;
        throw error;
    }
}
async function uploadDocument(url, data, metadata, options, session) {
    try {
        await validateTTL(metadata);
        await uploadResource(url, data, options, session);
        await uploadResource(url + ".meta", data, options, session);
    }
    catch (error) {
        error.message = `Could not upload document - ${error.message}`;
        throw error;
    }
}
async function deleteResource(url, session) {
    try {
        var requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
        };
        await fetch(url, requestOptions);
    }
    catch (error) {
        error.message = `Could not delete resource ${url} - ${error.message}`;
        throw error;
    }
}
async function deleteGraph(url, session) {
    await deleteResource(url, session);
}
async function deleteDocument(url, session) {
    await deleteResource(url, session);
}
async function createContainer(url, session) {
    try {
        if (!url.endsWith("/")) {
            throw new Error('Url must end with a "/"');
        }
        const requestOptions = {
            method: 'PUT',
            headers: {
                "Content-Type": "text/turtle"
            },
            redirect: 'follow'
        };
        const response = await fetch(url, requestOptions);
        const text = await response.text();
    }
    catch (error) {
        error.message = `Unable to create container - ${error.message}`;
        throw error;
    }
}
async function getContainerContent(url, session) {
    try {
        // fetch all resources in the container
        const containers = [];
        const q1 = await query(url, "prefix ldp: <http://www.w3.org/ns/ldp#> Select * where {?s a ldp:Container}", session);
        q1.forEach(container => {
            const value = container.get("?s");
            const val = value.id;
            containers.push(val);
        });
        if (!containers.includes(url)) {
            throw new Error(`${url} is not recognised as a container.`);
        }
        const resources = [];
        const q2 = await query(url, "prefix ldp: <http://www.w3.org/ns/ldp#> Select * where {?s a ldp:Resource . FILTER NOT EXISTS {?s a ldp:Container}}", session);
        q2.forEach(res => {
            const value = res.get("?s");
            // at this point - always true (placeholder)
            if (!hasPermission(value.id, "http://www.w3.org/ns/auth/acl#Write")) {
                throw Error(`No permission to delete this container`);
            }
            const val = value.id;
            resources.push(val);
        });
        return { containers, resources };
    }
    catch (error) {
        error.message = `Error fetching container content - ${error.message}`;
        throw error;
    }
}
async function uploadMetadataGraph(url, data, options, session) {
    try {
        if (!url.endsWith(".meta")) {
            url = url.concat('.meta');
        }
        const response = await uploadResource(url, data, options, session);
        return response;
    }
    catch (error) {
        error.message = `Could not create metadata graph - ${error.message}`;
        throw error;
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
async function query(resources, query, session) {
    try {
        const myEngine = newEngine();
        const result = await myEngine.query(query, { sources: resources });
        let bindings = await result.bindings();
        return bindings;
    }
    catch (error) {
        error.message = `Could not query resource - ${error.message}`;
        throw error;
    }
}
///////////////////////////// HELPER FUNCTIONS //////////////////////////////////
/**
 * Get the location where LBD projects are stored. At this point, standard './lbd/' will be returned. Later phases may include more complex mechanisms such as Shape Tree discovery or Index Types. Authenticated sessions may thus be required in the future.
 * @param webId
 */
async function getLbdLocation(session) {
    const url = new URL(session.info.webId);
    let lbdLocation = `${url.origin}/lbd/`;
    const exists = await checkExistence(lbdLocation);
    if (exists) {
        return lbdLocation;
    }
    else {
        return null;
    }
}
async function checkExistence(graph) {
    try {
        const requestOptions = {
            method: 'HEAD'
        };
        const response = await fetch(graph, requestOptions);
        if (response.status === 200) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        error.message = `Could not check existence of graph ${graph} - ${error.message}`;
        throw error;
    }
}
// getLbdLocation({webId: "http://jwerbrouck.consolidproject.be/profile/card#me"})
// checkExistence("https://jwerbrouck.inrupt.net/profile/card#me")
// var fs = require('fs');
// var data = fs.readFileSync('/home/jmauwerb/Pictures/5fav.JPG');
// var file = Buffer.from(data);
// uploadDocument("http://localhost:3000/qefmoizqj/zeeiee.jpg", file, null)
export { login, processSession, logout, createProject, deleteProject, getUserProjects, getOneProject, uploadResource, uploadGraph, uploadDocument, deleteResource, deleteGraph, deleteDocument, createContainer, getContainerContent, uploadMetadataGraph, query };
