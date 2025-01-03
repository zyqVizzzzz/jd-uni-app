// api/interactions.js
import { request } from "@/utils/require.js";

export const interactionsApi = {
	// 获取评论列表
	getComments(params) {
		return request({
			url: "/interactions/comments",
			method: "GET",
			data: params,
		});
	},

	// 发表评论
	createComment(data) {
		return request({
			url: "/interactions/comments",
			method: "POST",
			data,
		});
	},

	// 删除评论
	deleteComment(id) {
		return request({
			url: `/interactions/comments/${id}`,
			method: "DELETE",
		});
	},

	// 评论点赞
	toggleCommentLike(id) {
		return request({
			url: `/interactions/comment/${id}/like`,
			method: "POST",
		});
	},
};
