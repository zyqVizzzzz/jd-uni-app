const config = {
	development: {
		API_BASE_URL: "http://localhost:3000",
		// API_BASE_URL: "http://43.143.120.59:3000",
		// API_BASE_URL: "https://api.jazzdawn.com",
	},
	production: {
		API_BASE_URL: "https://api.jazzdawn.com",
	},
};

// 根据环境返回对应的配置
const env = process.env.NODE_ENV || "development";
export default config[env];
