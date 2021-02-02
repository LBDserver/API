import {v4} from 'uuid'
import {validateTTL} from '../helperfunctions'
import {IAgent} from '../interfaces/consolidInterface'

async function aclTemplate (stakeholders: Array<IAgent>) {
    try {
        let graph = `@prefix  acl:  <http://www.w3.org/ns/auth/acl#> .       
        `

        stakeholders.forEach(st => {
            let modes = ''
            st.permissions.forEach(perm => {
                modes += `<${perm}>, `
            })
            modes = modes.substring(0, modes.length - 2);
    
            graph += `
    <#${v4()}>
        a acl:Authorization;
        acl:accessTo    <./>;
        acl:default     <./> ;
        <${st.type}> <${st.uri}>;
        acl:mode ${modes}.
            `
        })

        console.log('graph', graph)
    
        await validateTTL(graph)
        return graph
    } catch (error) {
        error.message = `Could not create ACL graph - ${error.message}`
        throw error
    }
}

async function stakeholderTemplate (stakeholders: Array<IAgent>) {
    try {
        let graph = `@prefix  lbd:  <http://lbdserver.org/vocabulary/> .`

        stakeholders.forEach(st => {
            if (st.roles) {
                let roles = 'lbd:Stakeholder, '
                st.roles.forEach(role => {
                    roles += `<${role}>, `
                })
                roles = roles.substring(0, roles.length - 2) + '.'
        
                graph += `<${st.uri}> a ${roles}`
            }
        })
   
        await validateTTL(graph)
        return graph
    } catch (error) {
        error.message = `Could not create ACL graph - ${error.message}`
        throw error
    }
}

export {
    aclTemplate,
    stakeholderTemplate
}