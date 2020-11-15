const fs = require("fs");
const path = require("path");
const Copy = require("copy-webpack-plugin");
const version = JSON.parse(fs.readFileSync("./package.json"), "utf8").version;

// pull requests welcome
const supportedBrowsers = ["chrome", "firefox"];

module.exports = (env) => {
  if (!env || !("browser" in env)) {
    throw new Error("⚠️  --env.browser must be passed to webpack");
  }

  if (!supportedBrowsers.includes(env.browser)) {
    throw new Error(`⚠️  --env.browser must be one of ${supportedBrowsers}`);
  }

  const config = {
    // mode can be changed on the commandline, e.g.,
    // npm run build:firefox -- --mode=development
    mode: "production",
    entry: path.resolve(__dirname, "shared/background.js"),
    output: {
      filename: "background.js",
      path: path.resolve(__dirname, `./dist/${env.browser}`),
    },
    plugins: [
      new Copy({
        patterns: [
          {
            from: path.resolve(__dirname, "shared/*.png"),
            to: path.resolve(__dirname, `dist/${env.browser}/icons/[name].png`),
          },
          {
            from: path.resolve(__dirname, "shared/manifest.json"),
            to: path.resolve(__dirname, `dist/${env.browser}/manifest.json`),
            transform: function (manifest) {
              manifest = JSON.parse(manifest);
              // Derive addon versioning from package.json
              manifest["version"] = version;
              let versionMap = {
                firefox: "67.0a1",
                chrome: "63.0.0.0",
              };
              switch (env.browser) {
                case "firefox":
                  // Add Firefox-specific bits to the manifest.json
                  manifest["browser_specific_settings"] = {
                    gecko: {
                      strict_min_version: versionMap["firefox"],
                    },
                  };
                  break;

                default:
                  // Add Chromium-specific manifest keys
                  manifest[`minimum_${env.browser}_version`] =
                    versionMap[env.browser];
              }
              return JSON.stringify(manifest, null, 2);
            },
          },
        ],
      }),
    ],
  };
  return config;
};
