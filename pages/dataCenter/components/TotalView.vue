<template>
	<view class="total-view">
		<!-- 总计数据汇总 -->
		<view class="data-summary" v-if="totalData?.totals">
			<view class="row">
				<view class="item">
					<text class="label">总距离</text>
					<text class="value">{{ totalData.totals.totalDistance || 0 }}M</text>
				</view>
				<view class="item">
					<text class="label">总训练时长</text>
					<text class="value">
						{{ formatDuration(totalData.totals.totalDuration) }}
					</text>
				</view>
			</view>
		</view>

		<!-- 每日详细数据 -->
		<view v-if="totalData?.dailyRecords?.length" class="records-list">
			<view
				class="data-summary-container"
				v-for="record in totalData.dailyRecords"
				:key="record.date"
			>
				<view class="data-summary-title">{{
					formatDisplayDate(record.date)
				}}</view>
				<view class="data-summary">
					<view class="row">
						<view class="item">
							<text class="label">距离</text>
							<text class="value blue">{{ record.distance || 0 }}M</text>
						</view>
						<view class="item">
							<text class="label">时间</text>
							<text class="value orange">{{
								formatDuration(record.duration)
							}}</text>
						</view>
					</view>
					<view class="row">
						<view class="item">
							<text class="label">平均配速</text>
							<text class="value blue">{{
								formatPace(record.averagePace)
							}}</text>
						</view>
						<view class="item">
							<text class="label">消耗热量</text>
							<text class="value red">{{ record.calories || 0 }} KCAL</text>
						</view>
					</view>
					<view class="row">
						<view class="item">
							<text class="label">泳池长度</text>
							<text class="value purple">{{ record.poolLength || 0 }}M</text>
						</view>
						<view class="item">
							<text class="label">趟数</text>
							<text class="value purple">{{ record.laps || 0 }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 无数据展示 -->
		<view class="no-data" v-else>
			<text>暂无游泳记录</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { request } from "@/utils/require";
import { formatDuration, formatPace } from "./format.js";

const totalData = ref(null);

// 格式化显示日期
const formatDisplayDate = (date) => {
	const d = new Date(date);
	return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
};

// 获取总计数据
const fetchTotalData = async () => {
	try {
		const res = await request({
			url: "/swimming/total-records",
			method: "GET",
		});

		if (res.data?.code === 200) {
			totalData.value = res.data.data;
		}
	} catch (err) {
		console.error("获取总计数据失败:", err);
		totalData.value = null;
	}
};


// 初始化
onMounted(() => {
	fetchTotalData();
});
</script>

<style lang="scss">
.total-view {
	.data-summary {
		background-color: #fff;
		border-radius: 8px;
		padding: 16px;
		margin-top: 20px;
	}

	.data-summary-container {
		margin-top: 10px;

		.data-summary {
			margin-top: 10px;
		}

		.data-summary-title {
			padding-left: 15px;
			color: #606266;
		}
	}

	.row {
		display: flex;
		justify-content: space-between;
		margin-bottom: 15px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.item {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.row .item:last-child {
		padding-left: 30px;
	}

	.label {
		font-size: 16px;
		color: #333;
		margin-bottom: 4px;
	}

	.value {
		font-size: 24px;
		font-weight: bold;

		&.blue {
			color: #00bcd4;
		}

		&.orange {
			color: #ffc107;
		}

		&.red {
			color: #ff5252;
		}

		&.purple {
			color: #9c27b0;
		}
	}

	.no-data {
		text-align: center;
		color: #999;
		padding: 20px 0;
	}
}
</style>
