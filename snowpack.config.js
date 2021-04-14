// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    public: {
			url: "/", static: true
		},
		src: {
			url: "/dist"
		}
	},
  plugins: [
		["@snowpack/plugin-webpack", {
			sourceMap: true,
			// extendConfig: (config) => {
			//	config.plugins.push(...);
			// 	return config;
			// }
		}],
		"@snowpack/plugin-react-refresh",
    "@snowpack/plugin-dotenv"
  ],
	optimize: {
		bundle: true,
	}
};
