"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "message",
  setup(__props) {
    const messageList = common_vendor.ref([
      {
        type: "activity",
        icon: "icon-email",
        iconType: "email",
        title: "Test",
        content: "test",
        time: "01-08 10:26"
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
