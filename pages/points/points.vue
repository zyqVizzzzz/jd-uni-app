# /pages/points/index.vue
<template>
	<view class="points-center">
		<!-- 积分展示区域 -->
		<view class="points-display">
			<view class="points-tab">
				<text class="active" @tap="navigateToDetails">积分明细</text>
			</view>
			<view class="points-number">
				<text>{{ points }}</text>
			</view>
			<text class="points-label">我的积分</text>
		</view>

		<!-- 每日任务区域 -->
		<view class="daily-tasks">
			<view class="section-title">每日任务</view>
			<view class="task-list">
				<view v-for="task in tasks" :key="task.id" class="task-item">
					<view class="task-icon" :class="task.iconClass">
						<image :src="task.icon" mode="aspectFit" class="icon-image" />
					</view>
					<view class="task-info">
						<view class="task-name">{{ task.name }}</view>
						<view class="task-points">
							<image
								src="/static/icons/points.png"
								class="points-icon"
								mode="aspectFit"
							></image>
							<text>{{ task.points }}积分</text>
						</view>
					</view>
					<button
						class="task-button"
						:class="{ completed: task.completed }"
						@tap="handleTask(task)"
					>
						{{ task.completed ? "已完成" : "去完成" }}
					</button>
				</view>
			</view>
		</view>

		<!-- 积分兑换区域 -->
		<view class="exchange-section">
			<view class="exchange-grid">
				<view
					v-for="item in exchangeItems"
					:key="item.id"
					class="exchange-item"
				>
					<image :src="item.image" mode="aspectFill" />
					<text class="item-name">{{ item.name }}</text>
					<view class="item-bottom">
						<view class="item-points">
							<image
								src="/static/icons/points.png"
								class="points-icon"
								mode="aspectFit"
							></image>
							<text>{{ item.points }}</text>
						</view>
						<button
							class="exchange-button"
							:class="{ disabled: points < item.points }"
							@tap="handleExchange(item)"
						>
							{{ points >= item.points ? "立即兑换" : "积分不足" }}
						</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { pointApi } from "@/api/points";

const points = ref(0);
const tasks = ref([
	{
		id: 1,
		name: "游泳距离达到500米",
		points: 50,
		completed: true,
		icon: "/static/icons/points-swim-500.png",
		iconClass: "blue",
	},
	{
		id: 2,
		name: "游泳距离达到1000米",
		points: 100,
		completed: false,
		icon: "/static/icons/points-swim-1000.png",
		iconClass: "yellow",
	},
	{
		id: 3,
		name: "发布动态",
		points: 20,
		completed: false,
		icon: "/static/icons/points-post.png",
		iconClass: "pink",
	},
	{
		id: 4,
		name: "分享游泳数据",
		points: 30,
		completed: false,
		icon: "/static/icons/points-share.png",
		iconClass: "purple",
	},
]);

const exchangeItems = ref([
	{
		id: 1,
		name: "焦动XXXXXX",
		points: 5000,
		image: "/static/avatar.jpg",
	},
	{
		id: 2,
		name: "焦动XXXXXX",
		points: 2000,
		image: "/static/avatar2.jpg",
	},
]);

// 获取每日任务状态
const fetchDailyTasks = async () => {
	try {
		const res = await pointApi.getDailyTasks();
		if (res.data.code === 200) {
			// 更新任务状态
			tasks.value = tasks.value.map((task) => {
				const taskStatus = res.data.data.find((item) => {
					switch (task.id) {
						case 1:
							return item.type === "SWIM_500M";
						case 2:
							return item.type === "SWIM_1000M";
						case 3:
							return item.type === "POST_STATUS";
						case 4:
							return item.type === "SHARE_DATA";
						default:
							return false;
					}
				});
				return {
					...task,
					completed: taskStatus ? taskStatus.completed : false,
				};
			});
		}
	} catch (error) {
		uni.showToast({
			title: "获取任务状态失败",
			icon: "none",
		});
	}
};

