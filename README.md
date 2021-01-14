# LBDserver API

Documentation for the LBDserver project. Includes shared interfaces as well as functions for communicating with the LBDserver backend.
## Functions

<dl>
<dt><a href="#register">register(username, email, password)</a> ⇒ <code><a href="#returnUser">Promise.&lt;returnUser&gt;</a></code></dt>
<dd><p>Register as a user to the local LBDserver (backend defined in process.env.REACT_APP_BACKEND).</p>
</dd>
<dt><a href="#login">login(email, password)</a> ⇒ <code><a href="#returnUser">Promise.&lt;returnUser&gt;</a></code></dt>
<dd><p>Login as an existing user to the LBDserver (backend defined in process.env.REACT_APP_BACKEND)</p>
</dd>
<dt><a href="#logout">logout(token)</a> ⇒ <code>void</code></dt>
<dd><p>Log out on the LBDserver (backend defined in process.env.REACT_APP_BACKEND)</p>
</dd>
<dt><a href="#getOpenProjects">getOpenProjects()</a> ⇒ <code><a href="#Project">Array.&lt;Project&gt;</a></code></dt>
<dd><p>Get all the documents accessible to unauthenticated users (public projects) on the local LBDserver (backend defined in process.env.REACT_APP_BACKEND)</p>
</dd>
<dt><a href="#getUserProjects">getUserProjects(token)</a> ⇒ <code><a href="#Project">Array.&lt;Project&gt;</a></code></dt>
<dd><p>Get all the projects associated with the currently authenticated user.</p>
</dd>
<dt><a href="#createProject">createProject(project, [token])</a> ⇒ <code><a href="#Project">Project</a></code></dt>
<dd><p>Create a new project on the local LBDserver</p>
</dd>
<dt><a href="#getOneProject">getOneProject(project, [token])</a> ⇒ <code><a href="#Project">Project</a></code></dt>
<dd><p>Get a project by its URL or ID. If an ID is given, the URL is reconstructed via the backend URL defined in process.env.REACT_APP_BACKEND.</p>
</dd>
<dt><a href="#deleteProject">deleteProject(project, [token])</a> ⇒ <code>void</code></dt>
<dd><p>Delete a project by ID or URL. If an ID is provided; the URL is reconstructed based on the backend URL defined in process.env.REACT_APP_BACKEND.</p>
</dd>
<dt><a href="#deleteResource">deleteResource(url, [token])</a> ⇒ <code>void</code></dt>
<dd><p>Delete a resource and its metadata graph.</p>
</dd>
<dt><a href="#uploadDocument">uploadDocument(props, project, [token])</a> ⇒ <code><a href="#Metadata">Metadata</a></code></dt>
<dd><p>Upload a document to a defined project. Props include a &quot;label&quot;, a &quot;description&quot; and a &quot;resource&quot;, with the &quot;resource&quot; referring to the actual file to be uploaded. The &quot;label&quot; and &quot;description&quot; are used in the automatically created metadata file, which is equal to {fileurl}.meta.</p>
</dd>
<dt><a href="#getDocument">getDocument(url, [token])</a> ⇒ <code>Buffer</code></dt>
<dd><p>Get a (non RDF) document from the LBDserver by providing its URL. Authenticate with a token.</p>
</dd>
<dt><a href="#getDocumentMetadata">getDocumentMetadata(url, [token])</a> ⇒ <code><a href="#Metadata">Metadata</a></code></dt>
<dd><p>Get the metadata of a document resource on the lbdserver. The url of the document should be provided; either with .meta or without (if without; the &quot;.meta&quot; suffix is automatically added).</p>
</dd>
<dt><a href="#deleteDocument">deleteDocument(url, [token])</a> ⇒ <code>void</code></dt>
<dd><p>Erase a document (and its corresponding metadata graph) from existence.</p>
</dd>
<dt><a href="#uploadGraph">uploadGraph(props, project, [token])</a> ⇒ <code><a href="#Metadata">Metadata</a></code></dt>
<dd><p>Upload an RDF graph to a defined project. Props include a &quot;label&quot;, a &quot;description&quot; and a &quot;resource&quot;, with the &quot;resource&quot; referring to the actual RDF graph to be uploaded. In the case no resource is passed, an empty graph gets created, using the label and description in the metadata, which is equal to {graphurl}.meta. A custom ACL graph or reference may be provided.</p>
</dd>
<dt><a href="#getGraph">getGraph(url, [token])</a> ⇒ <code><a href="#Graph">Graph</a></code></dt>
<dd><p>Get a graph by its URL. You can also request metadata graphs explicitly in with this function. However, you may also use the function &quot;getGraphMetadata&quot; for this purpose.</p>
</dd>
<dt><a href="#getGraphMetadata">getGraphMetadata(url, [token])</a> ⇒ <code><a href="#Metadata">Metadata</a></code></dt>
<dd><p>Get the metadata graph of a given graph. You may either provide the &quot;.meta&quot; suffix or skip it.</p>
</dd>
<dt><a href="#deleteGraph">deleteGraph(url, [token])</a> ⇒ <code>void</code></dt>
<dd><p>Erase a project graph and its corresponding metadata graph from existence.</p>
</dd>
<dt><a href="#queryProjectSelect">queryProjectSelect(project, query, [token])</a> ⇒ <code><a href="#QueryResults">QueryResults</a></code></dt>
<dd><p>Query a project with SPARQL SELECT. Only the graphs to which the user has access will be queried.</p>
</dd>
<dt><a href="#queryMultiple">queryMultiple(project, query, graphs, [token])</a> ⇒ <code><a href="#QueryResults">QueryResults</a></code></dt>
<dd><p>Query multiple graphs with SPARQL SELECT.</p>
</dd>
<dt><a href="#queryGraphSelect">queryGraphSelect(url, query, [token])</a> ⇒ <code><a href="#QueryResults">QueryResults</a></code></dt>
<dd><p>Query a graph with SPARQL SELECT.</p>
</dd>
<dt><a href="#updateGraph">updateGraph(url, query, [token])</a> ⇒ <code>void</code></dt>
<dd><p>Update a named graph in the project (SPARQL INSERT/DELETE). Be careful.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#User">User</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#returnUser">returnUser</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Metadata">Metadata</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Project">Project</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#QueryResults">QueryResults</a> : <code>Object</code></dt>
<dd><p>The results of a SPARQL SELECT query.</p>
</dd>
<dt><a href="#Graph">Graph</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="register"></a>

