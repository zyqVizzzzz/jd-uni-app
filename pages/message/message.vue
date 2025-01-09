# /pages/message/index.vue
<template>
	<view class="message-center">
		<view class="message-list">
			<!-- 用户消息 -->
			<view
				class="message-item"
				v-for="(item, index) in messageList"
				:key="index"
			>
				<!-- 用户头像消息 -->
				<template v-if="item.type === 'user'">
					<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
				</template>
				<!-- 系统消息 -->
				<template v-else>
					<view class="icon-wrapper" :class="item.iconType">
						<text class="iconfont" :class="item.icon"></text>
					</view>
				</template>

				<view class="message-content">
					<view class="message-title">{{ item.title }}</view>
					<view class="message-text">{{ item.content }}</view>
					<view class="message-time">{{ item.time }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref } from "vue";

const messageList = ref([
	{
		type: "activity",
		icon: "icon-email",
		iconType: "email",
		title: "Test",
		content: "test",
		time: "01-08 10:26",
	},
]);
</script>

<style lang="scss" scoped>
.message-center {
	min-height: 100vh;
	background: #fff;
}

.message-list {
	padding: 0 30rpx;

	.message-item {
		display: flex;
		align-items: flex-start;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #f5f5f5;

		.avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}

		.icon-wrapper {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			margin-right: 20rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 40rpx;

			&.bell {
				color: #ffd100;
				.iconfont {
					&::before {
						content: "\e601";
					}
				}
			}

			&.email {
				color: #ffd100;
				.iconfont {
					&::before {
						content: "\e602";
					}
				}
			}
		}

		.message-content {
			flex: 1;

			.message-title {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 8rpx;
			}

			.message-text {
				font-size: 26rpx;
				color: #999;
				margin-bottom: 8rpx;
			}

			.message-time {
				font-size: 24rpx;
				color: #999;
			}
		}
	}
}
</style>
