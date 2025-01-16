<template>
	<view class="rules-page">
		<!-- 规则内容 -->
		<view class="rules-content">
			<view class="title">
				<text>积分规则</text>
			</view>

			<view class="rules-section">
				<view class="rule-item">
					<view class="rule-title">1. 积分获取规则：</view>
					<view class="rule-content">
						<view class="sub-rule"
							>游泳里程积分：用户每游泳100米，即可获得1积分。</view
						>
						<view class="sub-rule"
							>日常动态积分：用户每日首次发布动态，可获得2积分，每日限领一次。</view
						>
						<view class="sub-rule"
							>社交媒体分享积分：用户每日首次将游泳数据分享至社交媒体，可获得3积分，每日限领一次。</view
						>
					</view>
				</view>

				<view class="rule-item">
					<view class="rule-title">2. 积分有效期：</view>
					<view class="rule-content">
						<view class="sub-rule"
							>积分自获得之日起有效期为一年，将于每年12月30日到期并自动清零。</view
						>
					</view>
				</view>

				<view class="rule-item">
					<view class="rule-title">3. 积分使用方式：</view>
					<view class="rule-content">
						<view class="sub-rule"
							>参与抽奖：用户可使用积分参与积分商城不定期举办的抽奖活动。</view
						>
						<view class="sub-rule"
							>兑换商品：用户可使用积分在积分商城兑换各类周边产品。</view
						>
					</view>
				</view>

				<view class="rule-item">
					<view class="rule-title">4. 积分商城其他说明：</view>
					<view class="rule-content">
						<view class="sub-rule">积分商城保留对积分规则的最终解释权。</view>
						<view class="sub-rule"
							>积分商城有权根据实际情况调整积分规则，并将通过官方网站或应用程序提前通知用户。</view
						>
						<view class="sub-rule"
							>用户应遵守积分商城的相关规定，违规行为可能会导致积分的扣除或账户的限制。</view
						>
					</view>
				</view>

				<view class="rule-item">
					<view class="rule-title">5. 积分查询与反馈：</view>
					<view class="rule-content">
						<view class="sub-rule"
							>用户可在积分商城的个人中心查看积分详情。</view
						>
						<view class="sub-rule"
							>如有疑问或需要帮助，用户可通过积分商城的客服渠道进行咨询。</view
						>
					</view>
				</view>
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
.rules-page {
	min-height: 100vh;
	padding-top: 30rpx;
}

.rules-content {
	margin: 0 30rpx 30rpx;
	padding: 58rpx 32rpx 32rpx;
	background: #fff;
	border-radius: 12rpx;

	.title {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		text-align: center;
		margin-bottom: 48rpx;
	}

	.rules-section {
		.rule-item {
			margin-bottom: 40rpx;

			.rule-title {
				font-size: 30rpx;
				font-weight: 500;
				color: #333;
				margin-bottom: 16rpx;
			}

			.rule-content {
				padding-left: 16rpx;

				.sub-rule {
					font-size: 28rpx;
					color: #666;
					line-height: 1.8;
					margin-bottom: 16rpx;

					&:last-child {
						margin-bottom: 0;
					}
				}
			}
		}
	}
}
</style>
