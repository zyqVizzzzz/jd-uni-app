<template>
	<view class="agreement-page">
		<!-- 协议内容 -->
		<view class="agreement-content">
			<view class="title">
				<text>协议名称</text>
			</view>
			<view class="content">
				<text class="text">
					协议内容XXXXXX用户分享内容到社交媒体或好友，不应该是一种粗暴的强制行为，我们应该在保证产品本身内容有吸引力的核心前提下，仔细揣摩用户心理，结合产品本身的特色，在不同情境下提供给用户最合适的分享平台及方式，让用户分享成为一种水到渠成的自然行为，甚至在某些时候还能给用户带来一些小的惊喜就更棒了。
					分享时机，在不同的时机分析用户是否有分享的意愿，提供给他们合适的分享内容，能让分享的效果更好。
					为了借助社交产品的流量，让用户主动分享APP中的内容到社交平台来达到拉新和促活的目的，市场上绝大多数APP都有第三方分享的功能，它是内容分发的最有效途径，并且大大降低了企业的营销成本。
					用户主动点击分享
					绝大多数APP都是在详情页等需要分享的页面放置一个分享按钮，由用户自行选择分享。这种情况下用户是否分享主要是取决于产品内容本身，比如内容有趣或是有用。在一些APP中设计者会对这个分享按钮加一些鼓励的文案或着重的设计来促进用户分享。
					现在很多APP在用户截图时会自动提示用户是否要进行分享。这个时机确实...
				</text>
			</view>
		</view>
	</view>
</template>

<script setup>
const handleBack = () => {
	uni.navigateBack();
};
</script>

<style lang="scss" scoped>
.agreement-page {
	background-color: #fff;
	min-height: 100vh;
}

.agreement-content {
	padding: 108rpx 32rpx 32rpx;

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
		margin-bottom: 48rpx;
	}

	.content {
		.text {
			font-size: 28rpx;
			color: #333;
			line-height: 1.8;
			text-align: justify;

			// 设置段落间距
			display: block;
			margin-bottom: 24rpx;

			// 设置段落首行缩进
			text-indent: 2em;
		}
	}
}
</style>
