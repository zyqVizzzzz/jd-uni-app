"use strict";
const utils_require = require("../utils/require.js");
const pointApi = {
  // 获取动态列表
  getDailyTasks: (params) => {
    return utils_require.request({
      url: "/points/daily-tasks",
      method: "GET",
      data: params
    });
  },
  getUserPoints: (params) => {
    return utils_require.request({
      url: "/points",
      method: "GET",
      data: params
    });
  },
  getPointsHistory: (params) => {
    return utils_require.request({
      url: "/points/history",
      method: "GET",
      data: params
    });
  }
};
exports.pointApi = pointApi;
