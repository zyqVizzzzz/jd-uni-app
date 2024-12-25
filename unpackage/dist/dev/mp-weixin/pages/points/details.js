"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "details",
  setup(__props) {
    const pointsList = common_vendor.ref([
      {
        title: "游泳距离达到500米",
        time: "2023.07.11 20:55:45",
        points: 40
      },
      {
        title: "游泳距离达到500米",
        time: "2023.07.11 20:55:45",
        points: 40
      },
      {
        title: "游泳距离达到500米",
        time: "2023.07.11 20:55:45",
        points: 40
      }
    ]);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(pointsList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.time),
            c: common_vendor.t(item.points),
            d: index
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-11052294"], ["__file", "/Users/z/jd-uni-app/pages/points/details.vue"]]);
wx.createPage(MiniProgramPage);
