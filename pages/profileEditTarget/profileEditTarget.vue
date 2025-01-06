<template>
	<view class="profile-edit-page">
		<view class="custom-picker">
			<scroll-picker
				style="width: 100%; background-color: transparent"
				:columns="targetColumns"
				title="设定月度目标(M)"
				@change="handleTargetChange"
			/>
		</view>

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
import ScrollPicker from "@/components/ScrollPicker.vue";
import { request } from "@/utils/require";

const goPrevious = () => {
	uni.navigateBack();
};

const goNext = () => {
	const selectedTarget = targetColumns[0].options.find(
		(opt) => opt.value === targetColumns[0].defaultValue
	)?.value;

	updateUserInfo({
		target: parseInt(selectedTarget),
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
				url: "/pages/deviceSetting/deviceSetting",
			});
		}
	} catch (error) {
		uni.showToast({
			title: "更新失败",
			icon: "none",
		});
	}
};

const generateTargetOptions = () => {
	const options = [];
	for (let target = 0; target <= 5000; target += 500) {
		options.push({
			label: target.toString(),
			value: target.toString(),
		});
	}
	return options;
};

const targetColumns = reactive([
	{
		options: generateTargetOptions(),
		defaultValue: "2000", // 默认值设为2000米
	},
]);

const handleTargetChange = (e) => {
	const { values } = e;
	if (values[0]) {
		targetColumns[0].defaultValue = values[0].value;
	}
};
</script>

<style scoped lang="scss">
.custom-picker {
	height: 400px;
	width: 100%;
	display: flex;
	/* align-items: center; */
	border-radius: 8px;
	margin: 20px 0;
}

.profile-edit-page {
	background-color: #fff;
	min-height: 100vh;
	padding: 16px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}

.birthday-selection {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.birthday-picker {
	margin-top: 20px;
}

.birthday-label {
	font-size: 16px;
	margin-bottom: 10px;
	color: #333;
}

.picker {
	width: 200px;
	height: 40px;
	line-height: 40px;
	text-align: center;
	border: 1px solid #ccc;
	border-radius: 4px;
	background-color: #fff;
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
