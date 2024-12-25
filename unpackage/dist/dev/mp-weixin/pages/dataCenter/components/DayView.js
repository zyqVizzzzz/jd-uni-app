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
  __name: "DayView",
  props: {
    initialDate: {
      type: String,
      default: () => pages_dataCenter_components_format.formatDate(/* @__PURE__ */ new Date())
    }
  },
  setup(__props) {
    const props = __props;
    const currentDate = common_vendor.ref(props.initialDate);
    const dayRecord = common_vendor.ref(null);
    const selected = common_vendor.ref([]);
    const fetchMonthRecordDates = async (year, month) => {
      var _a;
      try {
        const res = await utils_require.request({
          url: `/swimming/month-record-dates?year=${year}&month=${month}`,
          method: "GET"
        });
        if (((_a = res.data) == null ? void 0 : _a.code) === 200) {
          const dates = res.data.data.map((date) => ({
            date
            // 后端已经返回了 YYYY-MM-DD 格式
          }));
          selected.value = dates;
        } else {
          selected.value = [];
        }
      } catch (err) {
        console.error("获取月度记录失败", err);
        selected.value = [];
      }
    };
    const fetchDayRecord = async (date) => {
      var _a, _b;
      try {
        const res = await utils_require.request({
          url: "/swimming/date-record",
          method: "GET",
          // 明确指定请求方法
          data: {
            date
          }
        });
        if (((_a = res.data) == null ? void 0 : _a.code) === 200) {
          dayRecord.value = res.data.data;
        } else {
          dayRecord.value = null;
          console.warn("获取日期记录失败:", (_b = res.data) == null ? void 0 : _b.message);
        }
      } catch (err) {
        console.error("获取日期记录失败:", err);
        dayRecord.value = null;
      }
    };
    const onDateChange = (e) => {
      if (!(e == null ? void 0 : e.fulldate))
        return;
      try {
        const date = new Date(e.fulldate);
        if (isNaN(date.getTime())) {
          console.error("Invalid date:", e.fulldate);
          return;
        }
        const formattedDate = pages_dataCenter_components_format.formatDate(date);
        currentDate.value = formattedDate;
        fetchDayRecord(formattedDate);
      } catch (err) {
        console.error("日期处理错误:", err);
      }
    };
    const onMonthSwitch = (e) => {
      if (!(e == null ? void 0 : e.year) || !(e == null ? void 0 : e.month))
        return;
      try {
        const year = parseInt(e.year);
        const month = parseInt(e.month);
        if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
          console.error("Invalid year or month:", e);
          return;
        }
        fetchMonthRecordDates(year, month);
      } catch (err) {
        console.error("月份切换处理错误:", err);
      }
    };
    common_vendor.onMounted(() => {
      try {
        const date = new Date(currentDate.value);
        if (isNaN(date.getTime())) {
          console.error("Invalid initial date:", currentDate.value);
          return;
        }
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        fetchMonthRecordDates(year, month);
        fetchDayRecord(currentDate.value);
      } catch (err) {
        console.error("初始化错误:", err);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(onDateChange),
        b: common_vendor.o(onMonthSwitch),
        c: common_vendor.p({
          insert: true,
          selected: selected.value,
          date: currentDate.value,
          showMonth: false
        }),
        d: dayRecord.value
      }, dayRecord.value ? {
        e: common_vendor.t(dayRecord.value.distance || 0),
        f: common_vendor.t(common_vendor.unref(pages_dataCenter_components_format.formatDuration)(dayRecord.value.duration)),
        g: common_vendor.t(common_vendor.unref(pages_dataCenter_components_format.formatPace)(dayRecord.value.averagePace)),
        h: common_vendor.t(dayRecord.value.calories || 0),
        i: common_vendor.t(dayRecord.value.poolLength || 0),
        j: common_vendor.t(dayRecord.value.laps || 0)
      } : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-76befc5e"], ["__file", "/Users/z/jd-uni-app/pages/dataCenter/components/DayView.vue"]]);
wx.createComponent(Component);
