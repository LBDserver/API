const jsdoc2md = require('jsdoc-to-markdown')
const fs = require('fs')

const readmeText = `# LBDserver API

Documentation for the LBDserver project. Includes shared interfaces as well as functions for communicating with the LBDserver backend.

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

