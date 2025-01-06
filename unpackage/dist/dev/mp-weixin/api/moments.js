"use strict";
const common_vendor = require("../common/vendor.js");
const utils_require = require("../utils/require.js");
const config = require("../config.js");
const momentApi = {
  // 获取动态列表
  getMoments: (params) => {
    return utils_require.request({
      url: "/moments",
      method: "GET",
      data: params
    });
  },
  getMomentDetail: (id) => {
    return utils_require.request({
      url: "/moments/" + id,
      method: "GET"
    });
  },
  // 发布动态
  createMoment: (data) => {
    return utils_require.request({
      url: "/moments",
      method: "POST",
      data
    });
  },
  // 上传图片，一次性上传多张
  batchUploadImages: (filePaths) => {
    return new Promise((resolve, reject) => {
      const token = common_vendor.index.getStorageSync("token");
      common_vendor.index.uploadFile({
        url: `${config.config.API_BASE_URL}/moments/upload`,
        files: filePaths.map((path) => ({
          name: "images",
          uri: path
        })),
        header: {
          Authorization: `Bearer ${token}`
        },
        success: (res) => {
          const data = JSON.parse(res.data);
          resolve(data);
        },
        fail: (err) => {
          reject(err);
        }
      });
    });
  },
  // 点赞动态
  likeMoment: (momentId) => {
    return utils_require.request({
      url: `/moments/${momentId}/like`,
      method: "POST"
    });
  },
  // 取消点赞
  unlikeMoment: (momentId) => {
    return utils_require.request({
      url: `/moments/${momentId}/unlike`,
      method: "POST"
    });
  }
};
exports.momentApi = momentApi;
