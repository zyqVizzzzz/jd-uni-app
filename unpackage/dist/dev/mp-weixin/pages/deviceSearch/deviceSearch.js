"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_require = require("../../utils/require.js");
require("../../config.js");
const _sfc_main = {
  __name: "deviceSearch",
  setup(__props) {
    const foundDevices = common_vendor.ref([]);
    const status = common_vendor.ref("searching");
    const isRetry = common_vendor.ref(false);
    const initBluetooth = () => {
      common_vendor.index.openBluetoothAdapter({
        success: (res) => {
          console.log("蓝牙初始化成功", res);
          startBluetoothDevicesDiscovery();
        },
        fail: (err) => {
          console.error("蓝牙初始化失败", err);
          status.value = "failed";
          common_vendor.index.showToast({
            title: "请开启蓝牙",
            icon: "none"
          });
        }
      });
    };
    const startBluetoothDevicesDiscovery = () => {
      common_vendor.index.startBluetoothDevicesDiscovery({
        allowDuplicatesKey: false,
        success: (res) => {
          console.log("开始搜索蓝牙设备", res);
          onBluetoothDeviceFound();
        },
        fail: (err) => {
          console.error("搜索蓝牙设备失败", err);
          status.value = "failed";
        }
      });
    };
    const onBluetoothDeviceFound = () => {
      common_vendor.index.onBluetoothDeviceFound((res) => {
        res.devices.forEach((device) => {
          if (device.name && !foundDevices.value.some((d) => d.deviceId === device.deviceId)) {
            foundDevices.value.push({
              name: device.name,
              deviceId: device.deviceId,
              RSSI: device.RSSI,
              advertisData: device.advertisData
            });
          }
        });
      });
    };
    const stopBluetoothDevicesDiscovery = () => {
      common_vendor.index.stopBluetoothDevicesDiscovery({
        success: (res) => {
          console.log("停止搜索蓝牙设备", res);
        }
      });
    };
    const handleBind = async (device) => {
      try {
        stopBluetoothDevicesDiscovery();
        await connectBluetoothDevice(device);
        await saveDeviceToServer(device);
        status.value = "success";
        common_vendor.index.showToast({
          title: "绑定成功",
          icon: "success"
        });
        common_vendor.index.navigateTo({
          url: "/pages/deviceBindSuccess/deviceBindSuccess"
        });
      } catch (error) {
        console.error("绑定失败", error);
        status.value = "failed";
        common_vendor.index.showToast({
          title: "绑定失败",
          icon: "error"
        });
      }
    };
    const connectBluetoothDevice = (device) => {
      return new Promise((resolve, reject) => {
        common_vendor.index.createBLEConnection({
          deviceId: device.deviceId,
          timeout: 1e4,
          // 超时时间10秒
          success: (res) => {
            console.log("连接蓝牙设备成功", res);
            resolve(res);
          },
          fail: (err) => {
            console.error("连接蓝牙设备失败", err);
            reject(err);
          }
        });
      });
    };
    const saveDeviceToServer = async (device) => {
      try {
        const res = await utils_require.request({
          url: "/devices",
          method: "POST",
          data: {
            device_model: device.deviceId,
            device_name: device.name
          }
        });
        return res.data.code === 200 || res.data.code === 201;
      } catch (error) {
        console.error("保存设备信息到服务器失败", error);
        throw error;
      }
    };
    const handleRetry = () => {
      isRetry.value = true;
      foundDevices.value = [];
      status.value = "searching";
      initBluetooth();
    };
    const contactSupport = () => {
      common_vendor.index.navigateTo({
        url: "/pages/contactCostumer/contactCostumer"
      });
    };
    common_vendor.onMounted(() => {
      initBluetooth();
    });
    common_vendor.onUnmounted(() => {
      stopBluetoothDevicesDiscovery();
      common_vendor.index.closeBluetoothAdapter();
    });
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
