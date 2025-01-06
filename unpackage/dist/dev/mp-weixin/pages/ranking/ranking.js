"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_require = require("../../utils/require.js");
require("../../config.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
const _sfc_main = {
  __name: "ranking",
  setup(__props) {
    const selectedLocation = common_vendor.ref("national");
    const currentCity = common_vendor.ref("杭州");
    common_vendor.ref("浙江省");
    const activeTab = common_vendor.ref("day");
    const rankingList = common_vendor.ref([]);
    const currentUserRank = common_vendor.ref(null);
    const topThree = common_vendor.ref([]);
    const cityPopup = common_vendor.ref(null);
    const cities = common_vendor.ref([]);
    common_vendor.ref(0);
    common_vendor.ref(null);
    const isSelectingCity = common_vendor.ref(false);
    const selectedCityCode = common_vendor.ref("");
    const displayTopThree = common_vendor.computed(() => {
      if (!topThree.value || !Array.isArray(topThree.value)) {
        return [];
      }
      return topThree.value;
    });
    const selectCity = (cityData) => {
      currentCity.value = cityData.city;
      selectedCityCode.value = cityData.cityCode;
      closeCityPopup();
      fetchRankings(activeTab.value);
    };
    const closeCityPopup = () => {
      cityPopup.value.close();
      isSelectingCity.value = false;
    };
    const generateTest = async () => {
      await utils_require.request({
        url: "/rankings/generate-mock-data",
        method: "POST"
      });
    };
    const fetchRankings = async (tab = "daily") => {
      try {
        let res;
        if (selectedLocation.value === "national") {
          res = await utils_require.request({
            url: "/rankings",
            data: {
              type: tab,
              limit: 20
            }
          });
        } else {
          res = await utils_require.request({
            url: "/rankings/region",
            data: {
              type: tab,
              city: currentCity.value,
              cityCode: selectedCityCode.value
              // 添加cityCode参数
            }
          });
        }
        if (res.data.code === 200) {
          const rankings = res.data.data;
          topThree.value = rankings.slice(0, 3).map((item) => ({
            name: item.user_id.nickname,
            avatar: item.user_id.avatarUrl,
            score: ((item.total_distance || 0) / 1e3).toFixed(2),
            rank: item.rank
          }));
          rankingList.value = rankings.slice(3).map((item) => ({
            name: item.user_id.nickname,
            avatar: item.user_id.avatarUrl,
            distance: ((item.total_distance || 0) / 1e3).toFixed(2),
            rank: item.rank
          }));
        }
      } catch (error) {
        console.error("获取排行榜失败:", error);
        common_vendor.index.showToast({
          title: "获取排行榜失败",
          icon: "none"
        });
      }
    };
    const fetchCurrentUserRank = async () => {
      var _a, _b;
      try {
        const res = await utils_require.request({
          url: "/rankings/me",
          data: {
            type: activeTab.value === "day" ? "daily" : activeTab.value === "month" ? "monthly" : "yearly"
          }
        });
        if (res.data.code === 200) {
          const userRank = res.data.data;
          if (userRank) {
            currentUserRank.value = {
              rank: userRank.rank || 0,
              // 添加默认值
              name: ((_a = userRank.user_id) == null ? void 0 : _a.nickname) || "未知用户",
              avatar: ((_b = userRank.user_id) == null ? void 0 : _b.avatarUrl) || "/static/default-avatar.png",
              distance: ((userRank.total_distance || 0) / 1e3).toFixed(2)
            };
          } else {
            currentUserRank.value = {
              rank: 0,
              name: "未知用户",
              avatar: "/static/default-avatar.png",
              distance: 0
            };
          }
        }
      } catch (error) {
        console.error("获取个人排名失败:", error);
        currentUserRank.value = {
          rank: 0,
          name: "未知用户",
          avatar: "/static/default-avatar.png",
          distance: 0
        };
      }
    };
    const selectTab = async (tab) => {
      activeTab.value = tab;
      const rankTypes = {
        day: "daily",
        month: "monthly",
        year: "yearly"
      };
      await fetchRankings(rankTypes[tab]);
      await fetchCurrentUserRank();
    };
    common_vendor.onMounted(() => {
      fetchRankings();
      fetchCurrentUserRank();
    });
    common_vendor.onShow(() => {
      fetchRankings();
      fetchCurrentUserRank();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(generateTest),
        b: common_vendor.o(closeCityPopup),
        c: common_vendor.f(cities.value, (city, k0, i0) => {
          return {
            a: common_vendor.t(city.city),
            b: common_vendor.t(city.userCount),
            c: city.cityCode,
            d: common_vendor.o(($event) => selectCity(city), city.cityCode)
          };
        }),
        d: common_vendor.sr(cityPopup, "25b49241-0", {
          "k": "cityPopup"
        }),
        e: common_vendor.p({
          type: "center",
          ["background-color"]: "#fff"
        }),
        f: activeTab.value === "day" ? 1 : "",
        g: common_vendor.o(($event) => selectTab("day")),
        h: activeTab.value === "month" ? 1 : "",
        i: common_vendor.o(($event) => selectTab("month")),
        j: activeTab.value === "year" ? 1 : "",
        k: common_vendor.o(($event) => selectTab("year")),
        l: common_vendor.f(displayTopThree.value, (user, index, i0) => {
          return common_vendor.e({
            a: user
          }, user ? {
            b: common_vendor.t(user.rank),
            c: common_vendor.t(user.name),
            d: common_vendor.t(user.score),
            e: common_vendor.n(user.rank === 1 ? "yellow" : user.rank === 2 ? "orange" : "pink")
          } : {
            f: common_vendor.t(index === 0 ? 2 : index === 1 ? 1 : 3),
            g: common_vendor.n(index === 0 ? "orange" : index === 1 ? "yellow" : "pink")
          }, {
            h: index
          });
        }),
        m: rankingList.value.length > 0
      }, rankingList.value.length > 0 ? {
        n: common_vendor.f(rankingList.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.rank),
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.distance),
            d: item.rank
          };
        })
      } : {}, {
        o: common_vendor.t(currentUserRank.value.rank),
        p: common_vendor.t(currentUserRank.value.name),
        q: common_vendor.t(currentUserRank.value.distance)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/ranking/ranking.vue"]]);
wx.createPage(MiniProgramPage);
