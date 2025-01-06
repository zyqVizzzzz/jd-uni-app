"use strict";
const common_vendor = require("../../common/vendor.js");
const config = require("../../config.js");
const _sfc_main = /* @__PURE__ */ common_vendor.defineComponent({
  __name: "login",
  setup(__props) {
    const loading = common_vendor.ref(false);
    const isLoggedIn = common_vendor.ref(false);
    const token = common_vendor.ref("");
    const userInfo = common_vendor.ref(null);
    const API_BASE_URL = config.config.API_BASE_URL;
    const handleLogin = async () => {
      try {
        loading.value = true;
        const loginRes = await common_vendor.index.login({
          provider: "weixin"
        });
        console.log("微信登录成功", loginRes);
        const res = await common_vendor.index.request({
          url: `${API_BASE_URL}/auth/login`,
          method: "POST",
          data: {
            code: loginRes.code
          }
        });
        console.log("后端登录成功", res);
        if (res.statusCode === 201 && res.data.access_token) {
          token.value = res.data.access_token;
          isLoggedIn.value = true;
          userInfo.value = res.data.user;
          common_vendor.index.setStorageSync("token", res.data.access_token);
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success"
          });
        } else {
          throw new Error("登录失败");
        }
      } catch (error) {
        console.error("登录错误", error);
        common_vendor.index.showToast({
          title: "登录失败",
          icon: "error"
        });
      } finally {
        loading.value = false;
      }
    };
    const getUserProfile = async () => {
      try {
        const profileRes = await common_vendor.index.getUserProfile({
          desc: "用于完善用户资料"
        });
        console.log("获取用户信息成功", profileRes);
        const res = await common_vendor.index.request({
          url: `${API_BASE_URL}/auth/update-userinfo`,
          method: "POST",
          data: profileRes.userInfo,
          header: {
            Authorization: `Bearer ${token.value}`
          }
        });
        console.log("更新用户信息成功", res);
        if (res.statusCode === 200) {
          userInfo.value = res.data;
          common_vendor.index.showToast({
            title: "更新成功",
            icon: "success"
          });
        }
      } catch (error) {
        console.error("获取用户信息错误", error);
        common_vendor.index.showToast({
          title: "获取信息失败",
          icon: "error"
        });
      }
    };
    common_vendor.onMounted(() => {
      const savedToken = common_vendor.index.getStorageSync("token");
      if (savedToken) {
        token.value = savedToken;
        isLoggedIn.value = true;
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(isLoggedIn.value ? "已登录" : "未登录"),
        b: common_vendor.n(isLoggedIn.value ? "success" : "default"),
        c: token.value
      }, token.value ? {
        d: common_vendor.t(token.value)
      } : {}, {
        e: userInfo.value
      }, userInfo.value ? {
        f: common_vendor.t(JSON.stringify(userInfo.value, null, 2))
      } : {}, {
        g: common_vendor.t(loading.value ? "登录中..." : "测试登录"),
        h: common_vendor.o(handleLogin),
        i: loading.value,
        j: isLoggedIn.value
      }, isLoggedIn.value ? {
        k: common_vendor.o(getUserProfile)
      } : {});
    };
  }
});
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/test/login.vue"]]);
wx.createPage(MiniProgramPage);
