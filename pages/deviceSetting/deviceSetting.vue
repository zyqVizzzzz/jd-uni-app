<template>
	<view class="device-setting">
		<!-- 设置列表 -->
		<view class="setting-list">
			<!-- 设备状态 -->
			<view class="setting-item" @tap="handleDeviceStatus">
				<text class="item-label">设备状态</text>
				<view class="item-value">
					<text class="value-text">已连接</text>
					<text class="iconfont icon-right"></text>
				</view>
			</view>

			<!-- 泳池长度 -->
			<view class="setting-item" @tap="handlePoolLength">
				<text class="item-label">泳池长度</text>
				<view class="item-value">
					<text class="value-text">25米</text>
					<text class="iconfont icon-right"></text>
				</view>
			</view>

			<!-- 语言 -->
			<view class="setting-item" @tap="handleLanguage">
				<text class="item-label">语言</text>
				<view class="item-value">
					<text class="value-text">中文</text>
					<text class="iconfont icon-right"></text>
				</view>
			</view>

			<!-- 字体 -->
			<view class="setting-item" @tap="handleFont">
				<text class="item-label">字体</text>
				<view class="item-value">
					<text class="value-text">大字体</text>
					<text class="iconfont icon-right"></text>
				</view>
			</view>

			<!-- 距离提醒 -->
			<view class="setting-item">
				<text class="item-label">距离提醒</text>
				<switch
					:checked="distanceAlert"
					@change="handleDistanceAlert"
					color="#FFDA00"
				/>
			</view>

			<!-- 时间提醒 -->
			<view class="setting-item">
				<text class="item-label">时间提醒</text>
				<switch
					:checked="timeAlert"
					@change="handleTimeAlert"
					color="#FFDA00"
				/>
			</view>
		</view>

		<!-- 底部保存按钮 -->
		<view class="save-button" @tap="handleSave"> 保存设置 </view>
	</view>
</template>

<script>
import { ref } from "vue";

export default {
	setup() {
		const distanceAlert = ref(false);
		const timeAlert = ref(false);

		const goBack = () => {
			uni.navigateBack();
		};

		const handleDeviceStatus = () => {
			// 处理设备状态点击
		};

		const handlePoolLength = () => {
			// 处理泳池长度点击
		};

		const handleLanguage = () => {
			// 处理语言点击
		};

		const handleFont = () => {
			// 处理字体点击
		};

		const handleDistanceAlert = (e) => {
			distanceAlert.value = e.detail.value;
		};

		const handleTimeAlert = (e) => {
			timeAlert.value = e.detail.value;
		};

		const handleSave = () => {
			// 处理保存设置
			uni.showToast({
				title: "设置已保存",
				icon: "success",
			});

			uni.switchTab({
				url: "/pages/mine/mine",
			});
		};

		return {
			distanceAlert,
			timeAlert,
			goBack,
			handleDeviceStatus,
			handlePoolLength,
			handleLanguage,
			handleFont,
			handleDistanceAlert,
			handleTimeAlert,
			handleSave,
		};
	},
};
</script>

<style lang="scss" scoped>
.device-setting {
	min-height: 100vh;
	background-color: #f5f5f5;
	padding-bottom: 40rpx;
}

.nav-bar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 32rpx;
	height: 88rpx;
	background-color: #fff;

	.back {
		padding: 20rpx;
	}

	.title {
		font-size: 36rpx;
		font-weight: 500;
	}

	.right-icons {
		display: flex;
		gap: 32rpx;
	}
}

.setting-list {
	margin-top: 20rpx;
	background-color: #fff;

	.setting-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 32rpx;
		border-bottom: 1px solid #f5f5f5;

		switch {
			transform: scale(0.8);
			margin: -6rpx 0;
		}

		.item-label {
			font-size: 32rpx;
			color: #333;
		}

		.item-value {
			display: flex;
			align-items: center;
			gap: 8rpx;

			.value-text {
				font-size: 32rpx;
				color: #999;
			}
		}
	}
}

.save-button {
	position: fixed;
	bottom: 120rpx;
	left: 32rpx;
	right: 32rpx;
	height: 108rpx;
	background-color: #ffda00;
	border-radius: 72rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 32rpx;
	color: #333;
}
</style>
