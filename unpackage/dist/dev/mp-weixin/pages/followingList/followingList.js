"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_require = require("../../utils/require.js");
const api_userRelations = require("../../api/userRelations.js");
const utils_eventBus = require("../../utils/eventBus.js");
require("../../config.js");
const _sfc_main = {
  __name: "followingList",
  setup(__props) {
    const activeTab = common_vendor.ref("following");
    const searchKeyword = common_vendor.ref("");
    const list = common_vendor.ref([]);
    const page = common_vendor.ref(1);
    const pageSize = common_vendor.ref(20);
    const isLoading = common_vendor.ref(false);
    const isRefreshing = common_vendor.ref(false);
    const hasMore = common_vendor.ref(true);
    const filteredList = common_vendor.computed(() => {
      if (!searchKeyword.value)
        return list.value;
      return list.value.filter(
        (user) => user.nickname.toLowerCase().includes(searchKeyword.value.toLowerCase())
      );
    });
    const switchTab = (tab) => {
      activeTab.value = tab;
      page.value = 1;
      list.value = [];
      fetchUserList();
    };
    const fetchUserList = async () => {
      console.log(activeTab.value);
      if (isLoading.value || !hasMore.value && page.value > 1)
        return;
      isLoading.value = true;
      try {
        const endpoint = `/user-relations/${activeTab.value}`;
        const res = await utils_require.request({
          url: endpoint,
          data: {
            page: page.value,
            pageSize: pageSize.value
          }
        });
        if (res.statusCode === 200) {
          const newList = res.data.data.map((item) => {
            const user = activeTab.value === "following" ? item.toUser : item.fromUser;
            return {
              id: user._id,
              nickname: user.nickname,
              avatarUrl: user.avatarUrl,
              bio: user.bio,
              isFollowing: true
            };
          });
          if (page.value === 1) {
            list.value = newList;
          } else {
            list.value = [...list.value, ...newList];
          }
          hasMore.value = newList.length === pageSize.value;
          page.value += 1;
        }
      } catch (error) {
        console.error("获取用户列表失败:", error);
        common_vendor.index.showToast({
          title: "获取列表失败",
          icon: "none"
        });
      } finally {
        isLoading.value = false;
        isRefreshing.value = false;
      }
    };
    const onRefresh = () => {
      isRefreshing.value = true;
      page.value = 1;
      hasMore.value = true;
      fetchUserList();
    };
    const loadMore = () => {
      if (hasMore.value) {
        fetchUserList();
      }
    };
    const handleFollow = async (user) => {
      try {
        if (user.isFollowing) {
          await api_userRelations.userRelationsApi.unfollowUser(user.id);
          user.isFollowing = false;
          if (activeTab.value === "following") {
            list.value = list.value.filter((item) => item.id !== user.id);
          }
        } else {
          await api_userRelations.userRelationsApi.followUser(user.id);
          user.isFollowing = true;
        }
        common_vendor.index.showToast({
          title: user.isFollowing ? "关注成功" : "取消关注成功",
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
    const navigateToUserProfile = (userId) => {
      common_vendor.index.navigateTo({
        url: `/pages/userProfile/userProfile?id=${userId}`
      });
    };
    common_vendor.onMounted(() => {
      fetchUserList();
      utils_eventBus.emitter.on("updateFollowingList", () => {
        console.log("收到更新事件");
        fetchUserList();
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: activeTab.value === "following"
      }, activeTab.value === "following" ? {} : {}, {
        b: activeTab.value === "following" ? 1 : "",
        c: common_vendor.o(($event) => switchTab("following")),
        d: activeTab.value === "followers"
      }, activeTab.value === "followers" ? {} : {}, {
        e: activeTab.value === "followers" ? 1 : "",
        f: common_vendor.o(($event) => switchTab("followers")),
        g: filteredList.value.length > 0
      }, filteredList.value.length > 0 ? {
        h: common_vendor.f(filteredList.value, (user, index, i0) => {
          return common_vendor.e({
            a: user.avatarUrl || "/static/avatar.png",
            b: common_vendor.t(user.nickname || "未设置昵称"),
            c: common_vendor.o(($event) => navigateToUserProfile(user.id), index)
          }, activeTab.value === "following" ? {
            d: common_vendor.t(user.isFollowing ? "已关注" : "关注"),
            e: common_vendor.n(user.isFollowing ? "following" : ""),
            f: user.isFollowing ? 1 : "",
            g: common_vendor.o(($event) => handleFollow(user), index)
          } : {}, {
            h: index
          });
        }),
        i: activeTab.value === "following"
      } : {
        j: common_vendor.t(activeTab.value === "following" ? "还没有关注任何人" : "还没有粉丝")
      }, {
        k: isLoading.value && filteredList.value.length > 0
      }, isLoading.value && filteredList.value.length > 0 ? {} : {}, {
        l: common_vendor.o(loadMore),
        m: isRefreshing.value,
        n: common_vendor.o(onRefresh)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/followingList/followingList.vue"]]);
wx.createPage(MiniProgramPage);
