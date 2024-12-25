<template>
	<view class="data-center-page">
		<!-- 时间维度切换 -->
		<view class="tabs">
			<text
				v-for="tab in tabs"
				:key="tab.value"
				class="tab-item"
				:class="{ active: activeTab === tab.value }"
				@tap="switchTab(tab.value)"
			>
				{{ tab.label }}
			</text>
		</view>

		<!-- 日视图 -->
		<day-view v-if="activeTab === 'day'" :initial-date="currentDate" />
		<!-- 周视图 -->
		<week-view v-else-if="activeTab === 'week'" :initial-date="currentDate" />
		<!-- 月视图 -->
		<month-view v-else-if="activeTab === 'month'" :initial-date="currentDate" />
		<!-- 年视图 -->
		<year-view v-else-if="activeTab === 'year'" :initial-date="currentDate" />
		<total-view v-else-if="activeTab === 'total'" :initial-date="currentDate" />
		<!-- 无数据展示 -->
		<view class="no-data" v-else>
			<text>该日期暂无游泳记录</text>
		</view>
		<!-- 分享按钮 -->
		<view class="share-btn" @tap="onShare">
			<text>分享</text>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { request } from "@/utils/require";
import { formatDate } from "./components/format.js";
import DayView from "./components/DayView.vue";
import WeekView from "./components/WeekView.vue";
import MonthView from "./components/MonthView.vue";
import YearView from "./components/YearView.vue";
import TotalView from "./components/TotalView.vue";

// Tab配置
const tabs = [
	{
		label: "日",
		value: "day",
	},
	{
		label: "周",
		value: "week",
	},
	{
		label: "月",
		value: "month",
	},
	{
		label: "年",
		value: "year",
	},
	{
		label: "总",
		value: "total",
	},
];

// 响应式数据
const activeTab = ref("day");
const currentDate = ref(formatDate(new Date()));

// 切换tab
const switchTab = (tab) => {
	activeTab.value = tab;
};

// 分享处理
const onShare = () => {
	uni.navigateTo({
		url: "/pages/share/share",
	});
};
</script>

<style lang="scss" scoped>
.data-center-page {
	background-color: #f9f9f9;
	min-height: 100vh;
	padding: 16px;
}

.actions {
	display: flex;
	gap: 10px;
}

.action-btn {
	font-size: 24px;
	color: #999;
}

.tabs {
	display: flex;
	justify-content: space-around;
	margin-bottom: 20px;
}

.tab-item {
	font-size: 16px;
	color: #999;
}

.tab-item.active {
	color: #ffc107;
	font-weight: bold;
}

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
</style>
