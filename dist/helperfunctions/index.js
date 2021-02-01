const util = require('util');
const validate = require('turtle-validator');
const N3 = require('n3');
const newEngine = require('@comunica/actor-init-sparql-rdfjs').newEngine;
function validateTTL(data) {
    return new Promise((resolve, reject) => {
        validate(data, (fb) => {
            if (fb.warnings.length === 0 && fb.errors.length === 0) {
                resolve();
            }
            else {
                reject(fb);
            }
        });
    });
}
async function queryRawTTL(data, query) {
    try {
        // validate data
        await validateTTL(data);
        // query data
        const parser = new N3.Parser();
        const store = new N3.Store();
        const myEngine = newEngine();
        const parsed = parser.parse(data);
        parsed.forEach(quad => store.addQuad(quad));
        const result = await myEngine.query(query, { sources: [store] });
        let bindings = await result.bindings();
        return bindings;
    }
    catch (error) {
        error.message = `Could not query this data - ${error.message}`;
        throw error;
    }
}
async function hasPermission(url, permission) {
    // fetch ACL rights of the current user
    return true;
}
export { validateTTL, queryRawTTL, hasPermission };
