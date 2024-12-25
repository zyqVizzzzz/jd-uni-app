"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  __name: "MonthPicker",
  props: {
    value: {
      type: String,
      required: true
    },
    // 可选：传入有记录的月份
    recordMonths: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:value", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const currentYear = common_vendor.ref(new Date(props.value).getFullYear());
    const currentMonth = common_vendor.computed(() => new Date(props.value).getMonth() + 1);
    const changeYear = (delta) => {
      currentYear.value += delta;
      emit(
        "change",
        `${currentYear.value}-${String(currentMonth.value).padStart(2, "0")}`
      );
    };
    const selectMonth = (month) => {
      const dateStr = `${currentYear.value}-${String(month).padStart(2, "0")}`;
      emit("update:value", dateStr);
      emit("change", dateStr);
    };
    const isCurrentMonth = (month) => {
      return month === currentMonth.value;
    };
    const hasRecord = (month) => {
      return props.recordMonths.includes(month);
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(($event) => changeYear(-1)),
        b: common_vendor.t(currentYear.value),
        c: common_vendor.o(($event) => changeYear(1)),
        d: common_vendor.f(12, (month, k0, i0) => {
          return {
            a: common_vendor.t(month),
            b: month,
            c: isCurrentMonth(month) ? 1 : "",
            d: hasRecord(month) ? 1 : "",
            e: common_vendor.o(($event) => selectMonth(month), month)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/dataCenter/components/MonthPicker.vue"]]);
wx.createComponent(Component);
