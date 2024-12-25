<template>
	<view class="year-picker">
		<!-- 年代切换 (如 2020-2029) -->
		<view class="decade-selector">
			<text class="arrow" @tap="changeDecade(-1)">〈</text>
			<text class="decade">{{ decadeStart }}-{{ decadeEnd }}</text>
			<text class="arrow" @tap="changeDecade(1)">〉</text>
		</view>

		<!-- 年份网格 -->
		<view class="years-grid">
			<view
				v-for="year in yearsList"
				:key="year"
				class="year-item"
				:class="{
					active: isCurrentYear(year),
					'has-record': hasRecord(year),
				}"
				@tap="selectYear(year)"
			>
				{{ year }}
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
	// 可选：传入有记录的年份
	recordYears: {
		type: Array,
		default: () => [],
	},
});

const emit = defineEmits(["update:value", "change"]);

// 计算当前十年的开始年份
const decadeStart = computed(() => {
	const year = new Date(props.value).getFullYear();
	return Math.floor(year / 10) * 10;
});

// 计算当前十年的结束年份
const decadeEnd = computed(() => decadeStart.value + 9);

// 生成年份列表
const yearsList = computed(() => {
	const years = [];
	for (let year = decadeStart.value; year <= decadeEnd.value; year++) {
		years.push(year);
	}
	return years;
});

// 切换年代
const changeDecade = (delta) => {
	const newYear = decadeStart.value + delta * 10;
	emit("change", `${newYear}`);
};

// 选择年份
const selectYear = (year) => {
	emit("update:value", `${year}`);
	emit("change", `${year}`);
};

// 判断是否是当前选中的年份
const isCurrentYear = (year) => {
	return year === new Date(props.value).getFullYear();
};

// 判断该年份是否有记录
const hasRecord = (year) => {
	return props.recordYears.includes(year);
};
</script>

<style lang="scss">
.year-picker {
	background-color: #fff;
	border-radius: 8px;
	padding: 16px 0;

	.decade-selector {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20px;

		.decade {
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

	.years-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 12px;
		padding: 0 16px;

		.year-item {
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
