"use strict";
const common_vendor = require("../../common/vendor.js");
const api_points = require("../../api/points.js");
require("../../utils/require.js");
require("../../config.js");
const _sfc_main = {
  __name: "details",
  setup(__props) {
    const taskTypeMap = {
      SWIM_500M: "游泳距离达到500米",
      SWIM_1000M: "游泳距离达到1000米",
      POST_STATUS: "发布动态",
      SHARE_DATA: "分享游泳数据"
    };
    const points = common_vendor.ref(0);
    const pointsList = common_vendor.ref([
      {
        title: "游泳距离达到500米",
        time: "2023.07.11 20:55:45",
        points: 40
      },
      {
        title: "游泳距离达到500米",
        time: "2023.07.11 20:55:45",
        points: 40
      },
      {
        title: "游泳距离达到500米",
        time: "2023.07.11 20:55:45",
        points: 40
      }
    ]);
    const fetchPointsList = async () => {
      try {
        const res = await api_points.pointApi.getPointsHistory();
        console.log(res.data);
        if (res.data.code === 200) {
          pointsList.value = res.data.data.map((item) => ({
            title: taskTypeMap[item.type] || "未知任务",
            time: formatDate(item.createdAt),
            points: item.points
          }));
        }
      } catch (error) {
        console.error("Error fetching points list:", error);
      }
    };
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
    };
    const navigateToRules = () => {
      common_vendor.index.navigateTo({
        url: "/pages/agreement/point"
      });
    };
    common_vendor.onMounted(() => {
      fetchPointsList();
    });
    common_vendor.onLoad((options) => {
      if (options.points) {
        points.value = parseInt(options.points);
        console.log(points.value);
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(navigateToRules),
        b: common_vendor.t(points.value),
        c: common_vendor.f(pointsList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
            b: common_vendor.t(item.time),
            c: common_vendor.t(item.points),
            d: index
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-11052294"], ["__file", "/Users/z/jd-uni-app/pages/points/details.vue"]]);
wx.createPage(MiniProgramPage);
