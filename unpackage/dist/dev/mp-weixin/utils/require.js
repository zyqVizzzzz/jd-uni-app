"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://localhost:3000";
const request = async (options) => {
  const { url, method = "GET", data, header = {} } = options;
  const token = common_vendor.index.getStorageSync("token");
  if (token) {
    header.Authorization = `Bearer ${token}`;
  }
  try {
    const res = await common_vendor.index.request({
      url: BASE_URL + url,
      method,
      data,
      header
    });
    if (res.statusCode === 401) {
      common_vendor.index.removeStorageSync("token");
    }
    return res;
  } catch (error) {
    console.error("请求错误", error);
    throw error;
  }
};
exports.request = request;
