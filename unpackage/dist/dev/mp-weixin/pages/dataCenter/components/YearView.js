"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_require = require("../../../utils/require.js");
const pages_dataCenter_components_format = require("./format.js");
if (!Math) {
  YearPicker();
}
const YearPicker = () => "./YearPicker.js";
const _sfc_main = {
  __name: "YearView",
  props: {
    initialDate: {
      type: String,
      default: () => pages_dataCenter_components_format.formatDate(/* @__PURE__ */ new Date()).slice(0, 4)
      // 只取年份部分
    }
  },
  setup(__props) {
    const props = __props;
    const currentDate = common_vendor.ref(props.initialDate);
    const yearData = common_vendor.ref(null);
    const recordYears = common_vendor.computed(() => {
      var _a, _b;
      if (!((_b = (_a = yearData.value) == null ? void 0 : _a.monthlyRecords) == null ? void 0 : _b.length))
        return [];
      return [
        ...new Set(
          yearData.value.monthlyRecords.map(
            (record) => new Date(record.month).getFullYear()
          )
        )
      ];
    });
    const formatDisplayMonth = (month) => {
      const d = new Date(month);
      return `${d.getFullYear()}年${d.getMonth() + 1}月`;
    };
    const fetchYearData = async (year) => {
      var _a;
      try {
        const res = await utils_require.request({
          url: "/swimming/year-records",
          method: "GET",
          data: { year }
        });
        if (((_a = res.data) == null ? void 0 : _a.code) === 200) {
          yearData.value = res.data.data;
        }
      } catch (err) {
        console.error("获取年度数据失败:", err);
        yearData.value = null;
      }
    };
    const onYearChange = (date) => {
      if (!date)
        return;
      currentDate.value = date;
      fetchYearData(new Date(date).getFullYear());
    };
    common_vendor.onMounted(() => {
      fetchYearData(new Date(currentDate.value).getFullYear());
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f;
      return common_vendor.e({
        a: common_vendor.o(onYearChange),
        b: common_vendor.o(($event) => currentDate.value = $event),
        c: common_vendor.p({
          ["record-years"]: recordYears.value,
          value: currentDate.value
        }),
        d: (_a = yearData.value) == null ? void 0 : _a.totals
      }, ((_b = yearData.value) == null ? void 0 : _b.totals) ? {
        e: common_vendor.t(yearData.value.totals.totalDistance || 0),
        f: common_vendor.t(common_vendor.unref(pages_dataCenter_components_format.formatDuration)(yearData.value.totals.totalDuration))
      } : {}, {
        g: (_d = (_c = yearData.value) == null ? void 0 : _c.monthlyRecords) == null ? void 0 : _d.length
      }, ((_f = (_e = yearData.value) == null ? void 0 : _e.monthlyRecords) == null ? void 0 : _f.length) ? {
        h: common_vendor.f(yearData.value.monthlyRecords, (record, k0, i0) => {
          return {
            a: common_vendor.t(formatDisplayMonth(record.month)),
            b: common_vendor.t(record.distance || 0),
            c: common_vendor.t(common_vendor.unref(pages_dataCenter_components_format.formatDuration)(record.duration)),
            d: common_vendor.t(common_vendor.unref(pages_dataCenter_components_format.formatPace)(record.averagePace)),
            e: common_vendor.t(record.calories || 0),
            f: common_vendor.t(record.trainingCount || 0),
            g: common_vendor.t(record.totalLaps || 0),
            h: record.month
          };
        })
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/dataCenter/components/YearView.vue"]]);
wx.createComponent(Component);
