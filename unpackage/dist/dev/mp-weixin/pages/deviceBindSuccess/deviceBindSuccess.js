"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_require = require("../../utils/require.js");
require("../../config.js");
const _sfc_main = {
  __name: "deviceBindSuccess",
  setup(__props) {
    const checkUserInfo = async () => {
      try {
        const res = await utils_require.request({
          url: "/users/me"
        });
        if (res.data.code === 200) {
          const userData = res.data.data;
          const fieldsToCheck = [
            { key: "gender", page: "/pages/profileEditGender/profileEditGender" },
            { key: "birthday", page: "/pages/profileEditBirth/profileEditBirth" },
            { key: "height", page: "/pages/profileEditHeight/profileEditHeight" },
            { key: "weight", page: "/pages/profileEditWeight/profileEditWeight" },
            {
              key: "target",
              page: "/pages/profileEditTarget/profileEditTarget"
            }
          ];
          const allFieldsFilled = fieldsToCheck.every(
            (field) => userData[field.key] && userData[field.key] !== "" && userData[field.key] !== 0
          );
          console.log(allFieldsFilled);
          if (allFieldsFilled) {
            return "/pages/deviceSetting/deviceSetting";
          }
          const firstMissingField = fieldsToCheck.find(
            (field) => !userData[field.key] || userData[field.key] === "" || userData[field.key] === 0
          );
          common_vendor.index.setStorageSync("userInfo", JSON.stringify(userData));
          return firstMissingField.page;
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
        return "/pages/profileEditGender/profileEditGender";
      }
    };
    const navigateToNextPage = async () => {
      const nextPage = await checkUserInfo();
      common_vendor.index.navigateTo({
        url: nextPage
      });
    };
    common_vendor.onMounted(() => {
      checkUserInfo();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(navigateToNextPage)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/deviceBindSuccess/deviceBindSuccess.vue"]]);
wx.createPage(MiniProgramPage);
