"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "WeightScale",
  props: {
    title: {
      type: String,
      default: "您的体重 (KG)"
    },
    modelValue: {
      type: Number,
      default: 54
    },
    min: {
      type: Number,
      default: 30
    },
    max: {
      type: Number,
      default: 150
    },
    step: {
      type: Number,
      default: 1
    }
  },
  setup(props, { emit }) {
    const currentValue = common_vendor.ref(props.modelValue);
    const totalMarks = 41;
    const centerMarkIndex = 21;
    const touchStartX = common_vendor.ref(0);
    const touchStartValue = common_vendor.ref(0);
    const sensitivity = 0.1;
    common_vendor.onMounted(() => {
      currentValue.value = props.modelValue;
    });
    common_vendor.watch(
      () => props.modelValue,
      (newVal) => {
        currentValue.value = newVal;
      }
    );
    const displayNumbers = common_vendor.computed(() => {
      const mainValue = Math.floor(currentValue.value);
      return [mainValue - 1, mainValue, mainValue + 1];
    });
    const handleTouchStart = (event) => {
      touchStartX.value = event.touches[0].clientX;
      touchStartValue.value = currentValue.value;
    };
    const handleTouchMove = (event) => {
      const deltaX = event.touches[0].clientX - touchStartX.value;
      const deltaValue = -deltaX * sensitivity;
      let newValue = touchStartValue.value + deltaValue;
      newValue = Math.max(props.min, Math.min(props.max, newValue));
      newValue = Math.round(newValue / props.step) * props.step;
      if (currentValue.value !== newValue) {
        currentValue.value = newValue;
        emit("update:modelValue", newValue);
        emit("change", newValue);
      }
    };
    const handleTouchEnd = () => {
      const finalValue = Math.round(currentValue.value);
      if (currentValue.value !== finalValue) {
        currentValue.value = finalValue;
        emit("update:modelValue", finalValue);
        emit("change", finalValue);
      }
    };
    return {
      currentValue,
      totalMarks,
      centerMarkIndex,
      displayNumbers,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($setup.displayNumbers, (num, index, i0) => {
      return {
        a: common_vendor.t(num),
        b: index === 1 ? 1 : "",
        c: index
      };
    }),
    b: common_vendor.f($setup.totalMarks, (index, k0, i0) => {
      return {
        a: index,
        b: (Math.floor($setup.currentValue) + index - $setup.centerMarkIndex) % 5 === 0 ? 1 : "",
        c: index === $setup.centerMarkIndex ? 1 : ""
      };
    }),
    c: common_vendor.o((...args) => $setup.handleTouchStart && $setup.handleTouchStart(...args)),
    d: common_vendor.o((...args) => $setup.handleTouchMove && $setup.handleTouchMove(...args)),
    e: common_vendor.o((...args) => $setup.handleTouchEnd && $setup.handleTouchEnd(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-448ae7b0"], ["__file", "/Users/z/jd-uni-app/components/WeightScale.vue"]]);
wx.createComponent(Component);
