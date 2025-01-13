// api/points.js
import { request } from "@/utils/require";

export const pointApi = {
	// 获取动态列表
	getDailyTasks: (params) => {
		return request({
			url: "/points/daily-tasks",
			method: "GET",
			data: params,
		});
	},

	getUserPoints: (params) => {
		return request({
			url: "/points",
			method: "GET",
			data: params,
		});
	},

	getPointsHistory: (params) => {
		return request({
			url: "/points/history",
			method: "GET",
			data: params,
		});
	},
};
