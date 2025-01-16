"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "setting",
  setup(__props) {
    const userInfo = common_vendor.ref({});
    common_vendor.onMounted(() => {
      const localUserInfo = common_vendor.index.getStorageSync("userInfo");
      if (localUserInfo) {
        try {
          userInfo.value = JSON.parse(localUserInfo);
        } catch (e) {
          console.error("解析本地用户信息失败:", e);
        }
      }
    });
    common_vendor.onShow(() => {
      const localUserInfo = common_vendor.index.getStorageSync("userInfo");
      if (localUserInfo) {
        try {
          userInfo.value = JSON.parse(localUserInfo);
        } catch (e) {
          console.error("解析本地用户信息失败:", e);
        }
      }
    });
    const navigateToProfile = () => {
      common_vendor.index.navigateTo({
        url: "/pages/profile/profile"
      });
    };
    const navigateToAbout = () => {
      common_vendor.index.navigateTo({
        url: "/pages/about/about"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: userInfo.value.avatarUrl || "/static/avatar.png",
        b: common_vendor.o(navigateToProfile),
        c: common_vendor.o(navigateToAbout)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/setting/setting.vue"]]);
wx.createPage(MiniProgramPage);
