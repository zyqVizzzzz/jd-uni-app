"use strict";const e=require("../common/vendor.js"),r=require("../config.js").config.API_BASE_URL;exports.request=async t=>{const{url:o,method:n="GET",data:a,header:s={}}=t,c=e.index.getStorageSync("token");c&&(s.Authorization=`Bearer ${c}`);try{const t=await e.index.request({url:r+o,method:n,data:a,header:s});return 401===t.statusCode&&e.index.removeStorageSync("token"),t}catch(d){throw console.error("请求错误",d),d}};
