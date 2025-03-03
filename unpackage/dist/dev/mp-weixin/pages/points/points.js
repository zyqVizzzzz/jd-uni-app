"use strict";
const common_vendor = require("../../common/vendor.js");
const api_points = require("../../api/points.js");
require("../../utils/require.js");
require("../../config.js");
const _sfc_main = {
  __name: "points",
  setup(__props) {
    const points = common_vendor.ref(0);
    const tasks = common_vendor.ref([
      {
        id: 1,
        name: "游泳距离达到500米",
        points: 50,
        completed: true,
        icon: "/static/icons/points-swim-500.png",
        iconClass: "blue"
      },
      {
        id: 2,
        name: "游泳距离达到1000米",
        points: 100,
        completed: false,
        icon: "/static/icons/points-swim-1000.png",
        iconClass: "yellow"
      },
      {
        id: 3,
        name: "发布动态",
        points: 20,
        completed: false,
        icon: "/static/icons/points-post.png",
        iconClass: "pink"
      },
      {
        id: 4,
        name: "分享游泳数据",
        points: 30,
        completed: false,
        icon: "/static/icons/points-share.png",
        iconClass: "purple"
      }
    ]);
    const exchangeItems = common_vendor.ref([
      {
        id: 1,
        name: "焦动XXXXXX",
        points: 5e3,
        image: "/static/avatar.jpg"
      },
      {
        id: 2,
        name: "焦动XXXXXX",
        points: 2e3,
        image: "/static/avatar2.jpg"
      }
    ]);
    const fetchDailyTasks = async () => {
      try {
        const res = await api_points.pointApi.getDailyTasks();
        if (res.data.code === 200) {
          tasks.value = tasks.value.map((task) => {
            const taskStatus = res.data.data.find((item) => {
              switch (task.id) {
                case 1:
                  return item.type === "SWIM_500M";
                case 2:
                  return item.type === "SWIM_1000M";
                case 3:
                  return item.type === "POST_STATUS";
                case 4:
                  return item.type === "SHARE_DATA";
                default:
                  return false;
              }
            });
            return {
              ...task,
              completed: taskStatus ? taskStatus.completed : false
            };
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "获取任务状态失败",
          icon: "none"
        });
      }
    };
    const fetchPoints = async () => {
      try {
        const res = await api_points.pointApi.getUserPoints();
        if (res.data.code === 200) {
          points.value = res.data.data.totalPoints;
        }
      } catch (error) {
      }
    };
    common_vendor.onMounted(() => {
      fetchDailyTasks();
      fetchPoints();
    });
    const navigateToDetails = () => {
      common_vendor.index.navigateTo({ url: "/pages/points/details?points=" + points.value });
    };
    const handleTask = async (task) => {
      if (task.completed)
        return;
      switch (task.id) {
        case 1:
        case 2:
          common_vendor.index.navigateTo({ url: "/pages/swimming/index" });
          break;
        case 3:
          common_vendor.index.navigateTo({ url: "/pages/post/create" });
          break;
        case 4:
          common_vendor.index.navigateTo({ url: "/pages/share/index" });
          break;
      }
    };
    const handleExchange = async (item) => {
      if (points.value < item.points) {
        common_vendor.index.showToast({
          title: "积分不足",
          icon: "none"
        });
        return;
      }
      try {
        const res = await request({
          url: "/points/exchange",
          method: "POST",
          data: {
            itemId: item.id
          }
        });
        if (res.statusCode === 200) {
          common_vendor.index.showToast({
            title: "兑换成功",
            icon: "success"
          });
          points.value -= item.points;
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "兑换失败",
          icon: "error"
        });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(navigateToDetails),
        b: common_vendor.t(points.value),
        c: common_vendor.f(tasks.value, (task, k0, i0) => {
          return {
            a: task.icon,
            b: common_vendor.n(task.iconClass),
            c: common_vendor.t(task.name),
            d: common_vendor.t(task.points),
            e: common_vendor.t(task.completed ? "已完成" : "去完成"),
            f: task.completed ? 1 : "",
            g: common_vendor.o(($event) => handleTask(task), task.id),
            h: task.id
          };
        }),
        d: common_vendor.f(exchangeItems.value, (item, k0, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.points),
            d: common_vendor.t(points.value >= item.points ? "立即兑换" : "积分不足"),
            e: points.value < item.points ? 1 : "",
            f: common_vendor.o(($event) => handleExchange(item), item.id),
            g: item.id
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9bbf7136"], ["__file", "/Users/z/jd-uni-app/pages/points/points.vue"]]);
wx.createPage(MiniProgramPage);
