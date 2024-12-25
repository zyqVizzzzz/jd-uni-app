// components/MonthPicker.vue
<template>
	<view class="month-picker">
		<!-- 年份切换 -->
		<view class="year-selector">
			<text class="arrow" @tap="changeYear(-1)">〈</text>
			<text class="year">{{ currentYear }}年</text>
			<text class="arrow" @tap="changeYear(1)">〉</text>
		</view>

		<!-- 月份网格 -->
		<view class="months-grid">
			<view
				v-for="month in 12"
				:key="month"
				class="month-item"
				:class="{
					active: isCurrentMonth(month),
					'has-record': hasRecord(month),
				}"
				@tap="selectMonth(month)"
			>
				{{ month }}月
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
	value: {
		type: String,
		required: true,
	},
	// 可选：传入有记录的月份
	recordMonths: {
		type: Array,
		default: () => [],
	},
});

const emit = defineEmits(["update:value", "change"]);

// 当前选中的年份
const currentYear = ref(new Date(props.value).getFullYear());
// 当前选中的月份
const currentMonth = computed(() => new Date(props.value).getMonth() + 1);

// 切换年份
const changeYear = (delta) => {
	currentYear.value += delta;
	// 如果月份没变，也触发一次更新以获取新的年份数据
	emit(
		"change",
		`${currentYear.value}-${String(currentMonth.value).padStart(2, "0")}`
	);
};

// 选择月份
const selectMonth = (month) => {
	const dateStr = `${currentYear.value}-${String(month).padStart(2, "0")}`;
	emit("update:value", dateStr);
	emit("change", dateStr);
};

// 判断是否是当前选中的月份
const isCurrentMonth = (month) => {
	return month === currentMonth.value;
};

// 判断该月份是否有记录
const hasRecord = (month) => {
	return props.recordMonths.includes(month);
};
</script>

<style lang="scss">
.month-picker {
	background-color: #fff;
	border-radius: 8px;
	padding: 16px 0;

	.year-selector {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20px;

		.year {
			font-size: 18px;
			font-weight: bold;
			margin: 0 20px;
		}

		.arrow {
			padding: 8px 16px;
			color: #666;
			font-size: 16px;

			&:active {
				opacity: 0.7;
			}
		}
	}

	.months-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;

		.month-item {
			text-align: center;
			padding: 12px;
			border-radius: 6px;
			background-color: #f5f5f5;
			font-size: 16px;
			color: #333;

			&.active {
				background-color: #ffb800;
				color: #fff;
			}

			&.has-record::after {
				content: "";
				display: block;
				width: 4px;
				height: 4px;
				background-color: #ffb800;
				border-radius: 50%;
				margin: 2px auto 0;
			}

			&.active.has-record::after {
				background-color: #fff;
			}

			&:active {
				opacity: 0.8;
			}
		}
	}
}
</style>
