interface IAgent {
    uri: string,
    type: AgentType,
    roles: string[],
    permissions: Array<PermissionType>
}

type PermissionType = "http://www.w3.org/ns/auth/acl#Read" | "http://www.w3.org/ns/auth/acl#Write" | "http://www.w3.org/ns/auth/acl#Append" | "http://www.w3.org/ns/auth/acl#Control"
type AgentType = "http://www.w3.org/ns/auth/acl#agent" | "http://www.w3.org/ns/auth/acl#agentGroup" | "http://www.w3.org/ns/auth/acl#agentClass"

export {
    IAgent,
    AgentType,
    PermissionType
}