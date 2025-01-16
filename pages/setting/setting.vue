<template>
	<view class="settings-page">
		<view class="section" @tap="navigateToProfile">
			<view class="list-item profile">
				<text class="label">编辑个人资料</text>
				<image
					:src="userInfo.avatarUrl || '/static/avatar.png'"
					class="avatar"
					mode="aspectFill"
				/>
			</view>
		</view>

		<view class="section">
			<view class="list-item" @tap="navigateToAbout">
				<text class="label">关于我们</text>
			</view>
			<view class="list-item">
				<text class="label">版本号</text>
				<text class="value">v1.0.0</text>
			</view>
		</view>

		<view class="section">
			<view class="list-item delete-account">
				<text class="label">账户注销</text>
			</view>
		</view>

		<view class="logout">
			<button class="logout-button">退出登录</button>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { onShow } from "@dcloudio/uni-app";

const userInfo = ref({});

onMounted(() => {
	const localUserInfo = uni.getStorageSync("userInfo");
	if (localUserInfo) {
		try {
			userInfo.value = JSON.parse(localUserInfo);
		} catch (e) {
			console.error("解析本地用户信息失败:", e);
		}
	}
});

onShow(() => {
	const localUserInfo = uni.getStorageSync("userInfo");
	if (localUserInfo) {
		try {
			userInfo.value = JSON.parse(localUserInfo);
		} catch (e) {
			console.error("解析本地用户信息失败:", e);
		}
	}
});

const navigateToProfile = () => {
	uni.navigateTo({
		url: "/pages/profile/profile",
	});
};

const navigateToAbout = () => {
	uni.navigateTo({
		url: "/pages/about/about",
	});
};
</script>

<style lang="scss">
.settings-page {
	background-color: #f9f9f9;
	min-height: 100vh;
	padding-top: 1px;

	.section {
		background-color: #fff;
		margin-top: 20rpx;
		border-radius: 8px;
		overflow: hidden;
	}

	.section.profile {
		margin-top: 19rpx;
	}

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 40rpx 30rpx;
		border-bottom: 1px solid #eee;
	}

	.list-item.profile {
		padding: 40rpx 30rpx;
	}

	.list-item:last-child {
		border-bottom: none;
	}

	.label {
		font-size: 32rpx;
		color: #333;
	}

	.value-container {
		display: flex;
		align-items: center;
	}

	.value {
		font-size: 32rpx;
		color: #999;
		margin-right: 10rpx;
	}

	.arrow {
		font-size: 32rpx;
		color: #ccc;
	}

	.delete-account {
		text-align: center;

		.label {
			color: #ff4d4f;
		}
	}

	.logout {
		margin-top: 30rpx;
		text-align: center;
	}

	.logout-button {
		background-color: #fff;
		color: rgba(24, 25, 29, 1);
		padding: 20rpx 20rpx;
		border-radius: 5px;
		font-size: 32rpx;
		margin: 60rpx 30rpx;
	}

	button::after {
		border: none;
	}
}
</style>
