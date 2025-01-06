"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_require = require("../../../utils/require.js");
const pages_dataCenter_components_format = require("./format.js");
require("../../../config.js");
if (!Math) {
  MonthPicker();
}
const MonthPicker = () => "./MonthPicker.js";
const _sfc_main = {
  __name: "MonthView",
  props: {
    initialDate: {
      type: String,
      default: () => pages_dataCenter_components_format.formatDate(/* @__PURE__ */ new Date())
    }
  },
  setup(__props) {
    const props = __props;
    const currentDate = common_vendor.ref(props.initialDate);
    const monthData = common_vendor.ref(null);
    const recordMonths = common_vendor.computed(() => {
      var _a, _b;
      if (!((_b = (_a = monthData.value) == null ? void 0 : _a.dailyRecords) == null ? void 0 : _b.length))
        return [];
      return [
        ...new Set(
          monthData.value.dailyRecords.map(
            (record) => new Date(record.date).getMonth() + 1
          )
        )
      ];
    });
    const formatDisplayDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    };
    const fetchMonthData = async (date) => {
      var _a;
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      try {
        const res = await utils_require.request({
          url: "/swimming/month-records",
          method: "GET",
          data: { year, month }
        });
        if (((_a = res.data) == null ? void 0 : _a.code) === 200) {
          monthData.value = res.data.data;
        }
      } catch (err) {
        console.error("获取月度数据失败:", err);
        monthData.value = null;
      }
    };
    const onMonthChange = (date) => {
      if (!date)
        return;
      currentDate.value = date;
      fetchMonthData(new Date(date));
    };
    common_vendor.onMounted(() => {
      fetchMonthData(new Date(currentDate.value));
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d, _e, _f;
      return common_vendor.e({
        a: common_vendor.o(onMonthChange),
        b: common_vendor.o(($event) => currentDate.value = $event),
        c: common_vendor.p({
          ["record-months"]: recordMonths.value,
          value: currentDate.value
        }),
        d: (_a = monthData.value) == null ? void 0 : _a.totals
      }, ((_b = monthData.value) == null ? void 0 : _b.totals) ? {
        e: common_vendor.t(monthData.value.totals.totalDistance || 0),
        f: common_vendor.t(common_vendor.unref(pages_dataCenter_components_format.formatDuration)(monthData.value.totals.totalDuration))
      } : {}, {
        g: (_d = (_c = monthData.value) == null ? void 0 : _c.dailyRecords) == null ? void 0 : _d.length
      }, ((_f = (_e = monthData.value) == null ? void 0 : _e.dailyRecords) == null ? void 0 : _f.length) ? {
        h: common_vendor.f(monthData.value.dailyRecords, (record, k0, i0) => {
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
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/dataCenter/components/MonthView.vue"]]);
wx.createComponent(Component);
