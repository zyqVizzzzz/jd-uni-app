<template>
	<view class="about-page">
		<!-- 页面内容 -->
		<view class="about-content">
			<!-- 标题区域 -->
			<view class="title-section">
				<view class="highlight-title"> 关于焦动 </view>
			</view>

			<!-- 介绍文本 -->
			<view class="intro-text">
				Jazz
				Dawn焦动是一个年轻且充满活力的运动品牌，拥有多名电子产业研发超20年工程师，具备专业的声学技术团队，是国内专业从事骨传导技术研发团队之一。创始人吴海东先生本身也是游泳爱好者，喜欢各项运动。因此创立焦动品牌，蕴意聚焦于动，品牌聚焦在运动产品的研发上，不断坚持产品创新和迭代，用科技改变人们的运动体验，享受运动乐趣，提升运动表现，让更多的人参与到运动中。
			</view>
		</view>
		<!-- 奖项展示 -->
		<view class="awards-section">
			<image
				src="/static/about-us.png"
				mode="widthFix"
				class="awards-image"
			></image>
		</view>
	</view>
</template>

<script setup>
const handleBack = () => {
	uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.about-page {
	min-height: 100vh;
	background-color: #f4f8fb;
	padding-top: 40rpx;
}

.about-content {
	padding: 68rpx 32rpx 32rpx;
	margin: 0 40rpx;
	border-radius: 16rpx;
	background-color: #fff;

	.title-section {
		display: flex;
		justify-content: center;
		margin-bottom: 48rpx;

		.highlight-title {
			font-size: 36rpx;
			font-weight: bold;
			color: #333;
			position: relative;
			display: inline-block;

			&::after {
				content: "";
				position: absolute;
				left: -8rpx;
				right: -8rpx;
				bottom: 4rpx;
				height: 20rpx;
				background-color: rgba(255, 218, 0, 0.4);
				z-index: 1;
			}
		}
	}

	.intro-text {
		font-size: 30rpx;
		color: #333;
		line-height: 1.8;
		text-align: justify;
		margin-bottom: 60rpx;
	}
}
.awards-section {
	border: 2rpx dashed #eee;
	border-radius: 24rpx;
	// padding: 40rpx;
	margin: 30rpx 40rpx;

	.awards-image {
		width: 100%;
		display: block;
	}
}
</style>
