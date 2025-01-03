// api/comments.js
import { request } from "../utils/require.js";

export const commentsApi = {
	// 获取评论列表
	getComments(momentId) {
		return request({
			url: `/comments/moment/${momentId}`,
			method: "GET",
		});
	},

	// 发表评论
	createComment(momentId, data) {
		return request({
			url: `/comments/moment/${momentId}`,
			method: "POST",
			data,
		});
	},

	// 回复评论
	replyComment(commentId, data) {
		console.log(commentId);
		return request({
			url: `/comments/reply/${commentId}`,
			method: "POST",
			data,
		});
	},

	// 删除评论
	deleteComment(id) {
		return request({
			url: `/comments/${id}`,
			method: "DELETE",
		});
	},
};
