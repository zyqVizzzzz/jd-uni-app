"use strict";
const common_vendor = require("../common/vendor.js");
const utils_require = require("../utils/require.js");
require("../config.js");
if (!Array) {
  const _easycom_uni_popup2 = common_vendor.resolveComponent("uni-popup");
  _easycom_uni_popup2();
}
const _easycom_uni_popup = () => "../uni_modules/uni-popup/components/uni-popup/uni-popup.js";
if (!Math) {
  _easycom_uni_popup();
}
const _sfc_main = {
  __name: "LoginPopup",
  emits: ["success", "close"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const emit = __emit;
    const popup = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    const isAgreed = common_vendor.ref(false);
    const step = common_vendor.ref(1);
    const token = common_vendor.ref("");
    const handleAgreementChange = (e) => {
      isAgreed.value = e.detail.value.length > 0;
    };
    const openPrivacyPolicy = () => {
      common_vendor.index.navigateTo({
        url: "/pages/agreement/privacy"
      });
    };
    const openUserAgreement = () => {
      common_vendor.index.navigateTo({
        url: "/pages/agreement/user"
      });
    };
    const updateUserInfo = async (userInfo) => {
      try {
        const res = await utils_require.request({
          url: "/auth/update-userinfo",
          method: "POST",
          data: userInfo
        });
        return res.data.code === 200 || res.data.code === 201 ? res.data.data : null;
      } catch (error) {
        console.error("更新用户信息失败", error);
        return null;
      }
    };
    const handleLogin = async () => {
      var _a, _b;
      if (!isAgreed.value) {
        common_vendor.index.showToast({
          title: "请先同意用户协议和隐私政策",
          icon: "none"
        });
        return;
      }
      try {
        loading.value = true;
        const loginRes = await common_vendor.index.login({
          provider: "weixin"
        });
        const res = await utils_require.request({
          url: "/auth/login",
          method: "POST",
          data: {
            code: loginRes.code
          }
        });
        if (res.data.code === 201 && res.data.data.access_token) {
          token.value = res.data.data.access_token;
          common_vendor.index.setStorageSync("token", token.value);
          if (((_a = res.data.data.user) == null ? void 0 : _a.nickname) && ((_b = res.data.data.user) == null ? void 0 : _b.avatarUrl)) {
            emit("success", {
              token: token.value,
              user: res.data.data.user
            });
            handleClose();
          } else {
            step.value = 2;
          }
        }
      } catch (error) {
        console.error("登录错误", error);
        common_vendor.index.showToast({
          title: "登录失败",
          icon: "error"
        });
      } finally {
        loading.value = false;
      }
    };
    const handleGetUserInfo = async () => {
      try {
        loading.value = true;
        const profileRes = await common_vendor.index.getUserProfile({
          desc: "用于完善用户资料"
        });
        console.log("微信返回的用户信息：", profileRes.userInfo);
        const updatedUser = await updateUserInfo(profileRes.userInfo);
        emit("success", {
          token: token.value,
          user: updatedUser || profileRes.userInfo
        });
        handleClose();
        common_vendor.index.showToast({
          title: "登录成功",
          icon: "success"
        });
      } catch (error) {
        console.error("获取用户信息失败", error);
        handleSkip();
      } finally {
        loading.value = false;
      }
    };
    const handleSkip = () => {
      emit("success", {
        token: token.value,
        user: null
      });
      handleClose();
    };
    const handleClose = () => {
      step.value = 1;
      token.value = "";
      popup.value.close();
      emit("close");
    };
    const open = () => {
      popup.value.open();
    };
    __expose({
      open
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: step.value === 1
      }, step.value === 1 ? {
        b: isAgreed.value,
        c: common_vendor.o(openPrivacyPolicy),
        d: common_vendor.o(openUserAgreement),
        e: common_vendor.o(handleAgreementChange),
        f: common_vendor.o(handleLogin),
        g: loading.value,
        h: !isAgreed.value,
        i: !isAgreed.value ? 1 : ""
      } : {
        j: common_vendor.o(handleGetUserInfo),
        k: loading.value,
        l: common_vendor.o(handleSkip)
      }, {
        m: common_vendor.sr(popup, "dc57fbbe-0", {
          "k": "popup"
        }),
        n: common_vendor.p({
          type: "bottom",
          ["background-color"]: "#fff"
        })
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dc57fbbe"], ["__file", "/Users/z/jd-uni-app/components/LoginPopup.vue"]]);
wx.createComponent(Component);
