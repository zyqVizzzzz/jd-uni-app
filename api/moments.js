// api/moments.js
import { request } from "@/utils/require";
import config from "@/config";

// 动态相关的 API
export const momentApi = {
	// 获取动态列表
	getMoments: (params) => {
		return request({
			url: "/moments",
			method: "GET",
			data: params,
		});
	},

	getMomentDetail: (id) => {
		return request({
			url: "/moments/" + id,
			method: "GET",
		});
	},

	// 发布动态
	createMoment: (data) => {
		return request({
			url: "/moments",
			method: "POST",
			data,
		});
	},

	// 删除动态
	deleteMoment: (momentId) => {
		return request({
			url: `/moments/${momentId}`,
			method: "DELETE",
		});
	},

	// 上传图片，一次性上传多张
	batchUploadImages: (filePaths) => {
		return new Promise((resolve, reject) => {
			const token = uni.getStorageSync("token");

			uni.uploadFile({
				url: `${config.API_BASE_URL}/moments/upload`,
				files: filePaths.map((path) => ({
					name: "images",
					uri: path,
				})),
				header: {
					Authorization: `Bearer ${token}`,
				},
				success: (res) => {
					const data = JSON.parse(res.data);
					resolve(data);
				},
				fail: (err) => {
					reject(err);
				},
			});
		});
	},

	// 点赞动态
	likeMoment: (momentId) => {
		return request({
			url: `/moments/${momentId}/like`,
			method: "POST",
		});
	},

	// 取消点赞
	unlikeMoment: (momentId) => {
		return request({
			url: `/moments/${momentId}/unlike`,
			method: "POST",
		});
	},
};
