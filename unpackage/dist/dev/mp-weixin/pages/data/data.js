"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_require = require("../../utils/require.js");
require("../../config.js");
if (!Math) {
  LoginPopup();
}
const LoginPopup = () => "../../components/LoginPopup.js";
const _sfc_main = {
  __name: "data",
  setup(__props) {
    const loginPopupRef = common_vendor.ref(null);
    const latestRecord = common_vendor.ref({});
    common_vendor.ref({});
    const monthlyTarget = common_vendor.ref({
      currentDistance: 0,
      targetDistance: 2e3,
      completionRate: 0
    });
    const currentMonth = common_vendor.ref((/* @__PURE__ */ new Date()).getMonth() + 1);
    const formatDuration = (seconds) => {
      if (!seconds)
        return "0";
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}'${remainingSeconds.toString().padStart(2, "0")}"`;
    };
    const formatPace = (pace) => {
      if (!pace)
        return "0";
      const minutes = Math.floor(pace / 60);
      const seconds = Math.floor(pace % 60);
      return `${minutes}'${seconds.toString().padStart(2, "0")}″/100m`;
    };
    const formatDate = (date) => {
      if (!date)
        return "";
      const d = new Date(date);
      return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
    };
    const getDaysAgo = (date) => {
      if (!date)
        return 0;
      const diffTime = Math.abs(/* @__PURE__ */ new Date() - new Date(date));
      return Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
    };
    const fetchLatestRecord = async () => {
      try {
        const res = await utils_require.request({
          url: "/swimming/latest"
        });
        if (res.data.code === 200) {
          latestRecord.value = res.data.data;
        }
      } catch (err) {
        console.error("获取最新记录失败", err);
      }
    };
    const fetchMonthlyStats = async () => {
      try {
        const res = await utils_require.request({
          url: "/swimming/monthly-target"
        });
        if (res.data.code === 200) {
          monthlyTarget.value = res.data.data || {};
          console.log(monthlyTarget.value);
        }
      } catch (err) {
        console.error("获取月度统计失败", err);
      }
    };
    const totalStats = common_vendor.ref({
      totalDistance: 0,
      totalDuration: 0,
      totalCalories: 0,
      recordCount: 0
    });
    const fetchTotalStats = async () => {
      try {
        const res = await utils_require.request({
          url: "/swimming/total-stats"
        });
        if (res.data.code === 200) {
          totalStats.value = res.data.data;
        }
      } catch (err) {
        console.error("获取总计统计失败", err);
      }
    };
    const handleNavigate = () => {
      common_vendor.index.navigateTo({
        url: "/pages/dataCenter/dataCenter"
      });
    };
    const checkLoginStatus = (cb) => {
      const token = common_vendor.index.getStorageSync("token");
      if (!token) {
        handleNeedLogin();
        return false;
      }
      cb();
    };
    const handleNeedLogin = () => {
      loginPopupRef.value.open();
    };
    const handleLoginSuccess = async () => {
      await Promise.all([
        fetchLatestRecord(),
        fetchMonthlyStats(),
        fetchTotalStats()
      ]);
    };
    const handleLoginClose = () => {
    };
    const handleMockData = async () => {
      try {
        const res = await utils_require.request({
          url: "/swimming/generate-mock",
          method: "POST"
        });
        if (res.data.code === 201) {
          handleLoginSuccess();
        }
      } catch (error) {
        console.error("生成游泳记录失败", error);
        return null;
      }
    };
    common_vendor.onMounted(() => {
      checkLoginStatus(async () => {
        await Promise.all([
          fetchLatestRecord(),
          fetchMonthlyStats(),
          fetchTotalStats()
        ]);
      });
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(latestRecord.value.distance || 0),
        b: common_vendor.t(formatDuration(latestRecord.value.duration)),
        c: common_vendor.t(formatPace(latestRecord.value.averagePace)),
        d: common_vendor.t(latestRecord.value.calories || 0),
        e: common_vendor.t(latestRecord.value.poolLength || 0),
        f: common_vendor.t(latestRecord.value.strokes || 0),
        g: common_vendor.o(handleNavigate),
        h: common_vendor.t(formatDate(latestRecord.value.date)),
        i: common_vendor.t(getDaysAgo(latestRecord.value.date)),
        j: common_vendor.t(totalStats.value.totalDistance || 0),
        k: common_vendor.t(formatDuration(totalStats.value.totalDuration)),
        l: common_vendor.t(currentMonth.value),
        m: common_vendor.t(monthlyTarget.value.currentDistance),
        n: common_vendor.t(currentMonth.value),
        o: common_vendor.t((monthlyTarget.value.completionRate * 100).toFixed(0)),
        p: `${monthlyTarget.value.completionRate * 100}%`,
        q: common_vendor.t(monthlyTarget.value.currentDistance),
        r: common_vendor.t(monthlyTarget.value.targetDistance),
        s: common_vendor.o(handleMockData),
        t: common_vendor.sr(loginPopupRef, "98b81aa6-0", {
          "k": "loginPopupRef"
        }),
        v: common_vendor.o(handleLoginSuccess),
        w: common_vendor.o(handleLoginClose)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-98b81aa6"], ["__file", "/Users/z/jd-uni-app/pages/data/data.vue"]]);
wx.createPage(MiniProgramPage);
