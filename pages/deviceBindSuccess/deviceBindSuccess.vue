<template>
	<view class="finding-device-page">
		<view class="device-status">
			<view class="device-image-container">
				<image src="/static/device-bind-success@3x.png" mode="aspectFit" class="status-image" />
			</view>
			<text class="status-text">绑定成功</text>
		</view>
		<view class="action">
		  <button @tap="navigateToProfileEdit" class="find-device-button">
		    填写信息
		  </button>
		</view>
	</view>
</template>

<script setup>
	const navigateToProfileEdit = () => {
		console.log('联系客服')
		uni.navigateTo({
		  url: "/pages/profileEditGender/profileEditGender",
		});
	}
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