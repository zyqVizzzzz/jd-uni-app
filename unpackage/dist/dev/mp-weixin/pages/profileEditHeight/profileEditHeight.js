"use strict";
const common_vendor = require("../../common/vendor.js");
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
      common_vendor.index.navigateTo({
        url: "/pages/profileEditTarget/profileEditTarget"
      });
    };
    const generateYearOptions = (startYear, endYear) => {
      const options = [];
      for (let year = startYear; year <= endYear; year++) {
        options.push({
          label: year,
          value: year.toString()
        });
      }
      return options;
    };
    const generateMonthOptions = () => {
      const options = [];
      for (let month = 1; month <= 12; month++) {
        const value = month.toString().padStart(2, "0");
        options.push({
          label: value,
          value
        });
      }
      return options;
    };
    const generateDayOptions = (year, month) => {
      const days = new Date(year, month, 0).getDate();
      const options = [];
      for (let day = 1; day <= days; day++) {
        const value = day.toString().padStart(2, "0");
        options.push({
          label: value,
          value
        });
      }
      return options;
    };
    const dateColumns = common_vendor.reactive([
      {
        options: generateYearOptions(1989, 1995),
        defaultValue: "1992"
      },
      {
        options: generateMonthOptions(),
        defaultValue: "05"
      },
      {
        options: generateDayOptions(1992, 5),
        defaultValue: "05"
      }
    ]);
    const handleDateChange = (e) => {
      var _a, _b;
      const { values, columnIndex } = e;
      if (columnIndex === 0 || columnIndex === 1) {
        const year = ((_a = values[0]) == null ? void 0 : _a.value) || dateColumns[0].defaultValue;
        const month = ((_b = values[1]) == null ? void 0 : _b.value) || dateColumns[1].defaultValue;
        dateColumns[2].options = generateDayOptions(
          parseInt(year),
          parseInt(month)
        );
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleDateChange),
        b: common_vendor.p({
          columns: [{
            options: generateYearOptions(1989, 1995),
            defaultValue: "1992"
          }],
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
