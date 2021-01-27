import {v4} from 'uuid'
import {validateTTL} from '../helperfunctions'
import {IAgent} from '../interfaces/consolidInterface'

async function aclTemplate (stakeholders: Array<IAgent>) {
    try {
        let graph = `@prefix  acl:  <http://www.w3.org/ns/auth/acl#>
<#        
        `

        stakeholders.forEach(st => {
            let modes = ''
            st.permissions.forEach(perm => {
                modes += `<${perm}>,`
            })
            modes = modes.substring(0, modes.length - 1);
    
            graph += `
    <#${v4()}>
        a acl:Authorization;
        <${st.type}> <${st.uri}>;
        acl:mode ${modes}.
            `
        })
    
        await validateTTL(graph)
        return graph
    } catch (error) {
        error.message = `Could not create ACL graph - ${error.message}`
        throw error
    }
}

export {
    aclTemplate
}