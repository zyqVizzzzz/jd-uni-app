<template>
	<view class="day-view">
		<!-- 日历组件 -->
		<uni-calendar
			:insert="true"
			:selected="selected"
			:date="currentDate"
			:showMonth="false"
			@change="onDateChange"
			@monthSwitch="onMonthSwitch"
		/>

		<!-- 数据展示 -->
		<view class="data-summary" v-if="dayRecord">
			<view class="row">
				<view class="item">
					<text class="label">距离</text>
					<text class="value blue">{{ dayRecord.distance || 0 }}M</text>
				</view>
				<view class="item">
					<text class="label">时间</text>
					<text class="value orange">{{
						formatDuration(dayRecord.duration)
					}}</text>
				</view>
			</view>
			<view class="row">
				<view class="item">
					<text class="label">平均配速</text>
					<text class="value blue">{{
						formatPace(dayRecord.averagePace)
					}}</text>
				</view>
				<view class="item">
					<text class="label">消耗热量</text>
					<text class="value red">{{ dayRecord.calories || 0 }} KCAL</text>
				</view>
			</view>
			<view class="row">
				<view class="item">
					<text class="label">泳池长度</text>
					<text class="value purple">{{ dayRecord.poolLength || 0 }}M</text>
				</view>
				<view class="item">
					<text class="label">趟数</text>
					<text class="value purple">{{ dayRecord.laps || 0 }}</text>
				</view>
			</view>
		</view>

		<!-- 无数据展示 -->
		<view class="no-data" v-else>
			<text>该日期暂无游泳记录</text>
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
const dayRecord = ref(null);
const selected = ref([]);

// 获取月度记录日期
const fetchMonthRecordDates = async (year, month) => {
	try {
		const res = await request({
			url: `/swimming/month-record-dates?year=${year}&month=${month}`,
			method: "GET",
		});

		if (res.data?.code === 200) {
			// 直接使用后端返回的完整日期字符串
			const dates = res.data.data.map((date) => ({
				date: date, // 后端已经返回了 YYYY-MM-DD 格式
			}));
			selected.value = dates;
		} else {
			selected.value = [];
		}
	} catch (err) {
		console.error("获取月度记录失败", err);
		selected.value = [];
	}
};

// 获取指定日期的游泳记录
const fetchDayRecord = async (date) => {
	try {
		const res = await request({
			url: "/swimming/date-record",
			method: "GET", // 明确指定请求方法
			data: {
				date,
			},
		});

		if (res.data?.code === 200) {
			dayRecord.value = res.data.data;
		} else {
			dayRecord.value = null;
			console.warn("获取日期记录失败:", res.data?.message);
		}
	} catch (err) {
		console.error("获取日期记录失败:", err);
		dayRecord.value = null;
	}
};

// 事件处理函数
const onDateChange = (e) => {
	if (!e?.fulldate) return;
	try {
		const date = new Date(e.fulldate);
		if (isNaN(date.getTime())) {
			console.error("Invalid date:", e.fulldate);
			return;
		}
		const formattedDate = formatDate(date);
		currentDate.value = formattedDate;
		fetchDayRecord(formattedDate);
	} catch (err) {
		console.error("日期处理错误:", err);
	}
};

const onMonthSwitch = (e) => {
	if (!e?.year || !e?.month) return;
	try {
		const year = parseInt(e.year);
		const month = parseInt(e.month);
		if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
			console.error("Invalid year or month:", e);
			return;
		}
		fetchMonthRecordDates(year, month);
	} catch (err) {
		console.error("月份切换处理错误:", err);
	}
};

// 初始化
onMounted(() => {
	try {
		const date = new Date(currentDate.value);
		if (isNaN(date.getTime())) {
			console.error("Invalid initial date:", currentDate.value);
			return;
		}
		const year = date.getFullYear();
		const month = date.getMonth() + 1;

		fetchMonthRecordDates(year, month);
		fetchDayRecord(currentDate.value);
	} catch (err) {
		console.error("初始化错误:", err);
	}
});
</script>

<style lang="scss" scoped>
.day-view {
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
	}

	.row:last-child {
		margin-bottom: 0px;
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
	}

	.value.blue {
		color: #00bcd4;
	}

	.value.orange {
		color: #ffc107;
	}

	.value.red {
		color: #ff5252;
	}

	.value.purple {
		color: #9c27b0;
	}

	.share-btn {
		position: fixed;
		bottom: 20px;
		right: 20px;
		width: 60px;
		height: 60px;
		background-color: #ffc107;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		font-weight: bold;
		color: #fff;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
}
</style>
