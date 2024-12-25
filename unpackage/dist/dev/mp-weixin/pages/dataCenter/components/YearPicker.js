"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "YearPicker",
  props: {
    value: {
      type: String,
      required: true
    },
    // 可选：传入有记录的年份
    recordYears: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:value", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const decadeStart = common_vendor.computed(() => {
      const year = new Date(props.value).getFullYear();
      return Math.floor(year / 10) * 10;
    });
    const decadeEnd = common_vendor.computed(() => decadeStart.value + 9);
    const yearsList = common_vendor.computed(() => {
      const years = [];
      for (let year = decadeStart.value; year <= decadeEnd.value; year++) {
        years.push(year);
      }
      return years;
    });
    const changeDecade = (delta) => {
      const newYear = decadeStart.value + delta * 10;
      emit("change", `${newYear}`);
    };
    const selectYear = (year) => {
      emit("update:value", `${year}`);
      emit("change", `${year}`);
    };
    const isCurrentYear = (year) => {
      return year === new Date(props.value).getFullYear();
    };
    const hasRecord = (year) => {
      return props.recordYears.includes(year);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => changeDecade(-1)),
        b: common_vendor.t(decadeStart.value),
        c: common_vendor.t(decadeEnd.value),
        d: common_vendor.o(($event) => changeDecade(1)),
        e: common_vendor.f(yearsList.value, (year, k0, i0) => {
          return {
            a: common_vendor.t(year),
            b: year,
            c: isCurrentYear(year) ? 1 : "",
            d: hasRecord(year) ? 1 : "",
            e: common_vendor.o(($event) => selectYear(year), year)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/dataCenter/components/YearPicker.vue"]]);
wx.createComponent(Component);
