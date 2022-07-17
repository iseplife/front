const {override, fixBabelImports} = require("customize-cra")
const { defaultInjectConfig, rewireWorkboxInject} = require("react-app-rewire-workbox")

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