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
				<image
					class="camera-icon"
					src="/static/icons/camera.png"
					mode="aspectFit"
				></image>
				发布
			</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from "vue";
import { momentApi } from "@/api/moments";
import config from "@/config";
import emitter from "@/utils/eventBus";

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
					console.log(res.code);
					if (res.code === 201) {
						imageUrls.push(res.data.imageUrls[0]);
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
		console.log(imageUrls);
		const res = await momentApi.createMoment({
			content: content.value.trim(),
			images: imageUrls,
		});

		if (res.data.code === 201) {
			uni.hideLoading();
			// 先标记需要刷新
			emitter.emit("updateSwimmerList");
			uni.reLaunch({
				url: "/pages/swimmer/swimmer",
			});
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

<style lang="scss">
.publish-page {
	min-height: 100vh;
	background: #ffffff;
	display: flex;
	flex-direction: column;
}

.content-input {
	width: 100%;
	padding: 80rpx 30rpx;
	min-height: 300rpx;
	font-size: 32rpx;
	box-sizing: border-box;
}

.image-grid {
	padding: 0 20rpx;
	display: flex;
	flex-wrap: wrap;
	gap: 15rpx; // 使用gap来设置统一的间距
}

.grid-item {
	width: calc((100% - 30rpx) / 3); // 减去两个间距(15rpx * 2)后平均分成3份
	height: 0;
	padding-bottom: calc((100% - 30rpx) / 3); // 保持1:1的宽高比
	border-radius: 8rpx;
	overflow: hidden;
	position: relative;
}

.grid-item image {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.add-image {
	border: 2rpx dashed #ddd;
	display: flex;
	align-items: center;
	justify-content: center;

	.plus {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 60rpx;
		color: #999;
	}
}

.publish-footer {
	margin-top: auto;
	padding: 20rpx 30rpx 80rpx;
	background: #ffffff;
}

.publish-btn {
	width: 100%;
	height: 108rpx;
	line-height: 108rpx;
	text-align: center;
	background: #ffd100;
	color: #000000;
	font-size: 32rpx;
	border-radius: 54rpx;
	display: flex;
	align-items: center;
	justify-content: center;

	&::after {
		border: none;
	}
}

.camera-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 16rpx;
	position: relative;
	top: -2rpx;
}

.publish-btn[disabled] {
	opacity: 0.8;
}
</style>
