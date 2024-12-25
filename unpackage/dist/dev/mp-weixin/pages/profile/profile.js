"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_require = require("../../utils/require.js");
const _sfc_main = {
  __name: "profile",
  setup(__props) {
    const userInfo = common_vendor.ref({});
    const genderOptions = ["未设置", "男", "女"];
    const cityArray = common_vendor.ref(["", "", ""]);
    const weightOptions = Array.from(
      {
        length: 171
      },
      (_, i) => `${i + 30}kg`
    );
    const weightIndex = common_vendor.computed(() => {
      if (!userInfo.value.weight) {
        return 20;
      }
      return weightOptions.findIndex((w) => parseInt(w) === userInfo.value.weight) || 20;
    });
    const heightOptions = Array.from(
      {
        length: 151
      },
      (_, i) => `${i + 100}cm`
    );
    const heightIndex = common_vendor.computed(() => {
      if (!userInfo.value.height) {
        return 70;
      }
      return heightOptions.findIndex((h) => parseInt(h) === userInfo.value.height) || 70;
    });
    const handleCityChange = (e) => {
      const [province, city, district] = e.detail.value;
      const cityDisplay = city || province;
      updateUserInfo({
        city: cityDisplay,
        province,
        // 如果后端需要，可以保存完整的地址信息
        district
      });
    };
    const getDate = (type) => {
      const date = /* @__PURE__ */ new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      if (type === "start") {
        year = year - 100;
      } else if (type === "end") {
        year = year;
      } else if (type === "default") {
        year = 2e3;
      }
      month = month > 9 ? month : "0" + month;
      day = day > 9 ? day : "0" + day;
      return `${year}-${month}-${day}`;
    };
    const currentDate = common_vendor.computed(() => {
      return userInfo.value.birthday || getDate("default");
    });
    const startDate = common_vendor.computed(() => getDate("start"));
    const endDate = common_vendor.computed(() => getDate("end"));
    common_vendor.onMounted(() => {
      fetchUserInfo();
    });
    const fetchUserInfo = async () => {
      try {
        const res = await utils_require.request({
          url: "/users/me"
        });
        if (res.data.code === 200) {
          const userData = res.data.data;
          userInfo.value = userData;
          common_vendor.index.setStorageSync("userInfo", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("获取用户信息失败:", error);
      }
    };
    const updateUserInfo = async (data) => {
      try {
        const res = await utils_require.request({
          url: "/users/me",
          method: "POST",
          data
        });
        if (res.data.code === 201) {
          common_vendor.index.showToast({
            title: "更新成功",
            icon: "success"
          });
          fetchUserInfo();
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "更新失败",
          icon: "none"
        });
      }
    };
    const showNicknameInput = () => {
      common_vendor.index.showModal({
        title: "修改昵称",
        editable: true,
        placeholderText: "请输入昵称",
        content: userInfo.value.nickname || "",
        success: function(res) {
          if (res.confirm && res.content) {
            updateUserInfo({
              nickname: res.content
            });
          }
        }
      });
    };
    const showBioInput = () => {
      common_vendor.index.showModal({
        title: "修改简介",
        editable: true,
        placeholderText: "请输入简介",
        content: userInfo.value.bio || "",
        success: function(res) {
          if (res.confirm && res.content) {
            updateUserInfo({
              bio: res.content
            });
          }
        }
      });
    };
    const getPhoneNumber = async (e) => {
      if (e.detail.errMsg !== "getPhoneNumber:ok") {
        return;
      }
      try {
        const res = await utils_require.request({
          url: "/users/me",
          method: "POST",
          data: {
            code: e.detail.code
            // 微信返回的code
          }
        });
        if (res.data.code === 201) {
          common_vendor.index.showToast({
            title: "手机号绑定成功",
            icon: "success"
          });
          fetchUserInfo();
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "手机号绑定失败",
          icon: "none"
        });
      }
    };
    const handleGenderChange = (e) => {
      const value = parseInt(e.detail.value);
      updateUserInfo({
        gender: value
      });
    };
    const handleBirthdayChange = (e) => {
      updateUserInfo({
        birthday: e.detail.value
      });
    };
    const handleWeightChange = (e) => {
      const weight = parseInt(weightOptions[e.detail.value]);
      updateUserInfo({
        weight
      });
    };
    const handleHeightChange = (e) => {
      const height = parseInt(heightOptions[e.detail.value]);
      updateUserInfo({
        height
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: userInfo.value.avatarUrl || "/static/avatar-default@3x.png",
        b: common_vendor.t(userInfo.value.nickname || "未设置"),
        c: common_vendor.o(showNicknameInput),
        d: common_vendor.t(userInfo.value.bio || "未设置"),
        e: common_vendor.o(showBioInput),
        f: !userInfo.value.phone
      }, !userInfo.value.phone ? {
        g: common_vendor.o(getPhoneNumber)
      } : {}, {
        h: common_vendor.t(genderOptions[userInfo.value.gender] || "未设置"),
        i: common_vendor.o(handleGenderChange),
        j: userInfo.value.gender || 0,
        k: genderOptions,
        l: common_vendor.t(userInfo.value.birthday || "未设置"),
        m: userInfo.value.birthday || currentDate.value,
        n: startDate.value,
        o: endDate.value,
        p: common_vendor.o(handleBirthdayChange),
        q: common_vendor.t(userInfo.value.weight ? `${userInfo.value.weight}kg` : "未设置"),
        r: common_vendor.o(handleWeightChange),
        s: weightIndex.value,
        t: common_vendor.unref(weightOptions),
        v: common_vendor.t(userInfo.value.height ? `${userInfo.value.height}cm` : "未设置"),
        w: common_vendor.o(handleHeightChange),
        x: heightIndex.value,
        y: common_vendor.unref(heightOptions),
        z: common_vendor.t(userInfo.value.city + " " + userInfo.value.district || "未设置"),
        A: common_vendor.o(handleCityChange),
        B: cityArray.value
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/profile/profile.vue"]]);
wx.createPage(MiniProgramPage);
