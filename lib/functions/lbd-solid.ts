import fetch from 'node-fetch'
import v4 from 'uuid'
async function createProject(metadata, session) {
    try {
        const myUrl = new URL(session.webId)

        // check if a dedicated folder exists for lbd projects (if not: create one)
        let lbdLocation = await getLbdLocation(session)
        if (!lbdLocation) {
            lbdLocation = await createLbdLocation(session, `${myUrl.origin}/lbd/`)
        }

        // create project ID
        const id = v4()

        // 
        // 

        // return project
    } catch (error) {
        error.message = `Could not create project - ${error.message}`
        throw error
    }
}

async function createGraph() {
    try {
        // check if graph does not exist yet
        // await checkExistence()

    } catch (error) {
        error.message = `Could not create graph - ${error.message}`
        throw error
    }
}

async function createMetadataGraph() {
    try {
        
    } catch (error) {
        error.message = `Could not create metadata graph - ${error.message}`
        throw error
    }
}

async function query(resource, query, session) {
    try {
        
    } catch (error) {
        error.message = `Could not query resource - ${error.message}`
        throw error
    }
}

async function queryMultiple(resources, query, session) {
    try {
        
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
    const url = new URL(session.webId)
    let  lbdLocation: string = `${url.origin}/lbd/`
    const exists = await checkExistence(lbdLocation)
    if (exists) {
        return lbdLocation
    } else {
        return null
    }
}

async function createLbdLocation(session, location: string): Promise<string> {
    try {
        

        return location
    } catch (error) {
        error.message = `Could not create LBD location - ${error.message}`
        throw error
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
        throw error    }
}

// getLbdLocation({webId: "http://jwerbrouck.consolidproject.be/profile/card#me"})

checkExistence("https://jwerbrouck.inrupt.net/profile/card#me")