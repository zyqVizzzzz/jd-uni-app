"use strict";
const utils_require = require("../utils/require.js");
const commentsApi = {
  // 获取评论列表
  getComments(momentId) {
    return utils_require.request({
      url: `/comments/moment/${momentId}`,
      method: "GET"
    });
  },
  // 发表评论
  createComment(momentId, data) {
    return utils_require.request({
      url: `/comments/moment/${momentId}`,
      method: "POST",
      data
    });
  },
  // 回复评论
  replyComment(commentId, data) {
    console.log(commentId);
    return utils_require.request({
      url: `/comments/reply/${commentId}`,
      method: "POST",
      data
    });
  },
  // 删除评论
  deleteComment(id) {
    return utils_require.request({
      url: `/comments/${id}`,
      method: "DELETE"
    });
  }
};
exports.commentsApi = commentsApi;
