import axios from 'axios'
import * as USER from "../interfaces/userInterface"
import * as PROJECT from '../interfaces/projectInterface'
import * as AXIOS from 'axios'
import { translate, toSparql } from 'sparqlalgebrajs'

/**
 * 
 * @class {Object} User
 * @property {string} username
 * @property {string} email
 * @property {string[]} projects
 * @property {string} uri
 */

/**
 * 
 * @class {Object} returnUser
 * @property {User} user
 * @property {string} token
 */

//////////////////// PROJECT FUNCTIONS ////////////////////
/**
 * Register as a user to the local LBDserver (backend defined in process.env.REACT_APP_BACKEND).
 * @param {string} username Your username will be used to create a webID (personal URL) that can be used for access control in a Linked Data world. Should be unique.
 * @param {string} email Your e-mail address. Should be unique.
 * @param {string} password Your LBDserver passsword.
 * @returns {Promise<returnUser>} Returns a User object and a token.
 */
async function register(username: string, email: string, password: string): Promise<USER.IReturnUser> {
  try {
    const response: AXIOS.AxiosResponse = await axios.post(`${process.env.REACT_APP_BACKEND}/register`, {
      username,
      password,
      email,
    });

    const data: USER.IReturnUser = response.data
    return data

  } catch (error) {
    error.message = `Unable to register; ${error.message}`
    throw error
  }
}

/**
 * Login as an existing user to the LBDserver (backend defined in process.env.REACT_APP_BACKEND)
 * @param {string} email Your e-mail address.
 * @param {string} password Your LBDserver password.
 */
async function login(email: string, password: string): Promise<USER.IReturnUser> {
  try {
    const response: AXIOS.AxiosResponse = await axios.post(`${process.env.REACT_APP_BACKEND}/login`, {}, {
      auth: {
        username: email,
        password,
      }
    });
    const data: USER.IReturnUser = response.data
    return data
  } catch (error) {
    error.message = `Unable to login; ${error.message}`
    throw error
  }
}

/**
 * Log out on the LBDserver (backend defined in process.env.REACT_APP_BACKEND)
 * @param {string} token The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function logout(token: string): Promise<void> {
  try {
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(`${process.env.REACT_APP_BACKEND}/logout`, null, config);
      return
    } else {
      throw new Error(`Token not found`)
    }
  } catch (error) {
    error.message = `Unable to log out; ${error.message}`
    throw error
  }
}

// PROJECT ROUTES
/**
 * Get all the documents accessible to unauthenticated users (public projects) on the local LBDserver (backend defined in process.env.REACT_APP_BACKEND)
 */
async function getOpenProjects(): Promise<PROJECT.IReturnProject[]> {
  try {
    const response: AXIOS.AxiosResponse = await axios.get(`${process.env.REACT_APP_BACKEND}/lbd/public`)
    const data: PROJECT.IReturnProject[] = response.data
    return data
  } catch (error) {
    error.message = `Unable to fetch open projects; ${error.message}`
    throw error
  }
}

/**
 * Get all the projects associated with the currently authenticated user.
 * @param {string} token The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function getUserProjects(token: string): Promise<PROJECT.IReturnProject[]> {
  try {
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response: AXIOS.AxiosResponse = await axios.get(`${process.env.REACT_APP_BACKEND}/lbd`, config)
      const data: PROJECT.IReturnProject[] = response.data
      return data
    } else {
      throw new Error(`Token not found`)
    }

  } catch (error) {
    error.message = `Unable to fetch open projects; ${error.message}`
    throw error
  }
}

/**
 * Create a new project on the local LBDserver
 * @param {Object.<string, any>} project The project object.
 * @param {string} project.title The title "name" of the project. It will be registered in the project metadata graph of the project as rdfs:label.
 * @param {string} project.description A small description of the project. It will be registered in the project metadata graph as rdfs:comment.
 * @param {boolean} project.open Whether the project should be visible for the broader public or only for the creator. This is registered within the default ACL file (which can be changed afterwards as well).
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function createProject(project: PROJECT.ICreateProject, token?: string): Promise<PROJECT.IReturnProject> {
  try {
    if (token) {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      };
      const response: AXIOS.AxiosResponse = await axios.post(`${process.env.REACT_APP_BACKEND}/lbd`, project, config);
      const data: PROJECT.IReturnProject = response.data
      return data
    } else {
      throw new Error(`Token not found`)
    }

  } catch (error) {
    error.message = `Could not create new project; ${error.message}`
    throw error
  }
}

/**
 * Get a project by its URL or ID. If an ID is given, the URL is reconstructed via the backend URL defined in process.env.REACT_APP_BACKEND.
 * @param {string} project The URL or the ID of the project.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. Optional
 */
