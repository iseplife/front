const CracoEsbuildPlugin = require("craco-esbuild")
const fs = require('fs')

const file = fs.readFileSync(".git/HEAD").toString()
const hash = !file.includes("/") ? file.split("\n")[0] : fs.readFileSync(`.git/${file.split("\n")[0].substring(5)}`)
const commitHash = hash.toString().trim().substring(0, 6)

process.env.REACT_APP_COMMIT = commitHash
console.log("Hash set to", commitHash)

module.exports = {
    plugins: [
      {
        plugin: CracoEsbuildPlugin,
      },
    ],
  }