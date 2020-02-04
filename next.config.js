let Dotenv = require("dotenv")
let P = require("path")
let Webpack = require("webpack")

Dotenv.config()
let mode = process.env.NODE_ENV == "production" ? "production" : "development"

module.exports = {
  webpack(config, {buildId, dev, isServer, defaultLoaders}) {
    // WTF is dev?
    config.mode = mode

    config.resolve.modules.push(P.resolve("./"))

    config.plugins.push(new Webpack.EnvironmentPlugin([
      "JWT_SECRET",
      "GITHUB_APP_ID"
    ]))

    return config
  },
}
