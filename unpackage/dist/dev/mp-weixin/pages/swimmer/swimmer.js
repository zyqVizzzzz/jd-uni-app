"use strict";
const common_vendor = require("../../common/vendor.js");
const api_moments = require("../../api/moments.js");
const api_userRelations = require("../../api/userRelations.js");
const utils_eventBus = require("../../utils/eventBus.js");
require("../../utils/require.js");
require("../../config.js");
const pageSize = 20;
const _sfc_main = {
  __name: "swimmer",
  setup(__props) {
    const tabConfig = [
      { text: "推荐", type: "all" },
      { text: "关注", type: "following" },
      { text: "我的", type: "my" }
    ];
    const tabs = tabConfig.map((tab) => tab.text);
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
        console.log(page.value);
        const params = {
          page: Number(page.value),
          limit: Number(pageSize),
          type: tabConfig[currentTab.value].type
        };
        const res = await api_moments.momentApi.getMoments(params);
        const currentUserId = JSON.parse(common_vendor.index.getStorageSync("userInfo"))._id;
        if (res.data.code === 200) {
          const formattedPosts = res.data.data.items.map((item) => {
            var _a, _b, _c;
            return {
              id: item._id,
              username: item.author.nickname,
              authorId: item.author._id,
              avatar: item.author.avatarUrl,
              createTime: new Date(item.createdAt).toLocaleDateString("zh-CN"),
              content: item.content,
              image: ((_a = item.images) == null ? void 0 : _a[0]) || "",
              images: item.images || [],
              isFollowed: item.author.isFollowing,
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
    const handleMore = (post) => {
      const currentUserId = JSON.parse(common_vendor.index.getStorageSync("userInfo"))._id;
      const isOwnPost = post.authorId === currentUserId;
      const itemList = isOwnPost ? ["删除"] : ["举报", "不感兴趣"];
      common_vendor.index.showActionSheet({
        itemList,
        success: async function(res) {
          if (isOwnPost) {
            switch (res.tapIndex) {
              case 0:
                try {
                  await handleDeletePost(post.id);
                } catch (error) {
                  console.error("删除动态失败:", error);
                }
                break;
              case 1:
                common_vendor.index.showToast({
                  title: "举报成功",
                  icon: "success"
                });
                break;
            }
          } else {
            switch (res.tapIndex) {
              case 0:
                common_vendor.index.showToast({
                  title: "举报成功",
                  icon: "success"
                });
                break;
              case 1:
                common_vendor.index.showToast({
                  title: "已减少此类内容推荐",
                  icon: "none"
                });
                break;
            }
          }
        }
      });
    };
    const handleDeletePost = async (postId) => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这条动态吗？",
        success: async function(res) {
          if (res.confirm) {
            try {
              const res2 = await api_moments.momentApi.deleteMoment(postId);
              if (res2.data.code === 200) {
                posts.value = posts.value.filter((p) => p.id !== postId);
                common_vendor.index.showToast({
                  title: "删除成功",
                  icon: "success"
                });
              } else {
                throw new Error(res2.data.message || "删除失败");
              }
            } catch (error) {
              console.error("删除动态失败:", error);
              common_vendor.index.showToast({
                title: error.message || "删除失败",
                icon: "none"
              });
            }
          }
        }
      });
    };
    const handleFollow = async (post) => {
      console.log(post);
      try {
        const userInfo = JSON.parse(common_vendor.index.getStorageSync("userInfo") || "{}");
        let res;
        if (!post.isFollowed) {
          res = await api_userRelations.userRelationsApi.followUser(post.authorId);
        } else {
          res = await api_userRelations.userRelationsApi.unfollowUser(post.authorId);
        }
        if (res.data.code === 200 || res.data.code === 201) {
          console.log(posts.value);
          posts.value = posts.value.map((p) => {
            if (p.authorId === post.authorId) {
              return {
                ...p,
                isFollowed: !p.isFollowed
              };
            }
            return p;
          });
        }
      } catch (error) {
        console.error("关注操作失败:", error);
        common_vendor.index.showToast({
          title: error.message || "操作失败",
          icon: "none"
        });
      }
    };
    const handleLike = async (post) => {
      try {
        const res = await api_moments.momentApi.likeMoment(post.id);
        if (res.data.code === 201) {
          const { liked } = res.data.data;
          posts.value = posts.value.map((p) => {
            if (p.id === post.id) {
              return {
                ...p,
                likes: p.likes + (liked ? 1 : -1),
                isLiked: liked
              };
            }
            return p;
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
    const navigateToDetail = (postId, isFollowed) => {
      common_vendor.index.navigateTo({
        url: `/pages/swimmerDetail/swimmerDetail?id=${postId}&isFollowed=${isFollowed}`
      });
    };
    const previewImage = (url) => {
      common_vendor.index.previewImage({
        urls: [url]
      });
    };
    common_vendor.onMounted(() => {
      fetchMoments(true);
      utils_eventBus.emitter.on("updateSwimmerList", () => {
        console.log("收到更新事件");
        fetchMoments(true);
      });
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(common_vendor.unref(tabs), (tab, index, i0) => {
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
            h: post.images && post.images.length > 0
          }, post.images && post.images.length > 0 ? {
            i: common_vendor.f(post.images, (image, imageIndex, i1) => {
              return {
                a: image,
                b: imageIndex,
                c: common_vendor.o(($event) => previewImage(post.images), imageIndex)
              };
            }),
            j: common_vendor.n(post.images.length === 1 ? "single-image" : ""),
            k: common_vendor.n(post.images.length === 4 ? "four-grid" : ""),
            l: common_vendor.n(post.images.length > 4 ? "multi-grid" : "")
          } : {}, {
            m: post.sportData
          }, post.sportData ? {
            n: common_vendor.t(post.sportData.distance),
            o: common_vendor.t(post.sportData.duration),
            p: common_vendor.t(post.sportData.pace),
            q: common_vendor.t(post.sportData.calories)
          } : {}, {
            r: common_vendor.o(($event) => navigateToDetail(post.id, post.isFollowed), index),
            s: post.isLiked ? "/static/icons/moments-like-active.png" : "/static/icons/moments-like.png",
            t: common_vendor.t(post.likes),
            v: common_vendor.o(($event) => handleLike(post), index),
            w: common_vendor.t(post.comments),
            x: common_vendor.o(($event) => navigateToDetail(post.id, post.isFollowed), index),
            y: common_vendor.t(post.shares),
            z: common_vendor.o(($event) => handleShare(), index),
            A: common_vendor.o(($event) => handleMore(post), index),
            B: index
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
