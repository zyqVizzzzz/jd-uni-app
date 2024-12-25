"use strict";
const common_vendor = require("../../common/vendor.js");
const canvasWidth = 654;
const canvasHeight = 1e3;
const _sfc_main = {
  __name: "share",
  props: {
    distance: {
      type: Number,
      default: 275
    },
    duration: {
      type: String,
      default: "1:13:41"
    },
    pace: {
      type: String,
      default: "26'47"
    },
    calories: {
      type: Number,
      default: 99
    },
    poolLength: {
      type: Number,
      default: 25
    },
    laps: {
      type: Number,
      default: 11
    }
  },
  setup(__props) {
    const props = __props;
    const dataOptions = common_vendor.ref([
      {
        label: "总距离",
        key: "distance",
        checked: true
      },
      {
        label: "总时间",
        key: "duration",
        checked: true
      },
      {
        label: "配速",
        key: "pace",
        checked: true
      },
      {
        label: "消耗热量",
        key: "calories",
        checked: true
      },
      {
        label: "趟数",
        key: "laps",
        checked: true
      },
      {
        label: "泳池长度",
        key: "poolLength",
        checked: true
      }
    ]);
    const textOptions = common_vendor.ref([
      {
        content: "在水里，才自由",
        selected: true
      },
      {
        content: "享受失重 掌控自由",
        selected: false
      },
      {
        content: "聚焦于动",
        selected: false
      },
      {
        content: "水中的每一道阻力 都是你不竭的动力",
        selected: false
      },
      {
        content: "相信自己的能力 你可以克服任何困难",
        selected: false
      },
      {
        content: "你的坚持和毅力让我感到惊讶 是个令人敬佩的游泳高手",
        selected: false
      }
    ]);
    const imageOptions = common_vendor.ref([
      {
        url: "/static/swimming.jpg",
        selected: true
      },
      {
        url: "/static/swimming.jpg",
        selected: false
      },
      {
        url: "/static/swimming.jpg",
        selected: false
      }
    ]);
    const customImage = common_vendor.ref(null);
    const isEditing = common_vendor.ref(false);
    const currentTab = common_vendor.ref(0);
    const tabs = ["数据", "文案", "图片"];
    const dataItems = common_vendor.computed(() => [
      {
        label: "距离",
        value: props.distance,
        unit: "M"
      },
      {
        label: "时间",
        value: props.duration
      },
      {
        label: "平均配速",
        value: props.pace,
        unit: "/100m"
      },
      {
        label: "消耗热量",
        value: props.calories,
        unit: "KCAL"
      },
      {
        label: "泳池长度",
        value: props.poolLength,
        unit: "M"
      },
      {
        label: "趟数",
        value: props.laps
      }
    ]);
    const canvasStyle = common_vendor.ref("position: fixed; left: -9999rpx;");
    const pixelRatio = common_vendor.index.getSystemInfoSync().pixelRatio || 2;
    const checkPhotoPermission = () => {
      return new Promise((resolve, reject) => {
        common_vendor.index.authorize({
          scope: "scope.writePhotosAlbum",
          success: resolve,
          fail: () => {
            common_vendor.index.showModal({
              title: "提示",
              content: "需要您授权保存图片到相册",
              success: (res) => {
                if (res.confirm) {
                  common_vendor.index.openSetting({
                    success: (settingRes) => {
                      if (settingRes.authSetting["scope.writePhotosAlbum"]) {
                        resolve();
                      } else {
                        reject(new Error("未获得权限"));
                      }
                    }
                  });
                } else {
                  reject(new Error("用户拒绝授权"));
                }
              }
            });
          }
        });
      });
    };
    const switchTab = (index) => {
      currentTab.value = index;
    };
    const toggleEdit = () => {
      isEditing.value = !isEditing.value;
    };
    const toggleDataOption = (index) => {
      const checkedCount = dataOptions.value.filter((item) => item.checked).length;
      if (dataOptions.value[index].checked && checkedCount <= 3) {
        common_vendor.index.showToast({
          title: "至少需要显示3项数据",
          icon: "none"
        });
        return;
      }
      if (dataOptions.value[index].checked) {
        if (checkedCount - 1 < 3) {
          common_vendor.index.showToast({
            title: "至少需要显示3项数据",
            icon: "none"
          });
          return;
        }
      }
      dataOptions.value[index].checked = !dataOptions.value[index].checked;
    };
    const getOptionChecked = (key) => {
      const option = dataOptions.value.find((item) => item.key === key);
      return option ? option.checked : true;
    };
    const selectedText = common_vendor.computed(() => {
      const selectedOption = textOptions.value.find((item) => item.selected);
      return selectedOption ? selectedOption.content : "在水里，才自由！";
    });
    const toggleTextSelection = (index) => {
      textOptions.value.forEach((item, i) => {
        item.selected = i === index;
      });
    };
    const selectedImage = common_vendor.computed(() => {
      var _a;
      if ((_a = customImage.value) == null ? void 0 : _a.selected) {
        return customImage.value.url;
      }
      const selectedOption = imageOptions.value.find((img) => img.selected);
      return selectedOption ? selectedOption.url : imageOptions.value[0].url;
    });
    const selectImage = (index) => {
      imageOptions.value.forEach((img) => img.selected = false);
      if (customImage.value) {
        customImage.value.selected = false;
      }
      imageOptions.value[index].selected = true;
    };
    const chooseImage = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album"],
        success: (res) => {
          imageOptions.value.forEach((img) => img.selected = false);
          customImage.value = {
            url: res.tempFilePaths[0],
            selected: true
          };
        },
        fail: (err) => {
          console.error("选择图片失败:", err);
          common_vendor.index.showToast({
            title: "选择图片失败",
            icon: "none"
          });
        }
      });
    };
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = common_vendor.index.createOffscreenCanvas({
          type: "2d"
        }).createImage();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("图片加载失败"));
        img.src = src;
      });
    };
    const drawRoundRect = (ctx, x, y, width, height, radius) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.arcTo(x + width, y, x + width, y + radius, radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
      ctx.lineTo(x + radius, y + height);
      ctx.arcTo(x, y + height, x, y + height - radius, radius);
      ctx.lineTo(x, y + radius);
      ctx.arcTo(x, y, x + radius, y, radius);
      ctx.closePath();
    };
    const startDraw = async () => {
      try {
        const query = common_vendor.index.createSelectorQuery();
        const canvas = await new Promise((resolve) => {
          query.select("#shareCanvas").fields({
            node: true,
            size: true
          }).exec((res) => {
            var _a;
            if ((_a = res[0]) == null ? void 0 : _a.node) {
              resolve(res[0].node);
            } else {
              throw new Error("获取画布节点失败");
            }
          });
        });
        const ctx = canvas.getContext("2d");
        canvas.width = canvasWidth * pixelRatio;
        canvas.height = canvasHeight * pixelRatio;
        ctx.scale(pixelRatio, pixelRatio);
        const [selectedImg, qrCodeImg] = await Promise.all([
          loadImage(selectedImage.value),
          // 使用选中的图片
          loadImage("/static/qr-code.jpg")
        ]);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(selectedImg, 0, 0, canvasWidth, 400);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 36px sans-serif";
        ctx.fillText(selectedText.value, 40, 360);
        ctx.fillStyle = "#333333";
        ctx.font = "32px sans-serif";
        ctx.fillText("游泳数据", 30, 460);
        let visibleIndex = 0;
        dataItems.value.forEach((item, index) => {
          const key = dataOptions.value[index].key;
          if (getOptionChecked(key)) {
            const x = 30 + visibleIndex % 2 * 220;
            const y = 530 + Math.floor(visibleIndex / 2) * 100;
            ctx.font = "bold 40px sans-serif";
            ctx.fillStyle = "#333333";
            ctx.fillText(item.value.toString(), x, y);
            if (item.unit) {
              const valueWidth = ctx.measureText(item.value.toString()).width;
              ctx.font = "24px sans-serif";
              ctx.fillStyle = "#666666";
              ctx.fillText(item.unit, x + valueWidth + 10, y);
            }
            visibleIndex++;
          }
        });
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, canvasHeight - 180, canvasWidth, 180);
        ctx.fillStyle = "#ffffff";
        ctx.font = "28px sans-serif";
        ctx.fillText("长按屏幕识别二维码", 30, canvasHeight - 100);
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "24px sans-serif";
        ctx.fillText("加入焦动和我一起游泳", 30, canvasHeight - 60);
        drawRoundRect(ctx, canvasWidth - 150, canvasHeight - 150, 120, 120, 12);
        ctx.clip();
        ctx.drawImage(qrCodeImg, canvasWidth - 150, canvasHeight - 150, 120, 120);
        return await new Promise((resolve, reject) => {
          common_vendor.index.canvasToTempFilePath({
            canvas,
            success: (res) => resolve(res.tempFilePath),
            fail: reject
          });
        });
      } catch (error) {
        console.error("绘制失败:", error);
        throw error;
      }
    };
    const handleSaveWithPermission = async () => {
      try {
        common_vendor.index.showLoading({
          title: "生成图片中...",
          mask: true
        });
        await checkPhotoPermission();
        const filePath = await startDraw();
        await common_vendor.index.saveImageToPhotosAlbum({
          filePath
        });
        common_vendor.index.showToast({
          title: "保存成功",
          icon: "success"
        });
      } catch (error) {
        console.error("保存失败:", error);
        common_vendor.index.showToast({
          title: error.message || "保存失败",
          icon: "error"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const handleShareMoments = async () => {
      try {
        const filePath = await startDraw();
      } catch (error) {
        console.error("分享失败:", error);
        common_vendor.index.showToast({
          title: "分享失败",
          icon: "error"
        });
      }
    };
    const handleShareQQ = () => {
      common_vendor.index.showToast({
        title: "暂不支持QQ分享",
        icon: "none"
      });
    };
    common_vendor.onMounted(() => {
      const systemInfo = common_vendor.index.getSystemInfoSync();
      canvasStyle.value = `position: fixed; left: -9999rpx; width: ${systemInfo.screenWidth}px; height: ${systemInfo.screenWidth * 1.8}px;`;
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: selectedImage.value,
        b: common_vendor.t(selectedText.value),
        c: common_vendor.t(__props.distance),
        d: getOptionChecked("distance"),
        e: common_vendor.t(__props.duration),
        f: getOptionChecked("duration"),
        g: common_vendor.t(__props.pace),
        h: getOptionChecked("pace"),
        i: common_vendor.t(__props.calories),
        j: getOptionChecked("calories"),
        k: common_vendor.t(__props.poolLength),
        l: getOptionChecked("poolLength"),
        m: common_vendor.t(__props.laps),
        n: getOptionChecked("laps"),
        o: common_vendor.o(toggleEdit),
        p: isEditing.value
      }, isEditing.value ? common_vendor.e({
        q: common_vendor.f(tabs, (tab, index, i0) => {
          return {
            a: common_vendor.t(tab),
            b: index,
            c: currentTab.value === index ? 1 : "",
            d: common_vendor.o(($event) => switchTab(index), index)
          };
        }),
        r: currentTab.value === 0
      }, currentTab.value === 0 ? {
        s: common_vendor.f(dataOptions.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: item.checked ? 1 : "",
            c: index,
            d: common_vendor.o(($event) => toggleDataOption(index), index)
          };
        })
      } : {}, {
        t: currentTab.value === 1
      }, currentTab.value === 1 ? {
        v: common_vendor.f(textOptions.value, (text, index, i0) => {
          return {
            a: common_vendor.t(text.content),
            b: index,
            c: text.selected ? 1 : "",
            d: common_vendor.o(($event) => toggleTextSelection(index), index)
          };
        })
      } : {}, {
        w: currentTab.value === 2
      }, currentTab.value === 2 ? {
        x: common_vendor.o(chooseImage),
        y: common_vendor.f(imageOptions.value, (img, index, i0) => {
          return common_vendor.e({
            a: img.url,
            b: img.selected
          }, img.selected ? {} : {}, {
            c: index,
            d: img.selected ? 1 : "",
            e: common_vendor.o(($event) => selectImage(index), index)
          });
        })
      } : {}, {
        z: currentTab.value === 0
      }, currentTab.value === 0 ? {} : {}) : {}, {
        A: common_vendor.o(handleSaveWithPermission),
        B: common_vendor.o(handleShareMoments),
        C: common_vendor.o(handleShareQQ),
        D: common_vendor.s(canvasStyle.value)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ceb22cc9"], ["__file", "/Users/z/jd-uni-app/pages/share/share.vue"]]);
wx.createPage(MiniProgramPage);
