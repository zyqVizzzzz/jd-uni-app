// api/userRelations.js
import { request } from "@/utils/require";

export const userRelationsApi = {
	// 关注用户
	followUser(userId) {
		return request({
			url: `/user-relations/follow/${userId}`,
			method: "POST",
		});
	},

	// 取消关注
	unfollowUser(userId) {
		return request({
			url: `/user-relations/follow/${userId}`,
			method: "DELETE",
		});
	},

	// 获取关系状态
	getRelationStatus(userId) {
		return request({
			url: `/user-relations/check/${userId}`,
			method: "GET",
		});
	},
};
