# /pages/points/detail.vue
<template>
	<view class="points-detail">
		<view class="points-display">
			<view class="points-tab">
				<text class="active">积分规则</text>
			</view>
			<view class="points-number">
				<text>2899</text>
			</view>
			<text class="points-label">我的积分</text>
		</view>

		<!-- 积分明细列表 -->
		<view class="detail-list">
			<view
				v-for="(item, index) in pointsList"
				:key="index"
				class="detail-item"
			>
				<view class="item-info">
					<text class="item-title">{{ item.title }}</text>
					<text class="item-time">{{ item.time }}</text>
				</view>
				<text class="item-points plus">+{{ item.points }}</text>
			</view>
			<view class="no-more">没有更多啦</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from "vue";

const pointsList = ref([
	{
		title: "游泳距离达到500米",
		time: "2023.07.11 20:55:45",
		points: 40,
	},
	{
		title: "游泳距离达到500米",
		time: "2023.07.11 20:55:45",
		points: 40,
	},
	{
		title: "游泳距离达到500米",
		time: "2023.07.11 20:55:45",
		points: 40,
	},
]);
</script>

<style lang="scss" scoped>
.points-detail {
	min-height: 100vh;
	background: #f5f7fa;
}

.points-display {
	padding: 30rpx;
	text-align: center;
	position: relative;

	.points-tab {
		margin-bottom: 30rpx;
		position: absolute;
		left: 0;
		top: 50rpx;

		.active {
			font-size: 28rpx;
			color: #fff;
			padding: 12rpx 30rpx 12rpx 20rpx;
			background: #606266;
			border-radius: 0 30rpx 30rpx 0;
		}
	}

	.points-number {
		font-size: 80rpx;
		font-weight: bold;
		margin: 20rpx 0 0;
	}

	.points-label {
		font-size: 28rpx;
		color: #666;
	}
}

.detail-list {
	background: #fff;
	margin: 20rpx 30rpx;
	padding: 0 30rpx;

	.detail-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #f5f5f5;

		.item-info {
			.item-title {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 10rpx;
				display: block;
			}

			.item-time {
				font-size: 24rpx;
				color: #999;
			}
		}

		.item-points {
			font-size: 32rpx;
			font-weight: 500;

			&.plus {
				color: #ffa600;
			}
		}
	}
}

.no-more {
	text-align: center;
	color: #999;
	font-size: 24rpx;
	padding: 30rpx 0;
}
</style>
