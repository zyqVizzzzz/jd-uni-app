"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "device",
  setup(__props) {
    const navigateToSearch = () => {
      common_vendor.index.navigateTo({
        url: "/pages/deviceSearch/deviceSearch"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(navigateToSearch)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/device/device.vue"]]);
wx.createPage(MiniProgramPage);
