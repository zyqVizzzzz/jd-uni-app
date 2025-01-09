"use strict";
const utils_require = require("../utils/require.js");
const userRelationsApi = {
  // 关注用户
  followUser(userId) {
    return utils_require.request({
      url: `/user-relations/follow/${userId}`,
      method: "POST"
    });
  },
  // 取消关注
  unfollowUser(userId) {
    return utils_require.request({
      url: `/user-relations/follow/${userId}`,
      method: "DELETE"
    });
  },
  // 获取关系状态
  getRelationStatus(userId) {
    return utils_require.request({
      url: `/user-relations/check/${userId}`,
      method: "GET"
    });
  }
};
exports.userRelationsApi = userRelationsApi;
