"use strict";
const common_vendor = require("../../common/vendor.js");
const api_moments = require("../../api/moments.js");
const api_comments = require("../../api/comments.js");
require("../../utils/require.js");
const _sfc_main = {
  __name: "swimmerDetail",
  setup(__props) {
    const post = common_vendor.ref({});
    const postId = common_vendor.ref("");
    const commentList = common_vendor.ref([]);
    common_vendor.ref(1);
    common_vendor.ref(false);
    common_vendor.ref(true);
    const commentText = common_vendor.ref("");
    const inputFocus = common_vendor.ref(false);
    const replyTo = common_vendor.ref(null);
    const fetchPostDetail = async (id) => {
      var _a;
      try {
        const res = await api_moments.momentApi.getMomentDetail(id);
        const currentUserId = JSON.parse(common_vendor.index.getStorageSync("userInfo"))._id;
        if (res.data.code === 200) {
          const data = res.data.data;
          console.log(data);
          post.value = {
            id: data._id,
            username: data.author.nickname,
            avatar: data.author.avatarUrl,
            location: data.location || "",
            content: data.content,
            images: data.images || [],
            isFollowed: data.isFollowed,
            isLiked: (_a = data.likedBy) == null ? void 0 : _a.includes(currentUserId),
            likes: data.likeCount,
            comments: data.commentCount,
            shares: data.shareCount || 0
          };
        } else {
          throw new Error(res.data.message || "获取动态详情失败");
        }
      } catch (error) {
        console.error("获取动态详情失败:", error);
        common_vendor.index.showToast({
          title: error.message || "获取动态详情失败",
          icon: "none"
        });
      }
    };
    const fetchComments = async (id) => {
      try {
        const res = await api_comments.commentsApi.getComments(id);
        if (res.data.code === 200) {
          commentList.value = res.data.data;
          commentList.value.forEach((item) => {
            console.log(item.author.nickname);
          });
        }
      } catch (error) {
        common_vendor.index.showToast({ title: "获取评论失败", icon: "none" });
      }
    };
    const handleSendComment = async () => {
      if (!commentText.value.trim())
        return;
      try {
        let res;
        if (replyTo.value && replyTo.value._id) {
          console.log(replyTo.value._id);
          res = await api_comments.commentsApi.replyComment(replyTo.value._id, {
            content: commentText.value
          });
        } else {
          res = await api_comments.commentsApi.createComment(post.value.id, {
            content: commentText.value
          });
        }
        if (res.data.code === 201) {
          await fetchComments(post.value.id);
          commentText.value = "";
          replyTo.value = null;
          post.value.comments++;
          common_vendor.index.showToast({
            title: "发送成功",
            icon: "success"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "发送失败",
          icon: "none"
        });
      }
    };
    const handleReply = (comment) => {
      replyTo.value = comment;
      inputFocus.value = true;
    };
    const cancelReply = () => {
      replyTo.value = null;
    };
    const formatTime = (time) => {
      const date = new Date(time);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${date.getMonth() + 1}月${date.getDate()}日 ${hours}:${minutes}`;
    };
    const handleInputBlur = () => {
      inputFocus.value = false;
    };
    const handleFollow = () => {
      post.value.isFollowed = !post.value.isFollowed;
      common_vendor.index.showToast({
        title: post.value.isFollowed ? "关注成功" : "已取消关注",
        icon: "success"
      });
    };
    const handleLike = async () => {
      try {
        const res = await api_moments.momentApi.likeMoment(post.value.id);
        if (res.data.code === 201) {
          const { liked } = res.data.data;
          post.value.likes += liked ? 1 : -1;
          post.value.isLiked = liked;
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
    const handleShare = () => {
      common_vendor.index.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"]
      });
    };
    const previewImage = (index) => {
      common_vendor.index.previewImage({
        current: post.value.images[index],
        urls: post.value.images
      });
    };
    common_vendor.onLoad((options) => {
      if (options.id) {
        postId.value = options.id;
        fetchPostDetail(options.id);
        fetchComments(options.id);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: post.value.avatar,
        b: common_vendor.t(post.value.username),
        c: common_vendor.t(post.value.location),
        d: common_vendor.t(post.value.isFollowed ? "已关注" : "关注"),
        e: post.value.isFollowed ? 1 : "",
        f: common_vendor.o(handleFollow),
        g: common_vendor.t(post.value.content),
        h: post.value.images && post.value.images.length
      }, post.value.images && post.value.images.length ? {
        i: common_vendor.f(post.value.images, (image, index, i0) => {
          return {
            a: index,
            b: image,
            c: common_vendor.o(($event) => previewImage(index), index)
          };
        })
      } : {}, {
        j: post.value.isLiked ? "/static/icons/moments-share.png" : "/static/icons/moments-like.png",
        k: common_vendor.t(post.value.likes),
        l: common_vendor.o(handleLike),
        m: common_vendor.t(post.value.comments),
        n: common_vendor.t(post.value.shares),
        o: common_vendor.o(handleShare),
        p: common_vendor.f(commentList.value, (comment, k0, i0) => {
          return common_vendor.e({
            a: comment.author.avatarUrl,
            b: !comment.parentComment
          }, !comment.parentComment ? {
            c: common_vendor.t(comment.author.nickname)
          } : {
            d: common_vendor.t(comment.author.nickname),
            e: common_vendor.t(comment.parentComment.author.nickname)
          }, {
            f: common_vendor.t(formatTime(comment.createdAt)),
            g: common_vendor.t(comment.content),
            h: common_vendor.o(($event) => handleReply(comment), comment._id),
            i: comment._id
          });
        }),
        q: replyTo.value ? `回复 @${replyTo.value.author.nickname}` : "说点什么吧...",
        r: inputFocus.value,
        s: common_vendor.o(handleInputBlur),
        t: commentText.value,
        v: common_vendor.o(($event) => commentText.value = $event.detail.value),
        w: replyTo.value
      }, replyTo.value ? {
        x: common_vendor.o(cancelReply)
      } : {}, {
        y: commentText.value.length > 0 ? 1 : "",
        z: common_vendor.o(handleSendComment)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fb374706"], ["__file", "/Users/z/jd-uni-app/pages/swimmerDetail/swimmerDetail.vue"]]);
wx.createPage(MiniProgramPage);
