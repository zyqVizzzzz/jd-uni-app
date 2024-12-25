<template>
	<view class="week-view">
		<!-- 周日历选择 -->
		<uni-calendar
			:insert="true"
			:selected="weekDays"
			:date="currentDate"
			:showMonth="false"
			@change="onWeekDateChange"
			@monthSwitch="onMonthSwitch"
		/>

		<!-- 周数据汇总 -->
		<view class="data-summary" v-if="weekRecord">
			<view class="row">
				<view class="item">
					<text class="label">总距离</text>
					<text class="value">{{ weekRecord.totalDistance || 0 }}M</text>
				</view>
				<view class="item">
					<text class="label">总训练时长</text>
					<text class="value">{{
						formatDuration(weekRecord.totalDuration)
					}}</text>
				</view>
			</view>
		</view>

		<view class="daily-records" v-if="weekRecord?.dailyRecords?.length">
			<view
				class="data-summary-container"
				v-for="record in weekRecord.dailyRecords"
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
			<text>本周暂无游泳记录</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { request } from "@/utils/require";
import { formatDuration, formatPace, formatDate } from "./format.js";

const props = defineProps({
	initialDate: {
		type: String,
		default: () => formatDate(new Date()),
	},
});

const currentDate = ref(props.initialDate);
const weekRecord = ref(null);
const weekSelected = ref([]);
const weekDays = ref([]); // 存储整周的日期

// 获取一周所有日期
const getWeekDays = (date) => {
	const currentDate = new Date(date);
	const day = currentDate.getDay() || 7; // 将周日从0转换为7
	const monday = new Date(currentDate);
	monday.setDate(currentDate.getDate() - day + 1);

	// 生成整周的日期
	const days = [];
	for (let i = 0; i < 7; i++) {
		const date = new Date(monday);
		date.setDate(monday.getDate() + i);
		days.push({
			date: formatDate(date),
			extra: "week", // 添加标记，用于自定义样式
		});
	}

	return days;
};

// 获取一周的起止日期
const getWeekRange = (date) => {
	const days = getWeekDays(date);
	return {
		start: days[0].date,
		end: days[6].date,
	};
};

// 格式化显示日期
const formatDisplayDate = (date) => {
	const d = new Date(date);
	return `${d.getMonth() + 1}月${d.getDate()}日`;
};

// 获取周数据
const fetchWeekRecord = async (startDate, endDate) => {
	try {
		const res = await request({
			url: "/swimming/week-record",
			method: "GET",
			data: {
				startDate,
				endDate,
			},
		});

		if (res.data?.code === 200) {
			weekRecord.value = res.data.data.totals;
			weekRecord.value.dailyRecords = res.data.data.daily;
		} else {
			weekRecord.value = null;
		}
	} catch (err) {
		console.error("获取周数据失败", err);
		weekRecord.value = null;
	}
};

// 处理周视图日期选择
const onWeekDateChange = (e) => {
	if (!e?.fulldate) return;
	currentDate.value = e.fulldate;

	// 更新整周日期
	weekDays.value = getWeekDays(e.fulldate);

	// 获取周数据
	const weekRange = getWeekRange(e.fulldate);
	fetchWeekRecord(weekRange.start, weekRange.end);
};

// 月份切换处理
const onMonthSwitch = (e) => {
	// 月份切换时可能需要处理的逻辑
};

// 初始化
onMounted(() => {
	const date = currentDate.value;
	weekDays.value = getWeekDays(date);

	const weekRange = getWeekRange(date);
	fetchWeekRecord(weekRange.start, weekRange.end);
});
</script>

<style lang="scss" scoped>
.week-view {
	.data-summary {
		background-color: #fff;
		border-radius: 8px;
		padding: 16px;
		margin-top: 10px;
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
			margin-bottom: 0px;
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
		padding: 40rpx;
		color: #999;
		font-size: 28rpx;
	}
}
</style>
