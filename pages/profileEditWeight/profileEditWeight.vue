<template>
	<view class="profile-edit-page">
		<view class="scale-title">您的体重 (KG)</view>
		<weight-scale
			v-model="weight"
			:min="30"
			:max="150"
			:step="1"
			@change="handleWeightChange"
		/>
		<!-- Navigation Buttons -->
		<view class="navigation-buttons">
			<view class="back-btn" @tap="goPrevious">
				<text class="back-arrow">←</text>
			</view>
			<button class="next-btn" @tap="goNext">下一步</button>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive } from "vue";
import WeightScale from "@/components/WeightScale.vue";
import { request } from "@/utils/require";
const weight = ref(54);

const goPrevious = () => {
	uni.navigateBack();
};

const goNext = () => {
	updateUserInfo({
		weight: parseInt(weight.value),
	});
};

// 更新用户信息
const updateUserInfo = async (data) => {
	try {
		const res = await request({
			url: "/users/me",
			method: "POST",
			data,
		});

		if (res.data.code === 201) {
			uni.navigateTo({
				url: "/pages/profileEditHeight/profileEditHeight",
			});
		}
	} catch (error) {
		uni.showToast({
			title: "更新失败",
			icon: "none",
		});
	}
};

const handleWeightChange = (value) => {
	weight.value = value;
	// 可以在这里添加其他处理逻辑
};
</script>

<style lang="scss" scoped>
.profile-edit-page {
	background-color: #fff;
	min-height: 100vh;
	padding: 16px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	.scale-title {
		font-size: 28px;
		font-weight: bold;
		color: #333;
		margin: 60rpx auto 120rpx;
	}
}
.navigation-buttons {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20px 16px;
	padding-bottom: calc(20px + env(safe-area-inset-bottom)); // 适配底部安全区域
	background-color: #fff;

	.back-btn {
		background: #f0f2f5;
		width: 108rpx;
		height: 108rpx;
		border-radius: 108rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

		.back-arrow {
			font-size: 24px;
			color: #333;
		}
	}

	.next-btn {
		background-color: #ffd700;
		color: #000;
		font-size: 18px;
		font-weight: 500;
		width: 252rpx;
		height: 108rpx;
		border-radius: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		border: none;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		margin: 0;

		&::after {
			border: none; // 移除小程序按钮的默认边框
		}

		&:active {
			opacity: 0.8;
		}
	}
}
</style>