## register(username, email, password) ⇒ [<code>Promise.&lt;returnUser&gt;</code>](#returnUser)
Register as a user to the local LBDserver (backend defined in process.env.REACT_APP_BACKEND).

**Kind**: global function  
**Returns**: [<code>Promise.&lt;returnUser&gt;</code>](#returnUser) - Returns a User object and a token.  

| Param | Type | Description |
| --- | --- | --- |
| username | <code>string</code> | Your username will be used to create a webID (personal URL) that can be used for access control in a Linked Data world. Should be unique. |
| email | <code>string</code> | Your e-mail address. Should be unique. |
| password | <code>string</code> | Your LBDserver passsword. |

<a name="login"></a>

## login(email, password) ⇒ [<code>Promise.&lt;returnUser&gt;</code>](#returnUser)
Login as an existing user to the LBDserver (backend defined in process.env.REACT_APP_BACKEND)

**Kind**: global function  
**Returns**: [<code>Promise.&lt;returnUser&gt;</code>](#returnUser) - Returns a User object and a token.  

| Param | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | Your e-mail address. |
| password | <code>string</code> | Your LBDserver password. |

<a name="logout"></a>

## logout(token) ⇒ <code>void</code>
Log out on the LBDserver (backend defined in process.env.REACT_APP_BACKEND)

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="getOpenProjects"></a>

## getOpenProjects() ⇒ [<code>Array.&lt;Project&gt;</code>](#Project)
Get all the documents accessible to unauthenticated users (public projects) on the local LBDserver (backend defined in process.env.REACT_APP_BACKEND)

**Kind**: global function  
<a name="getUserProjects"></a>

## getUserProjects(token) ⇒ [<code>Array.&lt;Project&gt;</code>](#Project)
Get all the projects associated with the currently authenticated user.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="createProject"></a>

## createProject(project, [token]) ⇒ [<code>Project</code>](#Project)
Create a new project on the local LBDserver

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| project | <code>Object.&lt;string, any&gt;</code> | The project object. |
| project.title | <code>string</code> | The title "name" of the project. It will be registered in the project metadata graph of the project as rdfs:label. |
| project.description | <code>string</code> | A small description of the project. It will be registered in the project metadata graph as rdfs:comment. |
| project.open | <code>boolean</code> | Whether the project should be visible for the broader public or only for the creator. This is registered within the default ACL file (which can be changed afterwards as well). |
| [token] | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="getOneProject"></a>

## getOneProject(project, [token]) ⇒ [<code>Project</code>](#Project)
Get a project by its URL or ID. If an ID is given, the URL is reconstructed via the backend URL defined in process.env.REACT_APP_BACKEND.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| project | <code>string</code> | The URL or the ID of the project. |
| [token] | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. Optional. |

<a name="deleteProject"></a>

## deleteProject(project, [token]) ⇒ <code>void</code>
Delete a project by ID or URL. If an ID is provided; the URL is reconstructed based on the backend URL defined in process.env.REACT_APP_BACKEND.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| project | <code>string</code> | The URL or the ID of the project. |
| [token] | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="deleteResource"></a>

## deleteResource(url, [token]) ⇒ <code>void</code>
Delete a resource and its metadata graph.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The url of the resource. |
| [token] | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="uploadDocument"></a>

## uploadDocument(props, project, [token]) ⇒ [<code>Metadata</code>](#Metadata)
Upload a document to a defined project. Props include a "label", a "description" and a "resource", with the "resource" referring to the actual file to be uploaded. The "label" and "description" are used in the automatically created metadata file, which is equal to {fileurl}.meta.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object.&lt;string, any&gt;</code> | The properties of the object to be uploaded. |
| props.label | <code>string</code> | A label for the resource. It will be registered in the metadata graph of the resource as rdfs:label. |
| props.description | <code>string</code> | A description for the resource. It will be registered in the metadata graph of the resource as rdfs:comment. |
| props.file | <code>Blob</code> | The file originating from a HTMLInputElement upload. Only one file at a time. |
| [props.acl] | <code>string</code> \| <code>Blob</code> | An optional parameter to indicate the ACL graph for the resource. Can be a string pointing at the URL of an already existing ACL graph or a new ACL graph, uploaded via a HTMLInputElement. |
| project | <code>string</code> | The URL or the ID of the project. |
| [token] | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="getDocument"></a>

## getDocument(url, [token]) ⇒ <code>Buffer</code>
Get a (non RDF) document from the LBDserver by providing its URL. Authenticate with a token.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL of the requested resource. |
| [token] | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="getDocumentMetadata"></a>

## getDocumentMetadata(url, [token]) ⇒ [<code>Metadata</code>](#Metadata)
Get the metadata of a document resource on the lbdserver. The url of the document should be provided; either with .meta or without (if without; the ".meta" suffix is automatically added).

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL of the requested resource. |
| [token] | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="deleteDocument"></a>

## deleteDocument(url, [token]) ⇒ <code>void</code>
Erase a document (and its corresponding metadata graph) from existence.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL of the resource. |
| [token] | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="uploadGraph"></a>

## uploadGraph(props, project, [token]) ⇒ [<code>Metadata</code>](#Metadata)
Upload an RDF graph to a defined project. Props include a "label", a "description" and a "resource", with the "resource" referring to the actual RDF graph to be uploaded. In the case no resource is passed, an empty graph gets created, using the label and description in the metadata, which is equal to {graphurl}.meta. A custom ACL graph or reference may be provided.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| props | <code>Object.&lt;string, any&gt;</code> | The properties of the object to be uploaded. |
| props.label | <code>string</code> | A label for the resource. It will be registered in the metadata graph of the resource as rdfs:label. |
| props.description | <code>string</code> | A description for the resource. It will be registered in the metadata graph of the resource as rdfs:comment. |
| props.file | <code>Blob</code> | The file originating from a HTMLInputElement upload. Only one file at a time. |
| [props.acl] | <code>string</code> \| <code>Blob</code> | An optional parameter to indicate the ACL graph for the resource. Can be a string pointing at the URL of an already existing ACL graph or a new ACL graph, uploaded via a HTMLInputElement. |
| project | <code>string</code> | The URL or the ID of the project. |
| [token] | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="getGraph"></a>

## getGraph(url, [token]) ⇒ [<code>Graph</code>](#Graph)
Get a graph by its URL. You can also request metadata graphs explicitly in with this function. However, you may also use the function "getGraphMetadata" for this purpose.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL of the requested resource. |
| [token] | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="getGraphMetadata"></a>

## getGraphMetadata(url, [token]) ⇒ [<code>Metadata</code>](#Metadata)
Get the metadata graph of a given graph. You may either provide the ".meta" suffix or skip it.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL of the resource corresponding with the metadata graph or the URL of the metadata graph itself. |
| [token] | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="deleteGraph"></a>

## deleteGraph(url, [token]) ⇒ <code>void</code>
Erase a project graph and its corresponding metadata graph from existence.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The URL of the resource. |
| [token] | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="queryProjectSelect"></a>

## queryProjectSelect(project, query, [token]) ⇒ [<code>QueryResults</code>](#QueryResults)
Query a project with SPARQL SELECT. Only the graphs to which the user has access will be queried.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| project | <code>string</code> | The URL or the ID of the project. |
| query | <code>string</code> | A SPARQL select query. |
| [token] | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="queryMultiple"></a>

## queryMultiple(project, query, graphs, [token]) ⇒ [<code>QueryResults</code>](#QueryResults)
Query multiple graphs with SPARQL SELECT.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| project | <code>string</code> | The URL or the ID of the project. |
| query | <code>string</code> | A SPARQL select query. |
| graphs | <code>Array.&lt;string&gt;</code> | An array of the graphs that are to be included in the query. |
| [token] | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="queryGraphSelect"></a>

## queryGraphSelect(url, query, [token]) ⇒ [<code>QueryResults</code>](#QueryResults)
Query a graph with SPARQL SELECT.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The url of the graph to be queried. |
| query | <code>string</code> | A SPARQL select query. |
| [token] | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="updateGraph"></a>

## updateGraph(url, query, [token]) ⇒ <code>void</code>
Update a named graph in the project (SPARQL INSERT/DELETE). Be careful.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | The url of the graph to be updated. |
| query | <code>string</code> | A SPARQL INSERT/DELETE query. |
| [token] | <code>string</code> | The access token you got from logging in. You don't need to pass the "Bearer" suffix - it is added within the function. |

<a name="User"></a>

## User : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| username | <code>string</code> | 
| email | <code>string</code> | 
| projects | <code>Array.&lt;string&gt;</code> | 
| uri | <code>string</code> | 

<a name="returnUser"></a>

## returnUser : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| user | [<code>User</code>](#User) | 
| token | <code>string</code> | 

<a name="Metadata"></a>

## Metadata : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | URI of the document |
| metadata | <code>Object</code> | The metadata as JSON-LD. |

<a name="Project"></a>

## Project : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| metadata | <code>Object</code> | A JSON-LD object of the project metadata |
| id | <code>string</code> | The project id |
| [uri] | <code>string</code> | The project uri. Optional (only when creating a project => otherwise it is just the url of the request) |
| graphs | <code>resource</code> | An object containing all the graphs in the project. The object key is the graph url, the value is its metadata as JSON-LD. |
| documents | <code>resource</code> | An object containing all the documents in the project. The object key is the document url, the value is its metadata as JSON-LD. |
| [results] | [<code>QueryResults</code>](#QueryResults) | the result of an eventual SPARQL SELECT query. Only if a query was sent along. |

<a name="QueryResults"></a>

## QueryResults : <code>Object</code>
The results of a SPARQL SELECT query.

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| head | <code>Object</code> |  |
| head.vars | <code>Array.&lt;string&gt;</code> |  |
| results | <code>Object</code> |  |
| results.bindings | <code>Array.&lt;Object&gt;</code> | links the variables to the results. |

<a name="Graph"></a>

## Graph : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| uri | <code>string</code> | URI of the document |
| metadata | <code>Object</code> | The metadata as JSON-LD. |
| data | <code>Object</code> | The graph content as JSON-LD |

