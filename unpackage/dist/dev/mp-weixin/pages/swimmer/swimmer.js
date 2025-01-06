"use strict";
const common_vendor = require("../../common/vendor.js");
const api_moments = require("../../api/moments.js");
require("../../utils/require.js");
require("../../config.js");
const pageSize = 20;
const _sfc_main = {
  __name: "swimmer",
  setup(__props) {
    const tabs = ["推荐", "关注", "我的"];
    const currentTab = common_vendor.ref(0);
    const posts = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const isRefreshing = common_vendor.ref(false);
    const page = common_vendor.ref(1);
    const fetchMoments = async (isRefresh = false) => {
      try {
        if (isRefresh) {
          page.value = 1;
        }
        const params = {
          page: page.value,
          limit: pageSize,
          type: tabs[currentTab.value].toLowerCase()
        };
        const res = await api_moments.momentApi.getMoments(params);
        const currentUserId = JSON.parse(common_vendor.index.getStorageSync("userInfo"))._id;
        if (res.data.code === 200) {
          const formattedPosts = res.data.data.items.map((item) => {
            var _a, _b, _c;
            return {
              id: item._id,
              username: item.author.nickname,
              avatar: item.author.avatarUrl,
              createTime: new Date(item.createdAt).toLocaleDateString("zh-CN"),
              content: item.content,
              image: ((_a = item.images) == null ? void 0 : _a[0]) || "",
              images: item.images || [],
              isFollowed: false,
              isLiked: (_b = item.likedBy) == null ? void 0 : _b.includes(currentUserId),
              // 添加这个字段，需要后端返回当前用户是否点赞
              likes: item.likeCount,
              comments: item.commentCount,
              shares: 0,
              sportData: (_c = item.metadata) == null ? void 0 : _c.sportData
            };
          });
          if (isRefresh) {
            posts.value = formattedPosts;
          } else {
            posts.value = [...posts.value, ...formattedPosts];
          }
          page.value++;
        } else {
          throw new Error(res.data.message || "获取动态列表失败");
        }
      } catch (error) {
        console.error("获取动态列表失败:", error);
        common_vendor.index.showToast({
          title: error.message || "获取动态列表失败",
          icon: "none"
        });
      }
    };
    const onRefresh = async () => {
      isRefreshing.value = true;
      try {
        await fetchMoments(true);
      } catch (error) {
        console.error("刷新失败:", error);
      } finally {
        isRefreshing.value = false;
      }
    };
    const loadMore = async () => {
      if (!loading.value) {
        loading.value = true;
        try {
          await fetchMoments();
        } finally {
          loading.value = false;
        }
      }
    };
    const handleTabChange = (index) => {
      currentTab.value = index;
      onRefresh();
    };
    const handleFollow = (post) => {
      post.isFollowed = !post.isFollowed;
      common_vendor.index.showToast({
        title: post.isFollowed ? "关注成功" : "已取消关注",
        icon: "success"
      });
    };
    const handleLike = async (post) => {
      try {
        const res = await api_moments.momentApi.likeMoment(post.id);
        if (res.data.code === 201) {
          const { liked } = res.data.data;
          post.likes += liked ? 1 : -1;
          common_vendor.index.showToast({
            title: liked ? "点赞成功" : "取消点赞",
            icon: "success"
          });
        } else {
          throw new Error(res.data.message || "操作失败");
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
    const handlePublish = () => {
      common_vendor.index.navigateTo({
        url: "/pages/publish/publish"
      });
    };
    const navigateToDetail = (postId) => {
      common_vendor.index.navigateTo({
        url: `/pages/swimmerDetail/swimmerDetail?id=${postId}`
      });
    };
    const previewImage = (url) => {
      common_vendor.index.previewImage({
        urls: [url]
      });
    };
    common_vendor.onMounted(() => {
      fetchMoments(true);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(tabs, (tab, index, i0) => {
          return {
            a: common_vendor.t(tab),
            b: index,
            c: currentTab.value === index ? 1 : "",
            d: common_vendor.o(($event) => handleTabChange(index), index)
          };
        }),
        b: common_vendor.f(posts.value, (post, index, i0) => {
          return common_vendor.e({
            a: post.avatar,
            b: common_vendor.t(post.username),
            c: common_vendor.t(post.createTime),
            d: common_vendor.t(post.isFollowed ? "已关注" : "关注"),
            e: post.isFollowed ? 1 : "",
            f: common_vendor.o(($event) => handleFollow(post), index),
            g: common_vendor.t(post.content),
            h: post.image
          }, post.image ? {
            i: post.image,
            j: common_vendor.o(($event) => previewImage(post.image), index)
          } : {}, {
            k: post.sportData
          }, post.sportData ? {
            l: common_vendor.t(post.sportData.distance),
            m: common_vendor.t(post.sportData.duration),
            n: common_vendor.t(post.sportData.pace),
            o: common_vendor.t(post.sportData.calories)
          } : {}, {
            p: common_vendor.o(($event) => navigateToDetail(post.id), index),
            q: post.isLiked ? "/static/icons/moments-share.png" : "/static/icons/moments-like.png",
            r: common_vendor.t(post.likes),
            s: common_vendor.o(($event) => handleLike(post), index),
            t: common_vendor.t(post.comments),
            v: common_vendor.o(($event) => navigateToDetail(post.id), index),
            w: common_vendor.t(post.shares),
            x: common_vendor.o(($event) => handleShare(), index),
            y: index
          });
        }),
        c: loading.value
      }, loading.value ? {} : {}, {
        d: common_vendor.o(loadMore),
        e: isRefreshing.value,
        f: common_vendor.o(onRefresh),
        g: common_vendor.o(handlePublish)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1693b82a"], ["__file", "/Users/z/jd-uni-app/pages/swimmer/swimmer.vue"]]);
wx.createPage(MiniProgramPage);
