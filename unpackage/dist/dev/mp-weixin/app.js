"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/data/data.js";
  "./pages/mine/mine.js";
  "./pages/ranking/ranking.js";
  "./pages/swimmer/swimmer.js";
  "./pages/test/login.js";
  "./pages/index/index.js";
  "./pages/setting/setting.js";
  "./pages/profile/profile.js";
  "./pages/dataCenter/dataCenter.js";
  "./pages/deviceSearch/deviceSearch.js";
  "./pages/device/device.js";
  "./pages/deviceBindSuccess/deviceBindSuccess.js";
  "./pages/contactCostumer/contactCostumer.js";
  "./pages/profileEdit/profileEdit.js";
  "./pages/profileEditWeight/profileEditWeight.js";
  "./pages/profileEditGender/profileEditGender.js";
  "./pages/profileEditBirth/profileEditBirth.js";
  "./pages/profileEditHeight/profileEditHeight.js";
  "./pages/profileEditTarget/profileEditTarget.js";
  "./pages/deviceSetting/deviceSetting.js";
  "./pages/share/share.js";
  "./pages/points/points.js";
  "./pages/points/details.js";
  "./pages/message/message.js";
}
const _sfc_main = {
  onLaunch: function() {
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
const App = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/App.vue"]]);
function createApp() {
  const app = common_vendor.createSSRApp(App);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
