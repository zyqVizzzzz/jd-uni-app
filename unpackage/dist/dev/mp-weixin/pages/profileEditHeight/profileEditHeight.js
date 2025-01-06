"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_require = require("../../utils/require.js");
require("../../config.js");
if (!Math) {
  ScrollPicker();
}
const ScrollPicker = () => "../../components/ScrollPicker.js";
const _sfc_main = {
  __name: "profileEditHeight",
  setup(__props) {
    const goPrevious = () => {
      common_vendor.index.navigateBack();
    };
    const goNext = () => {
      var _a;
      const selectedHeight = (_a = heightColumns[0].options.find(
        (opt) => opt.value === heightColumns[0].defaultValue
      )) == null ? void 0 : _a.value;
      updateUserInfo({
        height: parseInt(selectedHeight)
      });
    };
    const updateUserInfo = async (data) => {
      try {
        const res = await utils_require.request({
          url: "/users/me",
          method: "POST",
          data
        });
        if (res.data.code === 201) {
          common_vendor.index.navigateTo({
            url: "/pages/profileEditTarget/profileEditTarget"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "更新失败",
          icon: "none"
        });
      }
    };
    const generateHeightOptions = (minHeight, maxHeight) => {
      const options = [];
      for (let height = minHeight; height <= maxHeight; height++) {
        options.push({
          label: height.toString(),
          value: height.toString()
        });
      }
      return options;
    };
    const heightColumns = common_vendor.reactive([
      {
        options: generateHeightOptions(50, 250),
        defaultValue: "170"
      }
    ]);
    const handleHeightChange = (e) => {
      const { values } = e;
      if (values[0]) {
        heightColumns[0].defaultValue = values[0].value;
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleHeightChange),
        b: common_vendor.p({
          columns: heightColumns,
          title: "您的身高(CM)"
        }),
        c: common_vendor.o(goPrevious),
        d: common_vendor.o(goNext)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d97c1f04"], ["__file", "/Users/z/jd-uni-app/pages/profileEditHeight/profileEditHeight.vue"]]);
wx.createPage(MiniProgramPage);
