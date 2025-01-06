"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_require = require("../../utils/require.js");
require("../../config.js");
if (!Math) {
  ScrollPicker();
}
const ScrollPicker = () => "../../components/ScrollPicker.js";
const _sfc_main = {
  __name: "profileEditTarget",
  setup(__props) {
    const goPrevious = () => {
      common_vendor.index.navigateBack();
    };
    const goNext = () => {
      var _a;
      const selectedTarget = (_a = targetColumns[0].options.find(
        (opt) => opt.value === targetColumns[0].defaultValue
      )) == null ? void 0 : _a.value;
      updateUserInfo({
        target: parseInt(selectedTarget)
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
            url: "/pages/deviceSetting/deviceSetting"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "更新失败",
          icon: "none"
        });
      }
    };
    const generateTargetOptions = () => {
      const options = [];
      for (let target = 0; target <= 5e3; target += 500) {
        options.push({
          label: target.toString(),
          value: target.toString()
        });
      }
      return options;
    };
    const targetColumns = common_vendor.reactive([
      {
        options: generateTargetOptions(),
        defaultValue: "2000"
        // 默认值设为2000米
      }
    ]);
    const handleTargetChange = (e) => {
      const { values } = e;
      if (values[0]) {
        targetColumns[0].defaultValue = values[0].value;
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleTargetChange),
        b: common_vendor.p({
          columns: targetColumns,
          title: "设定月度目标(M)"
        }),
        c: common_vendor.o(goPrevious),
        d: common_vendor.o(goNext)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9cf5ac25"], ["__file", "/Users/z/jd-uni-app/pages/profileEditTarget/profileEditTarget.vue"]]);
wx.createPage(MiniProgramPage);
