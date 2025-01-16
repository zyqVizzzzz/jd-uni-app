"use strict";
const common_vendor = require("../../common/vendor.js");
const api_userRelations = require("../../api/userRelations.js");
const utils_require = require("../../utils/require.js");
require("../../config.js");
const _sfc_main = {
  __name: "followingList",
  setup(__props) {
    const activeTab = common_vendor.ref("following");
    const list = common_vendor.ref([]);
    common_vendor.ref(1);
    common_vendor.ref(20);
    const isLoading = common_vendor.ref(false);
    const isRefreshing = common_vendor.ref(false);
    common_vendor.ref(false);
    const switchTab = (tab) => {
      activeTab.value = tab;
      fetchUserList();
    };
    const fetchUserList = async () => {
      if (isLoading.value)
        return;
      isLoading.value = true;
      try {
        const endpoint = `/user-relations/${activeTab.value}`;
        const res = await utils_require.request({
          url: endpoint
        });
        if (res.data.code === 200) {
          list.value = res.data.data.map((item) => {
            const user = activeTab.value === "following" ? item.toUser : item.fromUser;
            return {
              id: user._id,
              nickname: user.nickname,
              avatarUrl: user.avatarUrl,
              bio: user.bio,
              isFollowing: true
              // following列表中都是已关注的
            };
          });
        }
      } catch (error) {
        console.error("获取用户列表失败:", error);
        common_vendor.index.showToast({
          title: "获取用户列表失败",
          icon: "none"
        });
      } finally {
        isLoading.value = false;
        isRefreshing.value = false;
      }
    };
    const onRefresh = () => {
      isRefreshing.value = true;
      fetchUserList();
    };
    const loadMore = () => {
      fetchUserList();
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
        g: list.value.length > 0
      }, list.value.length > 0 ? {
        h: common_vendor.f(list.value, (user, index, i0) => {
          return common_vendor.e({
            a: user.avatarUrl || "/static/avatar.png",
            b: common_vendor.t(user.nickname || "未设置昵称"),
            c: common_vendor.t(user.bio || "这个人很懒，没有签名"),
            d: common_vendor.o(($event) => navigateToUserProfile(user.id), index)
          }, activeTab.value === "following" ? {
            e: common_vendor.t(user.isFollowing ? "已关注" : "关注"),
            f: common_vendor.n(user.isFollowing ? "following" : ""),
            g: common_vendor.o(($event) => handleFollow(user), index)
          } : {}, {
            h: index
          });
        }),
        i: activeTab.value === "following"
      } : {
        j: common_vendor.t(activeTab.value === "following" ? "还没有关注任何人" : "还没有粉丝")
      }, {
        k: isLoading.value && list.value.length > 0
      }, isLoading.value && list.value.length > 0 ? {} : {}, {
        l: common_vendor.o(loadMore),
        m: isRefreshing.value,
        n: common_vendor.o(onRefresh)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/followingList/followingList.vue"]]);
wx.createPage(MiniProgramPage);
