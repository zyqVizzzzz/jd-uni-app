"use strict";
const common_vendor = require("../../../common/vendor.js");
const utils_require = require("../../../utils/require.js");
const pages_dataCenter_components_format = require("./format.js");
if (!Array) {
  const _easycom_uni_calendar2 = common_vendor.resolveComponent("uni-calendar");
  _easycom_uni_calendar2();
}
const _easycom_uni_calendar = () => "../../../uni_modules/uni-calendar/components/uni-calendar/uni-calendar.js";
if (!Math) {
  _easycom_uni_calendar();
}
const _sfc_main = {
  __name: "WeekView",
  props: {
    initialDate: {
      type: String,
      default: () => pages_dataCenter_components_format.formatDate(/* @__PURE__ */ new Date())
    }
  },
  setup(__props) {
    const props = __props;
    const currentDate = common_vendor.ref(props.initialDate);
    const weekRecord = common_vendor.ref(null);
    common_vendor.ref([]);
    const weekDays = common_vendor.ref([]);
    const getWeekDays = (date) => {
      const currentDate2 = new Date(date);
      const day = currentDate2.getDay() || 7;
      const monday = new Date(currentDate2);
      monday.setDate(currentDate2.getDate() - day + 1);
      const days = [];
      for (let i = 0; i < 7; i++) {
        const date2 = new Date(monday);
        date2.setDate(monday.getDate() + i);
        days.push({
          date: pages_dataCenter_components_format.formatDate(date2),
          extra: "week"
          // 添加标记，用于自定义样式
        });
      }
      return days;
    };
    const getWeekRange = (date) => {
      const days = getWeekDays(date);
      return {
        start: days[0].date,
        end: days[6].date
      };
    };
    const formatDisplayDate = (date) => {
      const d = new Date(date);
      return `${d.getMonth() + 1}月${d.getDate()}日`;
    };
    const fetchWeekRecord = async (startDate, endDate) => {
      var _a;
      try {
        const res = await utils_require.request({
          url: "/swimming/week-record",
          method: "GET",
          data: {
            startDate,
            endDate
          }
        });
        if (((_a = res.data) == null ? void 0 : _a.code) === 200) {
          weekRecord.value = res.data.data.totals;
          weekRecord.value.dailyRecords = res.data.data.daily;
        } else {
          weekRecord.value = null;
        }
      } catch (err) {
        console.error("获取周数据失败", err);
        weekRecord.value = null;
      }
    };
    const onWeekDateChange = (e) => {
      if (!(e == null ? void 0 : e.fulldate))
        return;
      currentDate.value = e.fulldate;
      weekDays.value = getWeekDays(e.fulldate);
      const weekRange = getWeekRange(e.fulldate);
      fetchWeekRecord(weekRange.start, weekRange.end);
    };
    const onMonthSwitch = (e) => {
    };
    common_vendor.onMounted(() => {
      const date = currentDate.value;
      weekDays.value = getWeekDays(date);
      const weekRange = getWeekRange(date);
      fetchWeekRecord(weekRange.start, weekRange.end);
    });
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return common_vendor.e({
        a: common_vendor.o(onWeekDateChange),
        b: common_vendor.o(onMonthSwitch),
        c: common_vendor.p({
          insert: true,
          selected: weekDays.value,
          date: currentDate.value,
          showMonth: false
        }),
        d: weekRecord.value
      }, weekRecord.value ? {
        e: common_vendor.t(weekRecord.value.totalDistance || 0),
        f: common_vendor.t(common_vendor.unref(pages_dataCenter_components_format.formatDuration)(weekRecord.value.totalDuration))
      } : {}, {
        g: (_b = (_a = weekRecord.value) == null ? void 0 : _a.dailyRecords) == null ? void 0 : _b.length
      }, ((_d = (_c = weekRecord.value) == null ? void 0 : _c.dailyRecords) == null ? void 0 : _d.length) ? {
        h: common_vendor.f(weekRecord.value.dailyRecords, (record, k0, i0) => {
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
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9a5c57ee"], ["__file", "/Users/z/jd-uni-app/pages/dataCenter/components/WeekView.vue"]]);
wx.createComponent(Component);
