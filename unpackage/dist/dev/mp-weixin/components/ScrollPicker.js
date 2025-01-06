"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "ScrollPicker",
  props: {
    columns: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ""
    },
    itemHeight: {
      type: Number,
      default: 66
    },
    itemSpacing: {
      type: Number,
      default: 24
      // 新增：项目间距
    }
  },
  emits: ["change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const currentIndex = common_vendor.ref([]);
    common_vendor.onMounted(() => {
      currentIndex.value = props.columns.map((column) => {
        const defaultValue = column.defaultValue;
        const index = column.options.findIndex(
          (item) => item.value === defaultValue
        );
        return Math.max(0, index);
      });
    });
    const indicatorStyle = common_vendor.computed(() => {
      return `height: ${props.itemHeight}px;`;
    });
    const onChange = (e) => {
      console.log(e);
      const values = e.detail.value;
      currentIndex.value = values;
      const selectedValues = values.map((index, columnIndex) => {
        return props.columns[columnIndex].options[index];
      });
      console.log(selectedValues);
      emit("change", {
        values: selectedValues,
        indexes: values,
        columnIndex: values.findIndex(
          (val, idx) => val !== currentIndex.value[idx]
        )
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.title
      }, __props.title ? {
        b: common_vendor.t(__props.title)
      } : {}, {
        c: common_vendor.f(__props.columns, (column, columnIndex, i0) => {
          return {
            a: common_vendor.f(column.options, (item, index, i1) => {
              return {
                a: common_vendor.t(item.label),
                b: index === currentIndex.value[columnIndex] ? 1 : "",
                c: index
              };
            }),
            b: columnIndex
          };
        }),
        d: currentIndex.value,
        e: indicatorStyle.value,
        f: common_vendor.o(onChange)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/components/ScrollPicker.vue"]]);
wx.createComponent(Component);
