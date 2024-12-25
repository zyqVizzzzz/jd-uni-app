"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "message",
  setup(__props) {
    const messageList = common_vendor.ref([
      {
        type: "user",
        avatar: "/static/avatar.jpg",
        title: "用户昵称",
        content: "消息内容",
        time: "08-18 16:26"
      },
      {
        type: "user",
        avatar: "/static/avatar.jpg",
        title: "用户昵称",
        content: "消息内容",
        time: "08-18 16:26"
      },
      {
        type: "system",
        icon: "icon-notification",
        iconType: "bell",
        title: "系统消息",
        content: "XX点赞了您！",
        time: "08-18 10:26"
      },
      {
        type: "system",
        icon: "icon-notification",
        iconType: "bell",
        title: "Daily Reminder",
        content: "XX评论了您的动态",
        time: "08-18 10:26"
      },
      {
        type: "activity",
        icon: "icon-email",
        iconType: "email",
        title: "活动消息",
        content: "活动内容",
        time: "08-18 10:26"
      }
    ]);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(messageList.value, (item, index, i0) => {
          return common_vendor.e({
            a: item.type === "user"
          }, item.type === "user" ? {
            b: item.avatar
          } : {
            c: common_vendor.n(item.icon),
            d: common_vendor.n(item.iconType)
          }, {
            e: common_vendor.t(item.title),
            f: common_vendor.t(item.content),
            g: common_vendor.t(item.time),
            h: index
          });
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4c1b26cf"], ["__file", "/Users/z/jd-uni-app/pages/message/message.vue"]]);
wx.createPage(MiniProgramPage);
