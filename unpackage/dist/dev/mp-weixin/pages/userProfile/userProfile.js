"use strict";
const common_vendor = require("../../common/vendor.js");
const api_userRelations = require("../../api/userRelations.js");
const api_points = require("../../api/points.js");
const utils_require = require("../../utils/require.js");
require("../../config.js");
const _sfc_main = {
  __name: "userProfile",
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const userId = common_vendor.ref("");
    const activeTab = common_vendor.ref("dynamics");
    const isLoading = common_vendor.ref(false);
    const isRefreshing = common_vendor.ref(false);
    const page = common_vendor.ref(1);
    const pageSize = common_vendor.ref(20);
    const userInfo = common_vendor.ref({
      id: "",
      nickname: "",
      avatar: "",
      bio: "",
      followingCount: 0,
      followersCount: 0,
      points: 0,
      isFollowing: false,
      isBlocked: false,
      // 额外信息
      gender: 0,
      city: "",
      province: "",
      birthday: "",
      weight: 0,
      height: 0,
      target: 0
    });
    const dynamicsList = common_vendor.ref([]);
    const badgesList = common_vendor.ref([]);
    const switchTab = (tab) => {
      activeTab.value = tab;
      page.value = 1;
      fetchTabContent();
    };
    const fetchUserInfo = async () => {
      try {
        const res = await utils_require.request({
          url: `/users/${userId.value}/profile`
        });
        if (res.data.code === 200) {
          const userData = res.data.data;
          userInfo.value = {
            id: userData._id,
            nickname: userData.nickname || "未设置昵称",
            avatar: userData.avatarUrl,
            bio: userData.bio || "这个人很懒，没有签名",
            followingCount: userData.following >= 0 ? userData.following : 0,
            followersCount: userData.followers || 0,
            points: userData.points || 0,
            isFollowing: userData.isFollowing,
            isBlocked: userData.isBlocked,
            // 额外信息
            gender: userData.gender,
            city: userData.city,
            province: userData.province,
            birthday: userData.birthday,
            weight: userData.weight,
            height: userData.height,
            target: userData.target
          };
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
        common_vendor.index.showToast({
          title: "获取用户信息失败",
          icon: "none"
        });
      }
    };
    const points = common_vendor.ref(0);
    const fetchPoints = async () => {
      try {
        const res = await api_points.pointApi.getUserPoints();
        if (res.data.code === 200) {
          points.value = res.data.data.totalPoints;
        }
      } catch (error) {
      }
    };
    common_vendor.onLoad((options) => {
      if (options.id) {
        userId.value = options.id;
      }
    });
    const fetchTabContent = async () => {
      if (isLoading.value)
        return;
      isLoading.value = true;
      try {
        const endpoint = activeTab.value === "dynamics" ? `/dynamics/${userId.value}` : `/badges/${userId.value}`;
        const res = await utils_require.request({
          url: endpoint,
          data: {
            page: page.value,
            pageSize: pageSize.value
          }
        });
        if (res.statusCode === 200) {
          const list = activeTab.value === "dynamics" ? dynamicsList : badgesList;
          if (page.value === 1) {
            list.value = res.data;
          } else {
            list.value = [...list.value, ...res.data];
          }
        }
      } catch (error) {
        console.error("获取内容失败:", error);
        common_vendor.index.showToast({
          title: "获取内容失败",
          icon: "none"
        });
      } finally {
        isLoading.value = false;
        isRefreshing.value = false;
      }
    };
    const handleFollow = async () => {
      try {
        if (userInfo.value.isFollowing) {
          await api_userRelations.userRelationsApi.unfollowUser(userId.value);
        } else {
          await api_userRelations.userRelationsApi.followUser(userId.value);
        }
        userInfo.value.isFollowing = !userInfo.value.isFollowing;
        common_vendor.index.showToast({
          title: userInfo.value.isFollowing ? "关注成功" : "取消关注成功",
          icon: "success"
        });
      } catch (error) {
        console.error("操作失败:", error);
        common_vendor.index.showToast({
          title: "操作失败",
          icon: "none"
        });
      }
    };
    const navigateToFollows = (type) => {
      common_vendor.index.navigateTo({
        url: `/pages/follows/follows?type=${type}&userId=${props.userId}`
      });
    };
    const onRefresh = () => {
      isRefreshing.value = true;
      page.value = 1;
      fetchTabContent();
    };
    const loadMore = () => {
      fetchTabContent();
    };
    common_vendor.onMounted(() => {
      fetchUserInfo();
      fetchPoints();
      fetchTabContent();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userInfo.value.avatar || "/static/avatar.png",
        b: common_vendor.t(userInfo.value.nickname),
        c: common_vendor.t(userInfo.value.bio || "简介XXXXXXXXXXXX"),
        d: common_vendor.t(userInfo.value.followingCount || 0),
        e: common_vendor.o(($event) => navigateToFollows("following")),
        f: common_vendor.t(userInfo.value.followersCount || 0),
        g: common_vendor.o(($event) => navigateToFollows("followers")),
        h: common_vendor.t(points.value || 0),
        i: common_vendor.t(userInfo.value.isFollowing ? "已关注" : "关注"),
        j: userInfo.value.isFollowing ? 1 : "",
        k: common_vendor.o(handleFollow),
        l: activeTab.value === "dynamics"
      }, activeTab.value === "dynamics" ? {} : {}, {
        m: activeTab.value === "dynamics" ? 1 : "",
        n: common_vendor.o(($event) => switchTab("dynamics")),
        o: activeTab.value === "badges"
      }, activeTab.value === "badges" ? {} : {}, {
        p: activeTab.value === "badges" ? 1 : "",
        q: common_vendor.o(($event) => switchTab("badges")),
        r: activeTab.value === "dynamics"
      }, activeTab.value === "dynamics" ? common_vendor.e({
        s: dynamicsList.value.length > 0
      }, dynamicsList.value.length > 0 ? {
        t: common_vendor.f(dynamicsList.value, (item, index, i0) => {
          return {
            a: index
          };
        })
      } : {}) : {}, {
        v: activeTab.value === "badges"
      }, activeTab.value === "badges" ? common_vendor.e({
        w: badgesList.value.length > 0
      }, badgesList.value.length > 0 ? {
        x: common_vendor.f(badgesList.value, (badge, index, i0) => {
          return {
            a: index
          };
        })
      } : {}) : {}, {
        y: isLoading.value
      }, isLoading.value ? {} : {}, {
        z: common_vendor.o(loadMore),
        A: isRefreshing.value,
        B: common_vendor.o(onRefresh)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/userProfile/userProfile.vue"]]);
wx.createPage(MiniProgramPage);
