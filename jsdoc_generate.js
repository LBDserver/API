const jsdoc2md = require('jsdoc-to-markdown')
const fs = require('fs')

const readmeText = `# LBDserver API

Documentation for the LBDserver project. Includes shared interfaces as well as functions for communicating with the LBDserver backend.
`

try {
    fs.unlinkSync("./README.md")
    fs.writeFileSync("./README.md", readmeText)
    jsdoc2md.render({ files: 'dist/functions/functions.js' })
    .then(output => fs.appendFile('README.md', output, function (err) {
        if (err) throw err;
        console.log('Saved!');
      }))
  } catch(err) {
    console.error(err)
  }

