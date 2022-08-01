const CracoEsbuildPlugin = require("craco-esbuild")
const commitHash = require('child_process').execSync('git rev-parse --short HEAD').toString()

process.env.REACT_APP_COMMIT = commitHash
console.log("Hash set to", commitHash)

module.exports = {
    plugins: [
      {
        plugin: CracoEsbuildPlugin,
      },
    ],
  }