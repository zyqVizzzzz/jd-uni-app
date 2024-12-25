"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  WeightScale();
}
const WeightScale = () => "../../components/WeightScale.js";
const _sfc_main = {
  __name: "profileEditWeight",
  setup(__props) {
    const weight = common_vendor.ref(54);
    const goPrevious = () => {
      common_vendor.index.navigateBack();
    };
    const goNext = () => {
      common_vendor.index.navigateTo({
        url: "/pages/profileEditHeight/profileEditHeight"
      });
    };
    const handleWeightChange = (value) => {
      weight.value = value;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleWeightChange),
        b: common_vendor.o(($event) => weight.value = $event),
        c: common_vendor.p({
          min: 30,
          max: 150,
          step: 1,
          modelValue: weight.value
        }),
        d: common_vendor.o(goPrevious),
        e: common_vendor.o(goNext)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e16614c4"], ["__file", "/Users/z/jd-uni-app/pages/profileEditWeight/profileEditWeight.vue"]]);
wx.createPage(MiniProgramPage);
