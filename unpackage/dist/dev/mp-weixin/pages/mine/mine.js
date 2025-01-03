"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_require = require("../../utils/require.js");
if (!Math) {
  LoginPopup();
}
const LoginPopup = () => "../../components/LoginPopup.js";
const _sfc_main = {
  __name: "mine",
  setup(__props) {
    const loginPopupRef = common_vendor.ref(null);
    const activeTab = common_vendor.ref("device");
    const userInfo = common_vendor.ref({
      nickname: "",
      avatarUrl: "",
      bio: "",
      following: 0,
      followers: 0,
      points: 0
    });
    const devicesList = common_vendor.ref([]);
    const currentDevice = common_vendor.ref(0);
    const handleDeviceChange = (e) => {
      currentDevice.value = e.detail.current;
    };
    common_vendor.onMounted(() => {
      const localUserInfo = common_vendor.index.getStorageSync("userInfo");
      if (localUserInfo) {
        try {
          userInfo.value = JSON.parse(localUserInfo);
        } catch (e) {
          console.error("解析本地用户信息失败:", e);
        }
      }
      checkLoginStatus(() => {
        fetchUserInfo();
        fetchUserDevices();
      });
    });
    common_vendor.onShow(() => {
      const localUserInfo = common_vendor.index.getStorageSync("userInfo");
      if (localUserInfo) {
        try {
          userInfo.value = JSON.parse(localUserInfo);
        } catch (e) {
          console.error("解析本地用户信息失败:", e);
        }
      }
      checkLoginStatus(() => {
        fetchUserInfo();
        fetchUserDevices();
      });
    });
    const checkLoginStatus = (cb) => {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        handleNeedLogin();
        return false;
      }
      cb();
    };
    const fetchUserInfo = async () => {
      try {
        const res = await utils_require.request({
          url: "/users/me"
        });
        if (res.data.code === 200) {
          userInfo.value = res.data.data;
          common_vendor.index.setStorageSync("userInfo", JSON.stringify(res.data.data));
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
        common_vendor.index.showToast({
          title: "获取用户信息失败",
          icon: "none"
        });
      }
    };
    const fetchUserDevices = async () => {
      const openid = JSON.parse(common_vendor.index.getStorageSync("userInfo")).openid;
      try {
        const res = await utils_require.request({
          url: "/devices/user/" + openid
        });
        if (res.data.code === 200) {
          devicesList.value = res.data.data;
        }
      } catch (error) {
        console.error("获取设备列表失败:", error);
        common_vendor.index.showToast({
          title: "获取设备列表失败",
          icon: "none"
        });
      }
    };
    const handleNeedLogin = () => {
      loginPopupRef.value.open();
    };
    const handleLoginSuccess = (data) => {
      console.log(data);
    };
    const handleLoginClose = () => {
    };
    const handleTabClick = (tab) => {
      activeTab.value = tab;
    };
    const navigateToAccount = () => {
      common_vendor.index.navigateTo({
        url: "/pages/setting/setting"
      });
    };
    const navigateToPoints = () => {
      common_vendor.index.navigateTo({
        url: "/pages/points/points"
      });
    };
    const navigateToDevice = () => {
      common_vendor.index.navigateTo({
        url: "/pages/device/device"
      });
    };
    const navigateToContact = () => {
      common_vendor.index.navigateTo({
        url: "/pages/contactCostumer/contactCostumer"
      });
    };
    const navigateToMessage = () => {
      common_vendor.index.navigateTo({
        url: "/pages/message/message"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userInfo.value.avatarUrl || "/static/avatar.jpg",
        b: common_vendor.t(userInfo.value.nickname || "未设置昵称"),
        c: common_vendor.t(userInfo.value.bio || "写一个有趣的介绍吧..."),
        d: common_vendor.t(userInfo.value.following || 0),
        e: common_vendor.t(userInfo.value.followers || 0),
        f: common_vendor.t(userInfo.value.points || 0),
        g: common_vendor.o(navigateToPoints),
        h: activeTab.value === "device"
      }, activeTab.value === "device" ? {} : {}, {
        i: activeTab.value === "device" ? 1 : "",
        j: common_vendor.o(($event) => handleTabClick("device")),
        k: activeTab.value === "medal"
      }, activeTab.value === "medal" ? {} : {}, {
        l: activeTab.value === "medal" ? 1 : "",
        m: common_vendor.o(($event) => handleTabClick("medal")),
        n: activeTab.value === "device"
      }, activeTab.value === "device" ? {
        o: common_vendor.f(devicesList.value, (device, index, i0) => {
          return {
            a: common_vendor.t(device.device_name),
            b: device.device_status === "online" ? 1 : "",
            c: common_vendor.t(device.device_status === "online" ? "已连接" : "未连接"),
            d: index
          };
        }),
        p: common_vendor.o(($event) => navigateToDevice(_ctx.device)),
        q: common_vendor.o((...args) => _ctx.handleAddDevice && _ctx.handleAddDevice(...args)),
        r: currentDevice.value,
        s: common_vendor.o(handleDeviceChange)
      } : {}, {
        t: activeTab.value === "medal"
      }, activeTab.value === "medal" ? {} : {}, {
        v: common_vendor.o(navigateToMessage),
        w: common_vendor.o(navigateToContact),
        x: common_vendor.o(navigateToAccount),
        y: common_vendor.sr(loginPopupRef, "093d7f73-0", {
          "k": "loginPopupRef"
        }),
        z: common_vendor.o(handleLoginSuccess),
        A: common_vendor.o(handleLoginClose)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/mine/mine.vue"]]);
wx.createPage(MiniProgramPage);
