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
			<button @tap="goPrevious">上一页</button>
			<button @tap="goNext">下一页</button>
		</view>
	</view>

</template>

<script setup>
	import { ref, reactive } from "vue";
	import WeightScale from "@/components/WeightScale.vue";
	const weight = ref(54);
	
	const goPrevious = () => {
		uni.navigateBack()
	}
	const goNext = () => {
		uni.navigateTo({
		  url: "/pages/profileEditHeight/profileEditHeight",
		});
	}
	
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
	margin-top: 40px;
	display: flex;
	gap: 20px;
}

button {
	padding: 10px 20px;
	font-size: 16px;
	border: none;
	border-radius: 4px;
	background-color: #ffc107;
	color: #fff;
	cursor: pointer;
}

button:active {
	background-color: #e0a800;
}

.note {
	margin-top: 20px;
	text-align: center;
	color: #666;
	font-size: 14px;
}
</style>
