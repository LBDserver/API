# LBDserver API

Documentation for the LBDserver project running on the Solid Community Server. LBDserver is a project for managing Linked Building Data, using both RDF and non-RDF resources. To make the LBDserver infrastructure federated, we base upon on the (WIP) [Community Solid Server prototype](https://github.com/solid/community-server). Note that both the CSS as this API functions are still higly experimental. The API is used, amongst others, in the [LBDserver frontend conSOlid prototype](https://github.com/LBDserver/front-react/tree/consolid-front).

## Installation

Install the package with NPM:

```bash
$ npm install lbd-solid
```
## Functions

<dl>
<dt><a href="#login">login(oidcIssuer, redirectUrl, session)</a> ⇒ <code>Promise.&lt;Session&gt;</code></dt>
<dd><p>Log in using OIDC and a Solid Session.</p>
</dd>
<dt><a href="#register">register(oidcIssuer, redirecturi, session)</a> ⇒ <code>Promise.&lt;Session&gt;</code></dt>
<dd><p>Log in using OIDC and a Solid Session.</p>
</dd>
<dt><a href="#processSession">processSession(session)</a> ⇒ <code>Promise.&lt;Session&gt;</code></dt>
<dd><p>Helper function to process the session after OIDC login. Retrieves the &quot;code&quot; from the current uri.</p>
</dd>
<dt><a href="#logout">logout(session)</a> ⇒ <code>Promise.&lt;Session&gt;</code></dt>
<dd><p>Log out from a Solid Session.</p>
</dd>
<dt><a href="#createProject">createProject(stakeholders, session)</a> ⇒ <code>Promise.&lt;ICreateProject&gt;</code></dt>
<dd><p>Create a new project environment. As the project ID is created here, the project metadata graph (.props) should be created afterwards (createGraph)</p>
</dd>
<dt><a href="#deleteProject">deleteProject(uri, session)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Delete an LBD project. The project will only be deleted in your own POD, of course.</p>
</dd>
<dt><a href="#getUserProjects">getUserProjects(session)</a> ⇒ <code>Promise.&lt;Array.&lt;IReturnProject&gt;&gt;</code></dt>
<dd><p>Get all the LBD projects in the POD of the authenticated user.</p>
</dd>
<dt><a href="#getOneProject">getOneProject(uri, session)</a> ⇒ <code>Promise.&lt;IReturnProject&gt;</code></dt>
<dd><p>Get a single project by its uri. From your local project, other stakeholders are determined and the federated project data you have access to is fetched.</p>
</dd>
<dt><a href="#getLocalProject">getLocalProject(uri, session)</a> ⇒ <code>Promise.&lt;IReturnProject&gt;</code></dt>
<dd><p>Get only the project data residing in your POD.</p>
</dd>
<dt><a href="#getProjectResources">getProjectResources(uri, session)</a> ⇒ <code>Promise.&lt;IReturnResources&gt;</code></dt>
<dd><p>Gets only the graphs and documents, without other project info (i.e. their metadata &amp; permissions)</p>
</dd>
<dt><a href="#getOpenProjects">getOpenProjects(lbdLocation)</a> ⇒ <code>Promise.&lt;Array.&lt;IReturnProject&gt;&gt;</code></dt>
<dd><p>Get the open projects on a specific LBDlocation.</p>
</dd>
<dt><a href="#uploadResource">uploadResource(url, data, options, session)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Upload a resource to your POD. You may also use uploadGraph and uploadDocument.</p>
</dd>
<dt><a href="#getResource">getResource(uri, session)</a> ⇒ <code>Promise.&lt;any&gt;</code></dt>
<dd><p>Get a resource actual data.</p>
</dd>
<dt><a href="#getResourceMetadata">getResourceMetadata(uri, session)</a> ⇒ <code>Promise.&lt;IReturnMetadata&gt;</code></dt>
<dd><p>Get a resource&#39;s metadata</p>
</dd>
<dt><a href="#uploadGraph">uploadGraph(url, data, metadata, options, session)</a> ⇒ <code>Promise.&lt;IReturnMetadata&gt;</code></dt>
<dd><p>Upload a graph (TTL) to your POD.</p>
</dd>
<dt><a href="#uploadDocument">uploadDocument(url, data, metadata, options, session)</a> ⇒ <code>Promise.&lt;IReturnMetadata&gt;</code></dt>
<dd><p>Upload a non-RDF resource to your POD.</p>
</dd>
<dt><a href="#deleteResource">deleteResource(url, session)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Delete a resource</p>
</dd>
<dt><a href="#deleteGraph">deleteGraph(url, session)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Delete an RDF resource and its metadata</p>
</dd>
<dt><a href="#deleteDocument">deleteDocument(url, session)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Delete an non-RDF resource and its metadata</p>
</dd>
<dt><a href="#createContainer">createContainer(url, session)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Create a container with a given url</p>
</dd>
<dt><a href="#getContainerContent">getContainerContent(url, session)</a> ⇒ <code>Promise.&lt;{containers: Array.&lt;string&gt;, resources: Array.&lt;string&gt;}&gt;</code></dt>
<dd><p>Get the content of the container as an object with a list of resources and subcontainers.</p>
</dd>
<dt><a href="#uploadMetadataGraph">uploadMetadataGraph(url, data, options, session)</a> ⇒ <code>Promise.&lt;void&gt;</code></dt>
<dd><p>Upload the metadata graph for a given resource. Metadata graph urls will end with &quot;.props&quot;.</p>
</dd>
<dt><a href="#query">query(query, graphs, session)</a> ⇒ <code>Promise.&lt;Array.&lt;IQueryResult&gt;&gt;</code></dt>
<dd><p>Query (SPARQL SELECT) a (set of) resource(s) with Comunica. As for now, only openly accessible graphs (i.e. Read permissions) can be queried</p>
</dd>
<dt><a href="#getPermissions">getPermissions(url, session)</a> ⇒ <code>Promise.&lt;Array.&lt;PermissionType&gt;&gt;</code></dt>
<dd><p>Get the permissions for a specific resource. Placeholder until implemented (depends on authenticated or not). Only for UI purposes.</p>
</dd>
<dt><a href="#getLbdLocation">getLbdLocation(webId, session)</a> ⇒ <code>Promise.&lt;string&gt;</code></dt>
<dd><p>Get the location where LBD projects are stored. At this point, standard &#39;./lbd/&#39; will be returned. Later phases may include more complex mechanisms such as Shape Tree discovery or Index Types. Authenticated sessions may thus be required in the future.</p>
</dd>
<dt><a href="#checkExistence">checkExistence(url, session)</a> ⇒ <code>Promise.&lt;boolean&gt;</code></dt>
<dd><p>Check the existence of a resource (HEAD request to the given URL)</p>
</dd>
</dl>

<a name="login"></a>

## login(oidcIssuer, redirectUrl, session) ⇒ <code>Promise.&lt;Session&gt;</code>
Log in using OIDC and a Solid Session.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Session&gt;</code> - Returns a Solid Session object  

| Param | Type | Description |
| --- | --- | --- |
| oidcIssuer | <code>string</code> | uri for the OIDC issuer. E.g. 'https://broker.pod.inrupt.com'. |
| redirectUrl | <code>string</code> | uri for redirect after login via OIDC. E.g. window.location.href. to return to the original page. |
| session | <code>Session</code> | The solid session object. Will be returned, but if successful, the session will be authenticated and linked to the logged in user/webID. |

<a name="register"></a>

## register(oidcIssuer, redirecturi, session) ⇒ <code>Promise.&lt;Session&gt;</code>
Log in using OIDC and a Solid Session.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Session&gt;</code> - Returns a Solid Session object  

| Param | Type | Description |
| --- | --- | --- |
| oidcIssuer | <code>string</code> | uri for the OIDC issuer. E.g. 'https://broker.pod.inrupt.com'. |
| redirecturi | <code>string</code> | uri for redirect after login via OIDC. E.g. window.location.href. to return to the original page. |
| session | <code>Session</code> | The solid session object. Will be returned, but if successful, the session will be authenticated and linked to the logged in user/webID. |

<a name="processSession"></a>

## processSession(session) ⇒ <code>Promise.&lt;Session&gt;</code>
Helper function to process the session after OIDC login. Retrieves the "code" from the current uri.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Session&gt;</code> - Returns a Solid Session object  

| Param | Type | Description |
| --- | --- | --- |
| session | <code>Session</code> | The Solid Session object. |

<a name="logout"></a>

## logout(session) ⇒ <code>Promise.&lt;Session&gt;</code>
Log out from a Solid Session.

**Kind**: global function  
**Returns**: <code>Promise.&lt;Session&gt;</code> - Returns a Solid Session object  

| Param | Type | Description |
| --- | --- | --- |
| session | <code>Session</code> | The Solid Session object. |

<a name="createProject"></a>

## createProject(stakeholders, session) ⇒ <code>Promise.&lt;ICreateProject&gt;</code>
Create a new project environment. As the project ID is created here, the project metadata graph (.props) should be created afterwards (createGraph)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| stakeholders | <code>Array.&lt;IAgent&gt;</code> | Array of stakeholders to be involved in the project, as well as their access rights to the project in general. |
| session | <code>Session</code> | The Solid Session object. |

<a name="deleteProject"></a>

## deleteProject(uri, session) ⇒ <code>Promise.&lt;void&gt;</code>
Delete an LBD project. The project will only be deleted in your own POD, of course.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | The uri of the project to delete in your repository. |
| session | <code>Session</code> | The Solid Session object. |

<a name="getUserProjects"></a>

## getUserProjects(session) ⇒ <code>Promise.&lt;Array.&lt;IReturnProject&gt;&gt;</code>
Get all the LBD projects in the POD of the authenticated user.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| session | <code>Session</code> | The Solid Session object. |

<a name="getOneProject"></a>

## getOneProject(uri, session) ⇒ <code>Promise.&lt;IReturnProject&gt;</code>
Get a single project by its uri. From your local project, other stakeholders are determined and the federated project data you have access to is fetched.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | The uri of the project. |
| session | <code>Session</code> | The Solid Session object. |

<a name="getLocalProject"></a>

## getLocalProject(uri, session) ⇒ <code>Promise.&lt;IReturnProject&gt;</code>
Get only the project data residing in your POD.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | The uri of the project. |
| session | <code>Session</code> | The Solid Session object. |

<a name="getProjectResources"></a>

## getProjectResources(uri, session) ⇒ <code>Promise.&lt;IReturnResources&gt;</code>
Gets only the graphs and documents, without other project info (i.e. their metadata & permissions)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | The uri of the project. |
| session | <code>Session</code> | The Solid Session object. |

<a name="getOpenProjects"></a>

## getOpenProjects(lbdLocation) ⇒ <code>Promise.&lt;Array.&lt;IReturnProject&gt;&gt;</code>
Get the open projects on a specific LBDlocation.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| lbdLocation | <code>string</code> | The LBD project location to search for open projects |

<a name="uploadResource"></a>

## uploadResource(url, data, options, session) ⇒ <code>Promise.&lt;void&gt;</code>
Upload a resource to your POD. You may also use uploadGraph and uploadDocument.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | the to-be url of the resource |
| data | <code>Buffer</code> \| <code>string</code> | The data to be uploaded. Can be a buffer or a plain string. |
| options | <code>Object</code> | Upload options |
| [options.overwrite] | <code>boolean</code> | Whether the resource is an existing object that should be overwritten. |
| [options.mimeType] | <code>string</code> | The mimetype of the resource. If not passed, the mimetype is guessed by the extension. If this files, the mimetype is st to 'text/plain'. |
| session | <code>Session</code> | The Solid session object |

<a name="getResource"></a>

## getResource(uri, session) ⇒ <code>Promise.&lt;any&gt;</code>
Get a resource actual data.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | The uri of the project. |
| session | <code>Session</code> | The Solid Session object. |

<a name="getResourceMetadata"></a>

## getResourceMetadata(uri, session) ⇒ <code>Promise.&lt;IReturnMetadata&gt;</code>
Get a resource's metadata

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | The uri of the project. |
| session | <code>Session</code> | The Solid Session object. |

<a name="uploadGraph"></a>

## uploadGraph(url, data, metadata, options, session) ⇒ <code>Promise.&lt;IReturnMetadata&gt;</code>
Upload a graph (TTL) to your POD.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | the to-be url of the resource |
| data | <code>Buffer</code> \| <code>string</code> | The data to be uploaded. Can be a buffer or a plain string. |
| metadata | <code>string</code> | The metadata graph as Turtle. |
| options | <code>Object</code> | Upload options |
| options.overwrite | <code>boolean</code> | Whether the resource is an existing object that should be overwritten. |
| [options.mimeType] | <code>string</code> | The mimetype of the resource. If not passed, the mimetype is guessed by the extension. If this files, the mimetype is st to 'text/plain'. |
| session | <code>Session</code> | The Solid session object |

<a name="uploadDocument"></a>

## uploadDocument(url, data, metadata, options, session) ⇒ <code>Promise.&lt;IReturnMetadata&gt;</code>
Upload a non-RDF resource to your POD.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | the to-be url of the resource |
| data | <code>Buffer</code> \| <code>string</code> | The data to be uploaded. Can be a buffer or a plain string. |
| metadata | <code>string</code> | The metadata graph as Turtle. |
| options | <code>Object</code> | Upload options |
| options.overwrite | <code>boolean</code> | Whether the resource is an existing object that should be overwritten. |
| [options.mimeType] | <code>string</code> | The mimetype of the resource. If not passed, the mimetype is guessed by the extension. If this files, the mimetype is st to 'text/plain'. |
| session | <code>Session</code> | The Solid session object |

<a name="deleteResource"></a>

## deleteResource(url, session) ⇒ <code>Promise.&lt;void&gt;</code>
Delete a resource

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The url of the resource to be deleted |
| session | <code>Session</code> | The Solid session object |

<a name="deleteGraph"></a>

## deleteGraph(url, session) ⇒ <code>Promise.&lt;void&gt;</code>
Delete an RDF resource and its metadata

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The url of the resource to be deleted |
| session | <code>Session</code> | The Solid session object |

<a name="deleteDocument"></a>

## deleteDocument(url, session) ⇒ <code>Promise.&lt;void&gt;</code>
Delete an non-RDF resource and its metadata

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The url of the resource to be deleted |
| session | <code>Session</code> | The Solid session object |

<a name="createContainer"></a>

## createContainer(url, session) ⇒ <code>Promise.&lt;void&gt;</code>
Create a container with a given url

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The url of the container to be created |
| session | <code>Session</code> | The Solid session object |

<a name="getContainerContent"></a>

## getContainerContent(url, session) ⇒ <code>Promise.&lt;{containers: Array.&lt;string&gt;, resources: Array.&lt;string&gt;}&gt;</code>
Get the content of the container as an object with a list of resources and subcontainers.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The url of the container |
| session | <code>Session</code> | The Solid session object |

<a name="uploadMetadataGraph"></a>

## uploadMetadataGraph(url, data, options, session) ⇒ <code>Promise.&lt;void&gt;</code>
Upload the metadata graph for a given resource. Metadata graph urls will end with ".props".

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The url of the resource (if it doesn't end with ".props", the suffix is added automatically) |
| data | <code>string</code> | The metadata as Turtle |
| options | <code>Object</code> | Options for uploading |
| options.overwrite | <code>boolean</code> | Whether the resource is an existing object that should be overwritten. |
| [options.mimeType] | <code>string</code> | The mimetype of the resource. If not passed, the mimetype is guessed by the extension. If this files, the mimetype is st to 'text/plain'. |
| session | <code>Session</code> | The Solid session object |

<a name="query"></a>

## query(query, graphs, session) ⇒ <code>Promise.&lt;Array.&lt;IQueryResult&gt;&gt;</code>
Query (SPARQL SELECT) a (set of) resource(s) with Comunica. As for now, only openly accessible graphs (i.e. Read permissions) can be queried

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>string</code> | The SPARQL query string |
| graphs | <code>Array.&lt;string&gt;</code> | The resources to be queried as an Array |
| session | <code>Session</code> | The Solid session object |

<a name="getPermissions"></a>

## getPermissions(url, session) ⇒ <code>Promise.&lt;Array.&lt;PermissionType&gt;&gt;</code>
Get the permissions for a specific resource. Placeholder until implemented (depends on authenticated or not). Only for UI purposes.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The url |
| session | <code>Session</code> | The Solid session object |

<a name="getLbdLocation"></a>

## getLbdLocation(webId, session) ⇒ <code>Promise.&lt;string&gt;</code>
Get the location where LBD projects are stored. At this point, standard './lbd/' will be returned. Later phases may include more complex mechanisms such as Shape Tree discovery or Index Types. Authenticated sessions may thus be required in the future.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| webId | <code>string</code> | The web id to find the LBD location for. |
| session | <code>Session</code> | The Solid session object |

<a name="checkExistence"></a>

## checkExistence(url, session) ⇒ <code>Promise.&lt;boolean&gt;</code>
Check the existence of a resource (HEAD request to the given URL)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The url of the resource |
| session | <code>Session</code> | The Solid session object |

