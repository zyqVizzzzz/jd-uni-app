"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "deviceBindSuccess",
  setup(__props) {
    const navigateToProfileEdit = () => {
      console.log("联系客服");
      common_vendor.index.navigateTo({
        url: "/pages/profileEditGender/profileEditGender"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(navigateToProfileEdit)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/deviceBindSuccess/deviceBindSuccess.vue"]]);
wx.createPage(MiniProgramPage);
