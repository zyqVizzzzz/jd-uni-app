"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "profileEditGender",
  setup(__props) {
    const selectedGender = common_vendor.ref(null);
    const selectGender = (gender) => {
      console.log(gender);
      common_vendor.index.navigateTo({
        url: "/pages/profileEditBirth/profileEditBirth"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: selectedGender.value === "male" ? 1 : "",
        b: common_vendor.o(($event) => selectGender("male")),
        c: selectedGender.value === "female" ? 1 : "",
        d: common_vendor.o(($event) => selectGender("female"))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9d684c67"], ["__file", "/Users/z/jd-uni-app/pages/profileEditGender/profileEditGender.vue"]]);
wx.createPage(MiniProgramPage);
