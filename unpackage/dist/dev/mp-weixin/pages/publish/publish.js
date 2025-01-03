"use strict";
const common_vendor = require("../../common/vendor.js");
const api_moments = require("../../api/moments.js");
require("../../utils/require.js");
const _sfc_main = {
  __name: "publish",
  setup(__props) {
    const content = common_vendor.ref("");
    const images = common_vendor.ref([]);
    const isValid = common_vendor.computed(() => {
      return content.value.trim() || images.value.length > 0;
    });
    const chooseImages = () => {
      common_vendor.index.chooseImage({
        count: 9 - images.value.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          images.value = [...images.value, ...res.tempFilePaths];
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      });
    };
    const submitPost = async () => {
      var _a, _b;
      if (!isValid.value)
        return;
      try {
        common_vendor.index.showLoading({ title: "发布中..." });
        let imageUrls = [];
        if (images.value.length > 0) {
          try {
            const token = common_vendor.index.getStorageSync("token");
            for (const image of images.value) {
              const res2 = await new Promise((resolve, reject) => {
                common_vendor.index.uploadFile({
                  url: "http://localhost:3000/moments/upload",
                  filePath: image,
                  name: "images",
                  header: {
                    Authorization: `Bearer ${token}`
                  },
                  success: (uploadRes) => {
                    try {
                      const data = JSON.parse(uploadRes.data);
                      resolve(data);
                    } catch (e) {
                      reject(new Error("解析响应失败"));
                    }
                  },
                  fail: (err) => {
                    reject(err);
                  }
                });
              });
              if (res2.data.code === 201 && ((_b = (_a = res2.data.data) == null ? void 0 : _a.imageUrls) == null ? void 0 : _b[0])) {
                imageUrls.push(res2.data.data.imageUrls[0]);
              } else {
                throw new Error("图片上传失败");
              }
            }
          } catch (error) {
            console.error("图片上传失败:", error);
            common_vendor.index.showToast({
              title: "图片上传失败",
              icon: "none"
            });
            throw error;
          }
        }
        const res = await api_moments.momentApi.createMoment({
          content: content.value.trim(),
          images: imageUrls
        });
        if (res.data.code === 200) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "发布成功",
            icon: "success"
          });
          setTimeout(() => {
            var _a2;
            const pages = getCurrentPages();
            const prevPage = pages[pages.length - 2];
            if ((_a2 = prevPage == null ? void 0 : prevPage.$vm) == null ? void 0 : _a2.onRefresh) {
              prevPage.$vm.onRefresh();
            }
            common_vendor.index.navigateBack();
          }, 1500);
        } else {
          throw new Error(res.data.message || "发布失败");
        }
      } catch (error) {
        console.error("发布失败:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: error.message || "发布失败",
          icon: "none"
        });
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: content.value,
        b: common_vendor.o(($event) => content.value = $event.detail.value),
        c: common_vendor.f(images.value, (image, index, i0) => {
          return {
            a: image,
            b: index
          };
        }),
        d: images.value.length < 9
      }, images.value.length < 9 ? {
        e: common_vendor.o(chooseImages)
      } : {}, {
        f: !isValid.value,
        g: common_vendor.o(submitPost)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "/Users/z/jd-uni-app/pages/publish/publish.vue"]]);
wx.createPage(MiniProgramPage);