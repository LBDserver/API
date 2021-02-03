const jsdoc2md = require('jsdoc-to-markdown')
const fs = require('fs')

const readmeText = `# LBDserver API

Documentation for the LBDserver project running on the Solid Community Server. LBDserver is a project for managing Linked Building Data, using both RDF and non-RDF resources. To make the LBDserver infrastructure federated, we base upon on the (WIP) [Community Solid Server prototype](https://github.com/solid/community-server). Note that both the CSS as this API functions are still higly experimental. The API is used, amongst others, in the [LBDserver frontend conSOlid prototype](https://github.com/LBDserver/front-react/tree/consolid-front).

## Installation

Install the package with NPM:

\`\`\`bash
$ npm install lbd-solid
\`\`\`
`

try {
    fs.unlinkSync("./README.md")
    fs.writeFileSync("./README.md", readmeText)
    jsdoc2md.render({ files: 'dist/functions/lbd-solid.js' })
    .then(output => fs.appendFile('README.md', output, function (err) {
        if (err) throw err;
        console.log('Saved!');
      }))
  } catch(err) {
    console.error(err)
  }

