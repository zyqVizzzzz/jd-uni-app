"use strict";
const common_vendor = require("../../common/vendor.js");
const pages_dataCenter_components_format = require("./components/format.js");
if (!Math) {
  (DayView + WeekView + MonthView + YearView + TotalView)();
}
const DayView = () => "./components/DayView.js";
const WeekView = () => "./components/WeekView.js";
const MonthView = () => "./components/MonthView.js";
const YearView = () => "./components/YearView.js";
const TotalView = () => "./components/TotalView.js";
const _sfc_main = {
  __name: "dataCenter",
  setup(__props) {
    const tabs = [
      {
        label: "日",
        value: "day"
      },
      {
        label: "周",
        value: "week"
      },
      {
        label: "月",
        value: "month"
      },
      {
        label: "年",
        value: "year"
      },
      {
        label: "总",
        value: "total"
      }
    ];
    const activeTab = common_vendor.ref("day");
    const currentDate = common_vendor.ref(pages_dataCenter_components_format.formatDate(/* @__PURE__ */ new Date()));
    const switchTab = (tab) => {
      activeTab.value = tab;
    };
    const onShare = () => {
      common_vendor.index.navigateTo({
        url: "/pages/share/share"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(tabs, (tab, k0, i0) => {
          return {
            a: common_vendor.t(tab.label),
            b: tab.value,
            c: activeTab.value === tab.value ? 1 : "",
            d: common_vendor.o(($event) => switchTab(tab.value), tab.value)
          };
        }),
        b: activeTab.value === "day"
      }, activeTab.value === "day" ? {
        c: common_vendor.p({
          ["initial-date"]: currentDate.value
        })
      } : activeTab.value === "week" ? {
        e: common_vendor.p({
          ["initial-date"]: currentDate.value
        })
      } : activeTab.value === "month" ? {
        g: common_vendor.p({
          ["initial-date"]: currentDate.value
        })
      } : activeTab.value === "year" ? {
        i: common_vendor.p({
          ["initial-date"]: currentDate.value
        })
      } : activeTab.value === "total" ? {
        k: common_vendor.p({
          ["initial-date"]: currentDate.value
        })
      } : {}, {
        d: activeTab.value === "week",
        f: activeTab.value === "month",
        h: activeTab.value === "year",
        j: activeTab.value === "total",
        l: common_vendor.o(onShare)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-693b7685"], ["__file", "/Users/z/jd-uni-app/pages/dataCenter/dataCenter.vue"]]);
wx.createPage(MiniProgramPage);
