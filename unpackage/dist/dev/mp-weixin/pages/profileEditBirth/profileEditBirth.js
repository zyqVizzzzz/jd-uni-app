"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_require = require("../../utils/require.js");
require("../../config.js");
if (!Math) {
  ScrollPicker();
}
const ScrollPicker = () => "../../components/ScrollPicker.js";
const _sfc_main = {
  __name: "profileEditBirth",
  setup(__props) {
    const goPrevious = () => {
      common_vendor.index.navigateBack();
    };
    const goNext = () => {
      var _a, _b, _c;
      const selectedYear = (_a = dateColumns[0].options.find(
        (opt) => opt.value === dateColumns[0].defaultValue
      )) == null ? void 0 : _a.value;
      const selectedMonth = (_b = dateColumns[1].options.find(
        (opt) => opt.value === dateColumns[1].defaultValue
      )) == null ? void 0 : _b.value;
      const selectedDay = (_c = dateColumns[2].options.find(
        (opt) => opt.value === dateColumns[2].defaultValue
      )) == null ? void 0 : _c.value;
      console.log(selectedDay, selectedMonth, selectedYear);
      updateUserInfo({
        birthday: {
          year: selectedYear,
          month: selectedMonth,
          day: selectedDay
        }
      });
    };
    const updateUserInfo = async (data) => {
      try {
        if (data.birthday) {
          const { year, month, day } = data.birthday;
          data.birthday = `${year}-${month}-${day}`;
        }
        const res = await utils_require.request({
          url: "/users/me",
          method: "POST",
          data
        });
        if (res.data.code === 201) {
          common_vendor.index.navigateTo({
            url: "/pages/profileEditWeight/profileEditWeight"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "更新失败",
          icon: "none"
        });
      }
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
        options: generateYearOptions(1900, 2024),
        defaultValue: "2000"
      },
      {
        options: generateMonthOptions(),
        defaultValue: "05"
      },
      {
        options: generateDayOptions(2e3, 5),
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
      if (values[0])
        dateColumns[0].defaultValue = values[0].value;
      if (values[1])
        dateColumns[1].defaultValue = values[1].value;
      if (values[2])
        dateColumns[2].defaultValue = values[2].value;
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleDateChange),
        b: common_vendor.p({
          columns: dateColumns,
          title: "您的生日"
        }),
        c: common_vendor.o(goPrevious),
        d: common_vendor.o(goNext)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c128da12"], ["__file", "/Users/z/jd-uni-app/pages/profileEditBirth/profileEditBirth.vue"]]);
wx.createPage(MiniProgramPage);