async function getOneProject(project: string, token?: string): Promise<PROJECT.IReturnProject> {
  try {
    const url = modifyProjectUrl(project)
    let response: AXIOS.AxiosResponse
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      response = await axios.get(url, config)
    } else {
      response = await axios.get(url)
    }
    const data: PROJECT.IReturnProject = response.data
    console.log('data', data)
    return data

  } catch (error) {
    error.message = `Unable to fetch open projects; ${error.message}`
    throw error
  }
}

/**
 * Delete a project by ID or URL. If an ID is provided; the URL is reconstructed based on the backend URL defined in process.env.REACT_APP_BACKEND.
 * @param {string} project The URL or the ID of the project.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function deleteProject(project: string, token?: string): Promise<void> {
  try {
    const url = modifyProjectUrl(project)
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.delete(url, config)
    } else {
      await axios.delete(url)
    }
    return
  } catch (error) {
    error.message = `Unable to delete project; ${error.message}`
    throw error
  }
}

///////////////// RESOURCE FUNCTIONS //////////////////
/**
 * Delete a resource and its metadata graph.
 * @param {string} url The url of the resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function deleteResource(url: string, token?: string): Promise<void> {
  try {
    url = modifyUrl(url)
    let response: AXIOS.AxiosResponse
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      response = await axios.delete(url, config)
    } else {
      response = await axios.delete(url)
    }
  } catch (error) {
    error.message = `Unable to delete resource; ${error.message}`
    throw error
  }
}

///////////////// DOCUMENT FUNCTIONS //////////////////
interface IUploadResource {
  label: string,
  description: string,
  file?: Blob,
  acl?: Blob,
}

/**
 * Upload a document to a defined project. Props include a "label", a "description" and a "resource", with the "resource" referring to the actual file to be uploaded. The "label" and "description" are used in the automatically created metadata file, which is equal to {fileurl}.meta.
 * @param {Object.<string, any>} props The properties of the object to be uploaded.
 * @param {string} props.label A label for the resource. It will be registered in the metadata graph of the resource as rdfs:label.
 * @param {string} props.description A description for the resource. It will be registered in the metadata graph of the resource as rdfs:comment.
 * @param {Blob} props.file The file originating from a HTMLInputElement upload. Only one file at a time.
 * @param {string|Blob} [props.acl] An optional parameter to indicate the ACL graph for the resource. Can be a string pointing at the URL of an already existing ACL graph or a new ACL graph, uploaded via a HTMLInputElement.
 * @param {string} project The URL or the ID of the project.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function uploadDocument(props: IUploadResource, project: string, token?: string): Promise<PROJECT.IReturnMetadata> {
  try {
    const baseUrl = modifyProjectUrl(project)
    const url = `${baseUrl}/files`

    const bodyFormData = new FormData();
    bodyFormData.append("resource", props.file);
    bodyFormData.append("label", props.label);
    bodyFormData.append("description", props.description);

    if (props.acl) {
      bodyFormData.append("acl", props.acl)
    }

    const myHeaders = new Headers()
    if (token) {
      myHeaders.append("Authorization", `Bearer ${token}`)
    }

    const config: { [key: string]: any } = {
      method: "POST",
      redirect: "follow",
      body: bodyFormData,
      headers: myHeaders
    };

    const response: Response = await fetch(url, config)
    const data: PROJECT.IReturnMetadata = await response.json()
    return data

  } catch (error) {
    error.message = `Unable to upload document; ${error.message}`
    throw error
  }
}

/**
 * Get a (non RDF) document from the LBDserver by providing its URL. Authenticate with a token.
 * @param {string} url The URL of the requested resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function getDocument(url: string, token?: string): Promise<Buffer> {
  try {
    const fullUrl = new URL(url)
    const realUrl = url.replace(`${fullUrl.protocol}//${fullUrl.host}`, `${process.env.REACT_APP_BACKEND}`)

    let response: AXIOS.AxiosResponse
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      response = await axios.get(realUrl, config)
    } else {
      response = await axios.get(realUrl)
    }
    return response.data
  } catch (error) {
    error.message = `Unable to fetch document; ${error.message}`
    throw error
  }
}

/**
 * Get the metadata of a document resource on the lbdserver. The url of the document should be provided; either with .meta or without (if without; the ".meta" suffix is automatically added).
 * @param {string} url The URL of the requested resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function getDocumentMetadata(url: string, token?: string): Promise<PROJECT.IReturnMetadata> {
  try {
    if (!url.endsWith(".meta")) {
      url = url.concat('.meta')
    }
    url = modifyUrl(url)

    let response: AXIOS.AxiosResponse
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      response = await axios.get(url, config)
    } else {
      response = await axios.get(url)
    }
    console.log('response.data', response.data)
    return response.data
  } catch (error) {
    error.message = `Unable to fetch document metadata; ${error.message}`
    throw error
  }
}

/**
 * Erase a document (and its corresponding metadata graph) from existence. 
 * @param {string} url The URL of the resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function deleteDocument(url: string, token?: string): Promise<void> {
  try {
    await deleteResource(url, token)
  } catch (error) {
    error.message = `Unable to delete document; ${error.message}`
    throw error
  }
}

////////////// GRAPH FUNCTIONS ///////////////
/**
 * Upload an RDF graph to a defined project. Props include a "label", a "description" and a "resource", with the "resource" referring to the actual RDF graph to be uploaded. In the case no resource is passed, an empty graph gets created, using the label and description in the metadata, which is equal to {graphurl}.meta. A custom ACL graph or reference may be provided.
 * @param {Object.<string, any>} props The properties of the object to be uploaded.
 * @param {string} props.label A label for the resource. It will be registered in the metadata graph of the resource as rdfs:label.
 * @param {string} props.description A description for the resource. It will be registered in the metadata graph of the resource as rdfs:comment.
 * @param {Blob} props.file The file originating from a HTMLInputElement upload. Only one file at a time.
 * @param {string|Blob} [props.acl] An optional parameter to indicate the ACL graph for the resource. Can be a string pointing at the URL of an already existing ACL graph or a new ACL graph, uploaded via a HTMLInputElement.
 * @param {string} project The URL or the ID of the project.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function uploadGraph(props: IUploadResource, project: string, token?: string): Promise<PROJECT.IReturnMetadata> {
  try {
    const baseUrl = modifyProjectUrl(project)
    const url = `${baseUrl}/graphs`

    const bodyFormData = new FormData();
    if (props.file) {
      bodyFormData.append("resource", props.file);
    }
    bodyFormData.append("label", props.label);
    bodyFormData.append("description", props.description);

    if (props.acl) {
      bodyFormData.append("acl", props.acl);
    }

    const myHeaders = new Headers()
    if (token) {
      myHeaders.append("Authorization", `Bearer ${token}`)
    }
    const config: { [key: string]: any } = {
      method: "POST",
      redirect: "follow",
      body: bodyFormData,
      headers: myHeaders
    };

    const response: Response = await fetch(url, config)
    const data: PROJECT.IReturnMetadata = await response.json()
    return data
  } catch (error) {
    error.message = `Unable to upload document`
    throw error
  }
}

/**
 * Get a graph by its URL. You can also request metadata graphs explicitly in with this function. However, you may also use the function "getGraphMetadata" for this purpose.
 * @param {string} url The URL of the requested resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function getGraph(url: string, token?: string): Promise<PROJECT.IReturnGraph> {
  try {
    const fullUrl = new URL(url)
    const realUrl = url.replace(`${fullUrl.protocol}//${fullUrl.host}`, `${process.env.REACT_APP_BACKEND}`)

    let response: AXIOS.AxiosResponse
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      response = await axios.get(realUrl, config)
    } else {
      response = await axios.get(realUrl)
    }
    return response.data
  } catch (error) {
    error.message = `Unable to fetch document; ${error.message}`
    throw error
  }
}

/**
 * Get the metadata graph of a given graph. You may either provide the ".meta" suffix or skip it. 
 * @param {string} url The URL of the resource corresponding with the metadata graph or the URL of the metadata graph itself.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function getGraphMetadata(url: string, token?: string): Promise<PROJECT.IReturnMetadata> {
  try {
    if (!url.endsWith(".meta")) {
      url = url.concat('.meta')
    }
    url = modifyUrl(url)
    const data: PROJECT.IReturnMetadata = await getGraph(url, token)
    return data
  } catch (error) {
    error.message = `Error finding metdata graph; ${error.message}`
    throw error
  }
}

/**
 * Erase a project graph and its corresponding metadata graph from existence.
 * @param {string} url The URL of the resource.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function deleteGraph(url: string, token?: string): Promise<void> {
  try {
    await deleteResource(url, token)
  } catch (error) {
    error.message = `Unable to delete graph; ${error.message}`
    throw error
  }
}

///////////////// QUERY FUNCTIONS ////////////////
/**
 * Query a project with SPARQL SELECT. Only the graphs to which the user has access will be queried.
 * @param {string} project The URL or the ID of the project.
 * @param {string} query A SPARQL select query.  
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function queryProjectSelect(project: string, query: string, token?: string): Promise<PROJECT.IQueryResults> {
  try {
    let url = modifyProjectUrl(project)
    url = url + "?query=" + query.toString()
    console.log('url', url)
    let response: AXIOS.AxiosResponse
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      response = await axios.get(url, config)
    } else {
      response = await axios.get(url)
    }
    const data: PROJECT.IQueryResults = response.data.results
    return data

  } catch (error) {
    error.message = `Unable to query project; ${error.message}`
    throw error
  }
}

interface rdfNode {
  termType: string,
  value: string
}

/**
 * Query multiple graphs with SPARQL SELECT.
 * @param {string} project The URL or the ID of the project.
 * @param {string} query A SPARQL select query.  
 * @param {string[]} graphs An array of the graphs that are to be included in the query.
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function queryMultiple(project: string, query: string, graphs: string[], token?: string): Promise<PROJECT.IQueryResults> {
  try {

    const algebra = translate(query, { quads: true })
    const rdfGraphs: rdfNode[]  = []
    graphs.forEach((graph: string) => {
      rdfGraphs.push({ termType: "NamedNode", value: graph })
    })

    const newAlgebra = {
      input: algebra,
      default: rdfGraphs,
      type: "from",
      named: []
    }
    query = toSparql(newAlgebra)
    console.log('query', query)

    let url = modifyProjectUrl(project)
    url = url + "?query=" + encodeURIComponent(query.toString())
    console.log('url', url)
    let response: AXIOS.AxiosResponse
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      response = await axios.get(url, config)
    } else {
      response = await axios.get(url)
    }
    const data: PROJECT.IQueryResults = response.data.results
    return data

  } catch (error) {
    error.message = `Unable to query project; ${error.message}`
    throw error
  }
}

/**
 * Query a graph with SPARQL SELECT.
 * @param {string} url The url of the graph to be queried.
 * @param {string} query A SPARQL select query.  
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function queryGraphSelect(url: string, query: string, token?: string): Promise<PROJECT.IQueryResults> {
  try {
    url = modifyUrl(url)
    url = url + "?query=" + query.toString()
    console.log('url', url)
    let response: AXIOS.AxiosResponse
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      response = await axios.get(url, config)
    } else {
      response = await axios.get(url)
    }
    const data: PROJECT.IQueryResults = response.data.results
    return data

  } catch (error) {
    error.message = `Unable to query graph; ${error.message}`
    throw error
  }
}

async function updateProject(project: string, query: string, token?: string): Promise<void> {
  try {
    let url = modifyProjectUrl(project)
    url = url + "?update=" + encodeURIComponent(query.toString())
    console.log(url)
    let response: AXIOS.AxiosResponse
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      response = await axios.put(url, config)
    } else {
      response = await axios.put(url)
    }
    return

  } catch (error) {
    error.message = `Unable to update; ${error.message}`
    throw error
  }
}

/**
 * Update a named graph in the project (SPARQL INSERT/DELETE). Be careful. 
 * @param {string} url The url of the graph to be updated.
 * @param {string} query A SPARQL INSERT/DELETE query.  
 * @param {string} [token] The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function.
 */
