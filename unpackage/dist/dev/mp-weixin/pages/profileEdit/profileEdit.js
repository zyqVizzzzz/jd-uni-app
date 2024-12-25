"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (ScrollPicker + WeightScale)();
}
const ScrollPicker = () => "../../components/ScrollPicker.js";
const WeightScale = () => "../../components/WeightScale.js";
const _sfc_main = {
  __name: "profileEdit",
  setup(__props) {
    const currentStep = common_vendor.ref(1);
    const totalSteps = common_vendor.ref(4);
    const selectedGender = common_vendor.ref(null);
    const stepTitle = common_vendor.ref("选择性别");
    const weight = common_vendor.ref(54);
    const handleWeightChange = (value) => {
      weight.value = value;
    };
    const goNext = () => {
      if (currentStep.value < totalSteps.value) {
        currentStep.value++;
        updateStepTitle();
      }
    };
    const goPrevious = () => {
      if (currentStep.value > 1) {
        currentStep.value--;
        updateStepTitle();
      }
    };
    const selectGender = (gender) => {
      selectedGender.value = gender;
      goNext();
    };
    const updateStepTitle = () => {
      const titles = ["选择性别", "您的生日", "您的体重 (KG)", "您的身高 (CM)"];
      stepTitle.value = titles[currentStep.value - 1];
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
      return common_vendor.e({
        a: currentStep.value === 1
      }, currentStep.value === 1 ? {
        b: selectedGender.value === "male" ? 1 : "",
        c: common_vendor.o(($event) => selectGender("male")),
        d: selectedGender.value === "female" ? 1 : "",
        e: common_vendor.o(($event) => selectGender("female"))
      } : {}, {
        f: currentStep.value === 2
      }, currentStep.value === 2 ? {
        g: common_vendor.o(handleDateChange),
        h: common_vendor.p({
          columns: [{
            options: generateYearOptions(1989, 1995),
            defaultValue: "1992"
          }, {
            options: generateMonthOptions(),
            defaultValue: "05"
          }, {
            options: generateDayOptions(1992, 5),
            defaultValue: "05"
          }],
          title: "您的生日"
        })
      } : {}, {
        i: currentStep.value === 3
      }, currentStep.value === 3 ? {
        j: common_vendor.o(handleWeightChange),
        k: common_vendor.o(($event) => weight.value = $event),
        l: common_vendor.p({
          min: 30,
          max: 150,
          step: 1,
          modelValue: weight.value
        })
      } : {}, {
        m: currentStep.value === 4
      }, currentStep.value === 4 ? {} : {}, {
        n: currentStep.value > 1
      }, currentStep.value > 1 ? {
        o: common_vendor.o(goPrevious)
      } : {}, {
        p: currentStep.value < totalSteps.value && currentStep.value !== 1
      }, currentStep.value < totalSteps.value && currentStep.value !== 1 ? {
        q: common_vendor.o(goNext)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5849c4bc"], ["__file", "/Users/z/jd-uni-app/pages/profileEdit/profileEdit.vue"]]);
wx.createPage(MiniProgramPage);
