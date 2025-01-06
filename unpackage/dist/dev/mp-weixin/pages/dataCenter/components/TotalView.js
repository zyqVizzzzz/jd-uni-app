"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_require = require("../../../utils/require.js");
const pages_dataCenter_components_format = require("./format.js");
require("../../../config.js");
const _sfc_main = {
  __name: "TotalView",
  setup(__props) {
    const totalData = common_vendor.ref(null);
    const formatDisplayDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    };
    const fetchTotalData = async () => {
      var _a;
      try {
        const res = await utils_require.request({
          url: "/swimming/total-records",
          method: "GET"
        });
        if (((_a = res.data) == null ? void 0 : _a.code) === 200) {
          totalData.value = res.data.data;
        }
      } catch (err) {
        console.error("获取总计数据失败:", err);
        totalData.value = null;
      }
    };
    common_vendor.onMounted(() => {
      fetchTotalData();
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f;
      return common_vendor.e({
        a: (_a = totalData.value) == null ? void 0 : _a.totals
      }, ((_b = totalData.value) == null ? void 0 : _b.totals) ? {
        b: common_vendor.t(totalData.value.totals.totalDistance || 0),
        c: common_vendor.t(common_vendor.unref(pages_dataCenter_components_format.formatDuration)(totalData.value.totals.totalDuration))
      } : {}, {
        d: (_d = (_c = totalData.value) == null ? void 0 : _c.dailyRecords) == null ? void 0 : _d.length
      }, ((_f = (_e = totalData.value) == null ? void 0 : _e.dailyRecords) == null ? void 0 : _f.length) ? {
        e: common_vendor.f(totalData.value.dailyRecords, (record, k0, i0) => {
          return {
            a: common_vendor.t(formatDisplayDate(record.date)),
            b: common_vendor.t(record.distance || 0),
            c: common_vendor.t(common_vendor.unref(pages_dataCenter_components_format.formatDuration)(record.duration)),
            d: common_vendor.t(common_vendor.unref(pages_dataCenter_components_format.formatPace)(record.averagePace)),
            e: common_vendor.t(record.calories || 0),
            f: common_vendor.t(record.poolLength || 0),
            g: common_vendor.t(record.laps || 0),
            h: record.date
          };
        })
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/dataCenter/components/TotalView.vue"]]);
wx.createComponent(Component);
