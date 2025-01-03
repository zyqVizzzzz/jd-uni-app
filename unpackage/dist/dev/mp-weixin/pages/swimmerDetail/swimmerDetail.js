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
      try {
        const res = await api_moments.momentApi.getMomentDetail(id);
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
    const handleLike = () => {
      post.value.likes++;
      common_vendor.index.showToast({
        title: "点赞成功",
        icon: "success"
      });
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
        j: common_vendor.t(post.value.likes),
        k: common_vendor.o(handleLike),
        l: common_vendor.t(post.value.comments),
        m: common_vendor.t(post.value.shares),
        n: common_vendor.o(handleShare),
        o: common_vendor.f(commentList.value, (comment, k0, i0) => {
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
        p: replyTo.value ? `回复 @${replyTo.value.author.nickname}` : "说点什么吧...",
        q: inputFocus.value,
        r: common_vendor.o(handleInputBlur),
        s: commentText.value,
        t: common_vendor.o(($event) => commentText.value = $event.detail.value),
        v: replyTo.value
      }, replyTo.value ? {
        w: common_vendor.o(cancelReply)
      } : {}, {
        x: commentText.value.length > 0 ? 1 : "",
        y: common_vendor.o(handleSendComment)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-fb374706"], ["__file", "/Users/z/jd-uni-app/pages/swimmerDetail/swimmerDetail.vue"]]);
wx.createPage(MiniProgramPage);
