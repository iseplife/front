const {override, fixBabelImports, addLessLoader} = require("customize-cra")
const {rewireWorkboxGenerate, defaultInjectConfig, rewireWorkboxInject} = require("react-app-rewire-workbox")
const path = require("path")

module.exports = override(
    fixBabelImports("import", {
        libraryName: "antd",
        libraryDirectory: "es",
        style: true,
    }),
    rewireWorkboxInject({
        ...defaultInjectConfig,
        swSrc: "./src/service-worker.ts",
        swDest: './dist/sw.js',
    })
)