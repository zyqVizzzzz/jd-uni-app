<template>
	<view class="scroll-picker">
		<view class="picker-title" v-if="title">{{ title }}</view>
		<view class="picker-columns">
			<picker-view
				:value="currentIndex"
				:indicator-style="indicatorStyle"
				@change="onChange"
				class="picker-view"
			>
				<picker-view-column
					v-for="(column, columnIndex) in columns"
					:key="columnIndex"
				>
					<view
						class="picker-item"
						v-for="(item, index) in column.options"
						:key="index"
					>
						{{ item.label }}
					</view>
				</picker-view-column>
			</picker-view>
			<!-- 选中框 -->
			<view class="picker-mask">
				<view class="picker-indicator"></view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const props = defineProps({
	columns: {
		type: Array,
		required: true,
	},
	title: {
		type: String,
		default: "",
	},
	itemHeight: {
		type: Number,
		default: 66,
	},
	itemSpacing: {
		type: Number,
		default: 24, // 新增：项目间距
	},
});

const emit = defineEmits(["change"]);
// 当前选中的索引数组
const currentIndex = ref([]);

onMounted(() => {
	currentIndex.value = props.columns.map((column) => {
		const defaultValue = column.defaultValue;
		const index = column.options.findIndex(
			(item) => item.value === defaultValue
		);
		return Math.max(0, index);
	});
});

// 选中框样式
const indicatorStyle = computed(() => {
	return `height: ${props.itemHeight}px;`;
});

// 处理选择变化
const onChange = (e) => {
	console.log(e);
	const values = e.detail.value;
	currentIndex.value = values;

	// 构建返回数据
	const selectedValues = values.map((index, columnIndex) => {
		return props.columns[columnIndex].options[index];
	});

	console.log(selectedValues);

	emit("change", {
		values: selectedValues,
		indexes: values,
		columnIndex: values.findIndex(
			(val, idx) => val !== currentIndex.value[idx]
		),
	});
};
</script>

<style lang="scss">
.scroll-picker {
	width: 100%;
	height: 100%;
	background-color: transparent;

	.picker-title {
		text-align: center;
		font-size: 28px;
		font-weight: bold;
		margin-bottom: 20px;
		color: #333;
	}

	.picker-columns {
		position: relative;
		height: 100%; // 显示6个选项
		overflow: hidden;
	}

	.picker-view {
		width: 100%;
		height: 100%;
	}

	.picker-item {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 66px;
		font-size: 43px;
		color: #333;

		&.selected {
			color: #000;
			font-weight: bold;
		}
	}

	.picker-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			180deg,
			rgba(255, 255, 255, 0.95) 0%,
			rgba(255, 255, 255, 0.6) 15%,
			rgba(255, 255, 255, 0) 30%,
			rgba(255, 255, 255, 0) 70%,
			rgba(255, 255, 255, 0.6) 85%,
			rgba(255, 255, 255, 0.95) 100%
		);
		pointer-events: none;
	}

	.picker-indicator {
		position: absolute;
		left: 32rpx;
		right: 32rpx;
		top: 50%;
		transform: translateY(-50%);
		height: 132rpx; // 与 picker-item 高度一致
		// border-top: 2rpx solid #ffda00;
		// border-bottom: 2rpx solid #ffda00;
		pointer-events: none;

		// 添加内边距，让选中框不要紧贴文字
		&::before,
		&::after {
			border: none;
			content: "";
			position: absolute;
			left: 0;
			right: 0;
			height: 12rpx; // 上下内边距
		}

		&::before {
			top: 0;
		}

		&::after {
			bottom: 0;
		}
	}
}

:deep(.uni-picker-view-indicator) {
	height: 88rpx !important;
	border: none !important; // 移除默认边框
}

:deep(.uni-picker-view-mask) {
	background-size: 100% 88rpx;
}
</style>
