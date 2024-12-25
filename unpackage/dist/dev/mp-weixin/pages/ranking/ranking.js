"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  setup() {
    const selectedLocation = common_vendor.ref("national");
    const activeTab = common_vendor.ref("year");
    const selectLocation = (type) => {
      selectedLocation.value = type;
    };
    const selectTab = (tab) => {
      activeTab.value = tab;
    };
    return {
      selectedLocation,
      activeTab,
      selectLocation,
      selectTab
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $setup.selectedLocation === "national" ? 1 : "",
    b: common_vendor.o(($event) => $setup.selectLocation("national")),
    c: $setup.selectedLocation === "local" ? 1 : "",
    d: common_vendor.o(($event) => $setup.selectLocation("local")),
    e: $setup.activeTab === "day" ? 1 : "",
    f: common_vendor.o(($event) => $setup.selectTab("day")),
    g: $setup.activeTab === "month" ? 1 : "",
    h: common_vendor.o(($event) => $setup.selectTab("month")),
    i: $setup.activeTab === "year" ? 1 : "",
    j: common_vendor.o(($event) => $setup.selectTab("year")),
    k: common_vendor.f(4, (i, k0, i0) => {
      return {
        a: common_vendor.t(i + 3),
        b: common_vendor.t(3e4 - i * 1e3),
        c: i
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/z/jd-uni-app/pages/ranking/ranking.vue"]]);
wx.createPage(MiniProgramPage);
