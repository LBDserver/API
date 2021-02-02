import {QueryEngineComunicaSolid} from "graphql-ld-comunica-solid";
import {Client} from "graphql-ld";
import { queryRawTTL } from ".";
const URL = (typeof window !== 'undefined' && window.URL)
  ? window.URL : require('url').URL

async function query(query, sources, session){
    try {
        const comunicaConfig = {
            sources
        };
        
        const myEngine = new QueryEngineComunicaSolid(comunicaConfig)
        myEngine.comunicaEngine.invalidateHttpCache()

        const result = await myEngine.query(query, { sources })
        return result.results.bindings

        // let bindings = []
        // for (const source of sources) {
        //     const res = await session.fetch(source)    
        //     const doc = await res.text()
        //     const results = await queryRawTTL(doc, query)
        //     results.forEach(r => {
        //         let res
        //         try {
        //             res = new URL(r)
        //             console.log('res', res)
        //         } catch (error) {
        //             res = ``
        //         }
        //     })
        //     console.log('results', results)
        //     bindings = [...bindings, ...results]
        // }

        // return bindings
    } catch (error) {
        error.message = `Could not query resource - ${error.message}`
        throw error
    }
}

export {
    query
}