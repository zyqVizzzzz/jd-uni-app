<template>
	<view class="year-view">
		<!-- 年份选择器 -->
		<year-picker
			v-model:value="currentDate"
			:record-years="recordYears"
			@change="onYearChange"
		/>

		<!-- 总计数据汇总 -->
		<view class="data-summary" v-if="yearData?.totals">
			<view class="row">
				<view class="item">
					<text class="label">年度总距离</text>
					<text class="value">{{ yearData.totals.totalDistance || 0 }}M</text>
				</view>
				<view class="item">
					<text class="label">年度训练时长</text>
					<text class="value">
						{{ formatDuration(yearData.totals.totalDuration) }}
					</text>
				</view>
			</view>
		</view>

		<!-- 每月详细数据 -->
		<view v-if="yearData?.monthlyRecords?.length" class="records-list">
			<view
				class="data-summary-container"
				v-for="record in yearData.monthlyRecords"
				:key="record.month"
			>
				<view class="data-summary-title">{{
					formatDisplayMonth(record.month)
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
							<text class="label">训练次数</text>
							<text class="value purple"
								>{{ record.trainingCount || 0 }}次</text
							>
						</view>
						<view class="item">
							<text class="label">总趟数</text>
							<text class="value purple">{{ record.totalLaps || 0 }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 无数据展示 -->
		<view class="no-data" v-else>
			<text>本年度暂无游泳记录</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { request } from "@/utils/require";
import { formatDuration, formatPace, formatDate } from "./format.js";
import YearPicker from "./YearPicker.vue";

const props = defineProps({
	initialDate: {
		type: String,
		default: () => formatDate(new Date()).slice(0, 4), // 只取年份部分
	},
});

const currentDate = ref(props.initialDate);
const yearData = ref(null);

// 从 yearData 中计算出有记录的年份
const recordYears = computed(() => {
	if (!yearData.value?.monthlyRecords?.length) return [];
	return [
		...new Set(
			yearData.value.monthlyRecords.map((record) =>
				new Date(record.month).getFullYear()
			)
		),
	];
});

// 格式化显示月份
const formatDisplayMonth = (month) => {
	const d = new Date(month);
	return `${d.getFullYear()}年${d.getMonth() + 1}月`;
};

// 获取年度数据
const fetchYearData = async (year) => {
	try {
		const res = await request({
			url: "/swimming/year-records",
			method: "GET",
			data: { year },
		});

		if (res.data?.code === 200) {
			yearData.value = res.data.data;
		}
	} catch (err) {
		console.error("获取年度数据失败:", err);
		yearData.value = null;
	}
};

// 年份切换处理
const onYearChange = (date) => {
	if (!date) return;
	currentDate.value = date;
	fetchYearData(new Date(date).getFullYear());
};

// 初始化
onMounted(() => {
	fetchYearData(new Date(currentDate.value).getFullYear());
});
</script>

<style lang="scss">
.year-view {
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
