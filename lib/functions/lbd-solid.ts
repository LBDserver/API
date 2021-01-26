import fetch from 'node-fetch'
import v4 from 'uuid'
const util = require('util');
const validate = require('turtle-validator')
const mime = require('mime-types')

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

async function uploadGraph(url, data, session): Promise<void> {
    try {
        // check if graph does not exist yet
        const exists = await checkExistence(url)
        if (exists) {
            throw new Error("Resource already exists")
        }

        // check if data is turtle
        await validateTTL(data)

        var requestOptions = {
        method: 'PUT',
        headers: {
            "Content-Type": "text/turtle"
        },
        body: data.toString(),
        redirect: 'follow'
        };

        const response = await fetch(url, requestOptions)
        const text = await response.text()

        return
    } catch (error) {
        error.message = `Could not create graph - ${error.message}`
        throw error
    }
}

async function uploadDocument(url, data, session): Promise<void> {
    try {

        //content-type is guessed by url (default: text/plain)
        let mimetype = mime.lookup(url)
        if (mimetype === false) {
            mimetype = "text/plain"
        }

        var requestOptions = {
          method: 'PUT',
          headers: {
            "Content-Type": mimetype
          },
          body: data,
          redirect: 'follow'
        };
        
        fetch(url, requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));
    } catch (error) {
        error.message = `Could not upload document - ${error.message}`
        throw error
    }
}

async function uploadMetadataGraph(url, data, session): Promise<void> {
    try {
        if (!url.endsWith(".meta")) {
            url = url.concat('.meta')
        }
        const response = await uploadGraph(url, data, session)
        return response
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

function validateTTL(data) {
    return new Promise<void>((resolve, reject) => {
        validate(data, (fb) => {
            if (fb.warnings.length === 0 && fb.errors.length === 0) {
                resolve()
            } else {
                reject(fb)
            }
        })
    })
}

// getLbdLocation({webId: "http://jwerbrouck.consolidproject.be/profile/card#me"})

// checkExistence("https://jwerbrouck.inrupt.net/profile/card#me")
        // var fs = require('fs');
        // var data = fs.readFileSync('/home/jmauwerb/Pictures/5fav.JPG');
        // var file = Buffer.from(data);
        // uploadDocument("http://localhost:3000/qefmoizqj/zeeiee.jpg", file, null)