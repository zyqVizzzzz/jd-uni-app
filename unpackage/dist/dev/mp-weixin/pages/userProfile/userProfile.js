"use strict";
const common_vendor = require("../../common/vendor.js");
const api_userRelations = require("../../api/userRelations.js");
const api_points = require("../../api/points.js");
const api_moments = require("../../api/moments.js");
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
      if (activeTab.value === "dynamics") {
        await fetchDynamics();
      }
    };
    const fetchDynamics = async () => {
      if (isLoading.value)
        return;
      isLoading.value = true;
      try {
        const params = {
          page: page.value,
          limit: pageSize.value
        };
        const res = await api_moments.momentApi.getMoments(params);
        const currentUserId = JSON.parse(common_vendor.index.getStorageSync("userInfo"))._id;
        if (res.data.code === 200) {
          const formattedPosts = res.data.data.items.map((item) => {
            var _a, _b;
            return {
              id: item._id,
              content: item.content,
              createTime: new Date(item.createdAt).toLocaleDateString("zh-CN"),
              images: item.images || [],
              isLiked: (_a = item.likedBy) == null ? void 0 : _a.includes(currentUserId),
              likes: item.likeCount,
              comments: item.commentCount,
              shares: 0,
              sportData: (_b = item.metadata) == null ? void 0 : _b.sportData
            };
          });
          if (page.value === 1) {
            dynamicsList.value = formattedPosts;
          } else {
            dynamicsList.value = [...dynamicsList.value, ...formattedPosts];
          }
          page.value++;
        }
      } catch (error) {
        console.error("获取动态列表失败:", error);
        common_vendor.index.showToast({
          title: "获取动态列表失败",
          icon: "none"
        });
      } finally {
        isLoading.value = false;
        isRefreshing.value = false;
      }
    };
    const handleLike = async (post) => {
      try {
        const res = await api_moments.momentApi.likeMoment(post.id);
        if (res.data.code === 201) {
          const { liked } = res.data.data;
          dynamicsList.value = dynamicsList.value.map((p) => {
            if (p.id === post.id) {
              return {
                ...p,
                likes: p.likes + (liked ? 1 : -1),
                isLiked: liked
              };
            }
            return p;
          });
        }
      } catch (error) {
        console.error("点赞操作失败:", error);
        common_vendor.index.showToast({
          title: error.message || "操作失败",
          icon: "none"
        });
      }
    };
    const handleShare = (post) => {
      common_vendor.index.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"]
      });
    };
    const previewImage = (images, index) => {
      common_vendor.index.previewImage({
        current: index,
        urls: images
      });
    };
    const navigateToDetail = (postId) => {
      common_vendor.index.navigateTo({
        url: `/pages/swimmerDetail/swimmerDetail?id=${postId}`
      });
    };
    const handleMore = (post) => {
      const currentUserId = JSON.parse(common_vendor.index.getStorageSync("userInfo"))._id;
      const isOwnPost = post.authorId === currentUserId;
      const itemList = isOwnPost ? ["删除"] : ["举报"];
      common_vendor.index.showActionSheet({
        itemList,
        success: async function(res) {
          if (isOwnPost && res.tapIndex === 0) {
            try {
              const res2 = await api_moments.momentApi.deleteMoment(post.id);
              if (res2.data.code === 200) {
                dynamicsList.value = dynamicsList.value.filter(
                  (p) => p.id !== post.id
                );
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success"
                });
              }
            } catch (error) {
              console.error("删除动态失败:", error);
              common_vendor.index.showToast({
                title: "删除失败",
                icon: "none"
              });
            }
          } else if (!isOwnPost && res.tapIndex === 0) {
            common_vendor.index.showToast({
              title: "举报成功",
              icon: "success"
            });
          }
        }
      });
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
        t: common_vendor.f(dynamicsList.value, (post, index, i0) => {
          return common_vendor.e({
            a: common_vendor.t(post.createTime),
            b: common_vendor.t(post.content),
            c: post.images && post.images.length > 0
          }, post.images && post.images.length > 0 ? {
            d: common_vendor.f(post.images, (image, imageIndex, i1) => {
              return {
                a: image,
                b: imageIndex,
                c: common_vendor.o(($event) => previewImage(post.images, imageIndex), imageIndex)
              };
            }),
            e: common_vendor.n(post.images.length === 1 ? "single-image" : ""),
            f: common_vendor.n(post.images.length === 4 ? "four-grid" : ""),
            g: common_vendor.n(post.images.length > 4 ? "multi-grid" : "")
          } : {}, {
            h: post.sportData
          }, post.sportData ? {
            i: common_vendor.t(post.sportData.distance),
            j: common_vendor.t(post.sportData.duration),
            k: common_vendor.t(post.sportData.pace),
            l: common_vendor.t(post.sportData.calories)
          } : {}, {
            m: common_vendor.o(($event) => navigateToDetail(post.id), index),
            n: post.isLiked ? "/static/icons/moments-like-active.png" : "/static/icons/moments-like.png",
            o: common_vendor.t(post.likes),
            p: common_vendor.o(($event) => handleLike(post), index),
            q: common_vendor.t(post.comments),
            r: common_vendor.o(($event) => navigateToDetail(post.id), index),
            s: common_vendor.t(post.shares),
            t: common_vendor.o(($event) => handleShare(), index),
            v: common_vendor.o(($event) => handleMore(post), index),
            w: index
          });
        }),
        v: userInfo.value.avatar || "/static/avatar.png",
        w: common_vendor.t(userInfo.value.nickname)
      } : {}) : {}, {
        x: activeTab.value === "badges"
      }, activeTab.value === "badges" ? common_vendor.e({
        y: badgesList.value.length > 0
      }, badgesList.value.length > 0 ? {
        z: common_vendor.f(badgesList.value, (badge, index, i0) => {
          return {
            a: index
          };
        })
      } : {}) : {}, {
        A: isLoading.value
      }, isLoading.value ? {} : {}, {
        B: common_vendor.o(loadMore),
        C: isRefreshing.value,
        D: common_vendor.o(onRefresh)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/userProfile/userProfile.vue"]]);
wx.createPage(MiniProgramPage);