const fetchPoints = async () => {
	try {
		const res = await pointApi.getUserPoints();
		if (res.data.code === 200) {
			// 更新任务状态
			points.value = res.data.data.totalPoints;
		}
	} catch (error) {}
};

// 页面加载时获取任务状态
onMounted(() => {
	fetchDailyTasks();
	fetchPoints();
});

const navigateToDetails = () => {
	uni.navigateTo({ url: "/pages/points/details?points=" + points.value });
};

// 处理任务点击
const handleTask = async (task) => {
	if (task.completed) return;

	// 根据任务类型跳转到对应页面
	switch (task.id) {
		case 1:
		case 2:
			uni.navigateTo({ url: "/pages/swimming/index" });
			break;
		case 3:
			uni.navigateTo({ url: "/pages/post/create" });
			break;
		case 4:
			uni.navigateTo({ url: "/pages/share/index" });
			break;
	}
};

// 处理兑换
const handleExchange = async (item) => {
	if (points.value < item.points) {
		uni.showToast({
			title: "积分不足",
			icon: "none",
		});
		return;
	}

	try {
		const res = await request({
			url: "/points/exchange",
			method: "POST",
			data: {
				itemId: item.id,
			},
		});

		if (res.statusCode === 200) {
			uni.showToast({
				title: "兑换成功",
				icon: "success",
			});
			// 更新积分
			points.value -= item.points;
		}
	} catch (error) {
		uni.showToast({
			title: "兑换失败",
			icon: "error",
		});
	}
};
</script>

<style lang="scss" scoped>
.points-center {
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

.section-title {
	font-size: 32rpx;
	font-weight: 500;
	width: 100%;
	text-align: center;
	margin: 30rpx auto 10rpx;
}

.daily-tasks {
	background: #fff;
	margin: 20rpx 32rpx 30rpx;
	padding-top: 10rpx;
	border-radius: 16rpx;

	.task-list {
		.task-item {
			display: flex;
			align-items: center;
			padding: 30rpx;
			border-bottom: 1rpx solid #f5f5f5;

			.task-icon {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 20rpx;
				font-size: 40rpx;
			}

			.task-info {
				flex: 1;

				.task-name {
					font-size: 28rpx;
					margin-bottom: 10rpx;
				}

				.task-points {
					font-size: 24rpx;
					color: #ffa600;
					display: flex;
					align-items: center;
					height: 32rpx;
				}

				.points-icon {
					width: 32rpx;
					height: 32rpx;
					margin-right: 12rpx;
				}
			}

			.task-button {
				padding: 10rpx 30rpx;
				font-size: 24rpx;
				color: #222;
				background: #ffd100;
				border-radius: 16rpx;
				border: none;

				&.completed {
					background: #ccc;
					color: rgba(144, 147, 153, 1);
				}
				&::after {
					border: none;
				}
			}
		}
	}
}

.exchange-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 20rpx;
	padding: 0 20rpx 30rpx;

	.exchange-item {
		background: #fff;
		border-radius: 20rpx;
		overflow: hidden;
		display: flex;
		flex-direction: column;

		image {
			width: 100%;
			height: 300rpx;
		}

		.item-name {
			font-size: 28rpx;
			padding: 20rpx;
		}
		.item-bottom {
			padding: 0 20rpx 20rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.item-points {
			display: flex;
			align-items: center;
			color: #ffa600;
			font-size: 24rpx;

			.points-icon {
				width: 32rpx;
				height: 32rpx;
				margin-right: 8rpx;
			}
		}

		.exchange-button {
			width: auto; // 移除宽度限制
			min-width: 140rpx; // 设置最小宽度
			margin: 0; // 移除原有边距
			padding: 6rpx 22rpx;
			font-size: 24rpx;
			color: #222;
			background: #ffd100;
			border-radius: 26rpx;
			border: none;

			&.disabled {
				background: #ccc;
				color: #fff;
			}

			&::after {
				border: none;
			}
		}
	}
}
</style>
