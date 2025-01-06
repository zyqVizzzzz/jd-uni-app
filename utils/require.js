import config from "@/config";
const BASE_URL = config.API_BASE_URL; // 可以根据环境变量配置不同的地址

export const request = async (options) => {
	const { url, method = "GET", data, header = {} } = options;

	// 获取存储的 token
	const token = uni.getStorageSync("token");
	if (token) {
		header.Authorization = `Bearer ${token}`;
	}

	try {
		const res = await uni.request({
			url: BASE_URL + url,
			method,
			data,
			header,
		});

		if (res.statusCode === 401) {
			// token 过期处理
			uni.removeStorageSync("token");
			// 可以在这里添加重新登录逻辑
		}

		return res;
	} catch (error) {
		console.error("请求错误", error);
		throw error;
	}
};
