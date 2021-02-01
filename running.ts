import { SolidNodeClient } from 'solid-node-client';
import {uploadDocument} from './lib/functions/lbd-solid'
import {ILoggedInSolidSession} from "solid-auth-fetcher/dist/solidSession/ISolidSession"
var fs = require('fs');
var data = fs.readFileSync('/home/jmauwerb/Pictures/5fav.JPG');
var file = Buffer.from(data);
const client = new SolidNodeClient()

const url1 = "https://jwerbrouck.inrupt.net/public/private/duplex.ttl"
const url2 = 'http://localhost:3000/lbd'
async function main () {
    let session = await client.login({idp: "https://inrupt.net", username: "jwerbrouck", password: "SY1925@pod"})
    if( session ) {
        console.log(session)
        console.log (`logged in as <${session["webId"]}>`);
        let response = await client.fetch(url1, {});
        console.log(await response.text())
    }    
}

main()

// uploadDocument("http://localhost:3000/jeroen/file3.json", JSON.stringify({"test": "some tqdfsqdfext"}), "<ex:s> <ex:p> <ex:o>.", {overwrite: true}, null)