<template>
	<view class="support-page">
		<view class="qr-section">
			<image class="qr-code" src="/static/qr-code.jpg" mode="aspectFit" />
		</view>

		<view class="support-info">
			<text class="text">扫码添加人工客服</text>
			<text class="text">客服在线时间9:00-18:00</text>
		</view>
	</view>
</template>

<script setup>
	const goBack = () => {
		uni.navigateBack();
	};
</script>

<style scoped>
	.support-page {
		background-color: #f9f9f9;
		min-height: 100vh;
		padding: 16px;
	}

	.qr-section {
		display: flex;
		justify-content: center;
		margin: 40px 0;
	}

	.qr-code {
		width: 200px;
		height: 200px;
		border: 8px solid #FFDA00;
		border-radius: 16px;
	}

	.support-info {
		text-align: center;
		margin-top: 20px;
	}

	.text {
		display: block;
		font-size: 16px;
		color: #333;
		line-height: 1.5;
	}
	.text:first-child{
		color: #333333;
		font-size: 18px;
		margin-bottom: 10px;
	}
</style>