"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_require = require("../../utils/require.js");
require("../../config.js");
const _sfc_main = {
  __name: "profileEditGender",
  setup(__props) {
    const selectedGender = common_vendor.ref(null);
    const updateUserInfo = async (data) => {
      try {
        const res = await utils_require.request({
          url: "/users/me",
          method: "POST",
          data
        });
        if (res.data.code === 201) {
          common_vendor.index.navigateTo({
            url: "/pages/profileEditBirth/profileEditBirth"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "更新失败",
          icon: "none"
        });
      }
    };
    const selectGender = (gender) => {
      console.log(gender);
      const genderObj = { male: 1, female: 2 };
      updateUserInfo({
        gender: parseInt(genderObj[gender])
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
