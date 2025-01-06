"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  setup() {
    const distanceAlert = common_vendor.ref(false);
    const timeAlert = common_vendor.ref(false);
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const handleDeviceStatus = () => {
    };
    const handlePoolLength = () => {
    };
    const handleLanguage = () => {
    };
    const handleFont = () => {
    };
    const handleDistanceAlert = (e) => {
      distanceAlert.value = e.detail.value;
    };
    const handleTimeAlert = (e) => {
      timeAlert.value = e.detail.value;
    };
    const handleSave = () => {
      common_vendor.index.showToast({
        title: "设置已保存",
        icon: "success"
      });
      common_vendor.index.switchTab({
        url: "/pages/mine/mine"
      });
    };
    return {
      distanceAlert,
      timeAlert,
      goBack,
      handleDeviceStatus,
      handlePoolLength,
      handleLanguage,
      handleFont,
      handleDistanceAlert,
      handleTimeAlert,
      handleSave
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $setup.handleDeviceStatus && $setup.handleDeviceStatus(...args)),
    b: common_vendor.o((...args) => $setup.handlePoolLength && $setup.handlePoolLength(...args)),
    c: common_vendor.o((...args) => $setup.handleLanguage && $setup.handleLanguage(...args)),
    d: common_vendor.o((...args) => $setup.handleFont && $setup.handleFont(...args)),
    e: $setup.distanceAlert,
    f: common_vendor.o((...args) => $setup.handleDistanceAlert && $setup.handleDistanceAlert(...args)),
    g: $setup.timeAlert,
    h: common_vendor.o((...args) => $setup.handleTimeAlert && $setup.handleTimeAlert(...args)),
    i: common_vendor.o((...args) => $setup.handleSave && $setup.handleSave(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2e281982"], ["__file", "/Users/z/jd-uni-app/pages/deviceSetting/deviceSetting.vue"]]);
wx.createPage(MiniProgramPage);
