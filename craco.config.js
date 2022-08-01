const CracoEsbuildPlugin = require("craco-esbuild")
const fs = require('fs')

const file = fs.readFileSync(".git/HEAD").toString()
const hash = !file.includes("/") ? file.split("\n")[0] : fs.readFileSync(`.git/${file.split("\n")[0].substring(5)}`)
const commitHash = hash.toString().trim().substring(0, 6)
const browserslistToEsbuild = require("browserslist-to-esbuild")

process.env.REACT_APP_COMMIT = commitHash
console.log("Hash set to", commitHash)

const version = browserslistToEsbuild()

console.log("Building for ECMA ", version)

module.exports = {
    plugins: [
      {
        plugin: CracoEsbuildPlugin,
        options: {
          esbuildLoaderOptions: {
            loader: 'tsx', // Set the value to 'tsx' if you use typescript
            target: version,
          },
          esbuildMinimizerOptions: {
            target: version,
            css: true, // if true, OptimizeCssAssetsWebpackPlugin will also be replaced by esbuild.
          },
        },
      },
    ],
  }