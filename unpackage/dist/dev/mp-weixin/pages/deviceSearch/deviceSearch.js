"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "deviceSearch",
  setup(__props) {
    const foundDevices = common_vendor.ref([]);
    let intervalId = null;
    const status = common_vendor.ref("");
    const isRetry = common_vendor.ref(false);
    common_vendor.onMounted(() => {
      simulateBluetoothScan();
    });
    common_vendor.onUnmounted(() => {
      if (intervalId)
        clearInterval(intervalId);
    });
    function handleRetry() {
      isRetry.value = true;
      foundDevices.value = [];
      simulateBluetoothScan();
    }
    function simulateBluetoothScan() {
      let count = 0;
      intervalId = setInterval(() => {
        count++;
        foundDevices.value.push({
          name: `已发现设备_${count}`
        });
        if (count === 10) {
          status.value = "pending";
          clearInterval(intervalId);
        }
      }, 100);
    }
    function contactSupport() {
      console.log("联系客服");
      common_vendor.index.navigateTo({
        url: "/pages/contactCostumer/contactCostumer"
      });
    }
    const handleBind = (device) => {
      simulateBindDevice().then(() => {
        console.log(`绑定成功: ${device.name}`);
        status.value = "success";
        common_vendor.index.navigateTo({
          url: "/pages/deviceBindSuccess/deviceBindSuccess"
        });
      }).catch(() => {
        console.log(`绑定失败: ${device.name}`);
        status.value = "failed";
      });
    };
    const simulateBindDevice = (device) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          {
            resolve();
          }
        }, 1e3);
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(foundDevices.value, (device, index, i0) => {
          return {
            a: common_vendor.t(device.name),
            b: index,
            c: common_vendor.o(($event) => handleBind(device), index)
          };
        }),
        b: status.value === "pending" || status.value === "failed"
      }, status.value === "pending" || status.value === "failed" ? {
        c: common_vendor.o(handleRetry)
      } : {}, {
        d: isRetry.value && (status.value === "pending" || status.value === "failed")
      }, isRetry.value && (status.value === "pending" || status.value === "failed") ? {
        e: common_vendor.o(contactSupport)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/deviceSearch/deviceSearch.vue"]]);
wx.createPage(MiniProgramPage);