async function updateGraph(url: string, query: string, token?: string): Promise<void> {
  try {
    console.log('url', url)
    // get project id from url
    const urlProps = new URL(url)
    const project = urlProps.pathname.split("/")[2]

    // change query
    const algebra = translate(query, { quads: true })
    console.log('algebra', algebra)
    for (const key of Object.keys(algebra)) {
      switch (key) {
        case 'delete':
          algebra[key].forEach((quad: any) => {
            quad.graph = { termType: "NamedNode", value: url }
          });
          break;
        case "insert":
          algebra[key].forEach((quad: any) => {
            quad.graph = { termType: "NamedNode", value: url }
          });
          break;
        default:
          break;
      }
    }
    query = toSparql(algebra)
    // update project
    await updateProject(project, query, token)
    return
  } catch (error) {
    error.message = `Unable to update graph; ${error.message}`
    throw error
  }
}

///////////////// HELPER FUNCTIONS ///////////////
function modifyProjectUrl(id: string): string {
  let url: string
  try {
    url = modifyUrl(id)
  } catch (error) {
    url = `${process.env.REACT_APP_BACKEND}/lbd/${id}`
  }
  return url
}

function modifyUrl(url: string) {
  try {
    const fullUrl = new URL(url)
    url = url.replace(`${fullUrl.protocol}//${fullUrl.host}`, `${process.env.REACT_APP_BACKEND}`)
    return url
  } catch (error) {
    error.message = `Unable to modify URL; ${error.message}`
    throw error
  }
}

export {
  getOpenProjects,
  logout,
  register,
  login,
  getUserProjects,
  createProject,
  uploadDocument,
  uploadGraph,
  getDocument,
  getOneProject,
  getDocumentMetadata,
  deleteProject,
  deleteDocument,
  getGraphMetadata,
  deleteResource,
  deleteGraph,
  queryProjectSelect,
  queryGraphSelect,
  updateGraph,
  queryMultiple
}