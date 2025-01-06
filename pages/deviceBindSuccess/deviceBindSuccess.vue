<template>
	<view class="finding-device-page">
		<view class="device-status">
			<view class="device-image-container">
				<image
					src="/static/device-bind-success@3x.png"
					mode="aspectFit"
					class="status-image"
				/>
			</view>
			<text class="status-text">绑定成功</text>
		</view>
		<view class="action">
			<button @tap="navigateToNextPage" class="find-device-button">
				填写信息
			</button>
		</view>
	</view>
</template>

<script setup>
import { onMounted } from "vue";
import { request } from "@/utils/require";

// 获取用户信息并检查缺失字段
const checkUserInfo = async () => {
	try {
		const res = await request({
			url: "/users/me",
		});

		if (res.data.code === 200) {
			const userData = res.data.data;

			// 检查需要填写的字段
			const fieldsToCheck = [
				{ key: "gender", page: "/pages/profileEditGender/profileEditGender" },
				{ key: "birthday", page: "/pages/profileEditBirth/profileEditBirth" },
				{ key: "height", page: "/pages/profileEditHeight/profileEditHeight" },
				{ key: "weight", page: "/pages/profileEditWeight/profileEditWeight" },
				{
					key: "target",
					page: "/pages/profileEditTarget/profileEditTarget",
				},
			];

			// 检查是否所有字段都已填写
			const allFieldsFilled = fieldsToCheck.every(
				(field) =>
					userData[field.key] &&
					userData[field.key] !== "" &&
					userData[field.key] !== 0
			);

			console.log(allFieldsFilled);

			if (allFieldsFilled) {
				return "/pages/deviceSetting/deviceSetting";
			}

			// 找到第一个未填写的字段
			const firstMissingField = fieldsToCheck.find(
				(field) =>
					!userData[field.key] ||
					userData[field.key] === "" ||
					userData[field.key] === 0
			);

			// 存储用户信息
			uni.setStorageSync("userInfo", JSON.stringify(userData));

			return firstMissingField.page;
		}
	} catch (error) {
		console.error("获取用户信息失败:", error);
		// 如果获取失败，默认从性别页面开始
		return "/pages/profileEditGender/profileEditGender";
	}
};

const navigateToNextPage = async () => {
	const nextPage = await checkUserInfo();
	uni.navigateTo({
		url: nextPage,
	});
};

onMounted(() => {
	// 页面加载时预先获取用户信息
	checkUserInfo();
});
</script>

<style lang="scss">
.finding-device-page {
	background-color: #ffffff;
	min-height: 100vh;
	padding: 15px;
	box-sizing: border-box;

	.device-status {
		padding-top: 120rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		margin-bottom: 240px;
	}

	.device-image-container {
		width: 400rpx;
		height: 400rpx;
		border-radius: 16px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20px;
	}

	.status-image {
		width: 400rpx;
		height: 400rpx;
	}

	.status-text {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 10px;
	}

	.action {
		margin-top: 30px;
		text-align: center;
	}

	.find-device-button {
		background-color: #ffcc00;
		color: #000;
		padding: 20rpx 20px;
		border: none;
		border-radius: 108rpx;
		font-size: 32rpx;
		margin-top: 100rpx;
	}
	button::after {
		border: none;
	}
}
</style>
