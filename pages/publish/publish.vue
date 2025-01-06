<template>
	<view class="publish-page">
		<!-- 内容输入区 -->
		<textarea
			v-model="content"
			class="content-input"
			placeholder="分享新鲜事..."
			:maxlength="500"
			auto-height
		/>

		<!-- 图片网格 -->
		<view class="image-grid">
			<view v-for="(image, index) in images" :key="index" class="grid-item">
				<image :src="image" mode="aspectFill" />
			</view>

			<!-- 添加图片按钮，最多9张 -->
			<view
				v-if="images.length < 9"
				class="grid-item add-image"
				@tap="chooseImages"
			>
				<text class="plus">+</text>
			</view>
		</view>

		<!-- 发布按钮 -->
		<view class="publish-footer">
			<button class="publish-btn" :disabled="!isValid" @tap="submitPost">
				<text class="camera-icon">📷</text>
				发布
			</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from "vue";
import { momentApi } from "@/api/moments";
import config from "@/config";

const content = ref("");
const images = ref([]);

// 表单验证
const isValid = computed(() => {
	return content.value.trim() || images.value.length > 0;
});

// 选择图片
const chooseImages = () => {
	uni.chooseImage({
		count: 9 - images.value.length,
		sizeType: ["compressed"],
		sourceType: ["album", "camera"],
		success: (res) => {
			images.value = [...images.value, ...res.tempFilePaths];
		},
		fail: () => {
			uni.showToast({
				title: "选择图片失败",
				icon: "none",
			});
		},
	});
};

// 提交发布
const submitPost = async () => {
	if (!isValid.value) return;

	try {
		uni.showLoading({ title: "发布中..." });

		// 1. 上传图片
		let imageUrls = [];
		if (images.value.length > 0) {
			try {
				const token = uni.getStorageSync("token");
				// 一次只能上传一张图片，所以需要串行上传
				for (const image of images.value) {
					const res = await new Promise((resolve, reject) => {
						uni.uploadFile({
							url: `${config.API_BASE_URL}/moments/upload`,
							filePath: image,
							name: "images",
							header: {
								Authorization: `Bearer ${token}`,
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
							},
						});
					});

					if (res.data.code === 201 && res.data.data?.imageUrls?.[0]) {
						imageUrls.push(res.data.data.imageUrls[0]);
					} else {
						throw new Error("图片上传失败");
					}
				}
			} catch (error) {
				console.error("图片上传失败:", error);
				uni.showToast({
					title: "图片上传失败",
					icon: "none",
				});
				throw error;
			}
		}

		// 2. 发布动态
		const res = await momentApi.createMoment({
			content: content.value.trim(),
			images: imageUrls,
		});

		if (res.data.code === 200) {
			uni.hideLoading();
			uni.showToast({
				title: "发布成功",
				icon: "success",
			});

			// 返回并刷新列表
			setTimeout(() => {
				const pages = getCurrentPages();
				const prevPage = pages[pages.length - 2];
				if (prevPage?.$vm?.onRefresh) {
					prevPage.$vm.onRefresh();
				}
				uni.navigateBack();
			}, 1500);
		} else {
			throw new Error(res.data.message || "发布失败");
		}
	} catch (error) {
		console.error("发布失败:", error);
		uni.hideLoading();
		uni.showToast({
			title: error.message || "发布失败",
			icon: "none",
		});
	}
};
</script>

<style>
.publish-page {
	min-height: 100vh;
	background: #ffffff;
	display: flex;
	flex-direction: column;
}

.nav-bar {
	display: flex;
	align-items: center;
	padding: 0 30rpx;
	height: 88rpx;
	border-bottom: 1rpx solid #f5f5f5;
}

.back {
	font-size: 40rpx;
	width: 60rpx;
}

.title {
	flex: 1;
	text-align: center;
	font-size: 32rpx;
	font-weight: 500;
}

.menu {
	width: 60rpx;
	text-align: right;
}

.content-input {
	width: 100%;
	padding: 30rpx;
	min-height: 200rpx;
	font-size: 28rpx;
	box-sizing: border-box;
}

.image-grid {
	padding: 0 20rpx;
	display: flex;
	flex-wrap: wrap;
}

.grid-item {
	width: 220rpx;
	height: 220rpx;
	margin: 10rpx;
	border-radius: 8rpx;
	overflow: hidden;
}

.grid-item image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.add-image {
	border: 2rpx dashed #ddd;
	display: flex;
	align-items: center;
	justify-content: center;
}

.plus {
	font-size: 60rpx;
	color: #999;
}

.publish-footer {
	margin-top: auto;
	padding: 20rpx 30rpx;
	background: #ffffff;
}

.publish-btn {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	text-align: center;
	background: #ffd100;
	color: #000000;
	font-size: 32rpx;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.camera-icon {
	margin-right: 10rpx;
}

.publish-btn[disabled] {
	opacity: 0.6;
}
</style>
