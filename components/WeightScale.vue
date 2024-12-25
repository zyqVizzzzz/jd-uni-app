<template>
	<view class="weight-scale">
		<view class="scale-container">
			<!-- 数字显示区域 -->
			<view class="number-display">
				<text
					class="number"
					:class="{ active: index === 1 }"
					v-for="(num, index) in displayNumbers"
					:key="index"
				>
					{{ num }}
				</text>
			</view>

			<!-- 刻度线区域 -->
			<view
				class="scale-marks"
				@touchstart.stop.prevent="handleTouchStart"
				@touchmove.stop.prevent="handleTouchMove"
				@touchend.stop.prevent="handleTouchEnd"
			>
				<view
					class="mark"
					v-for="index in totalMarks"
					:key="index"
					:class="{
						long:
							(Math.floor(currentValue) + index - centerMarkIndex) % 5 === 0,
						active: index === centerMarkIndex,
					}"
				></view>
			</view>
		</view>
	</view>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";

export default {
	name: "WeightScale",

	props: {
		title: {
			type: String,
			default: "您的体重 (KG)",
		},
		modelValue: {
			type: Number,
			default: 54,
		},
		min: {
			type: Number,
			default: 30,
		},
		max: {
			type: Number,
			default: 150,
		},
		step: {
			type: Number,
			default: 1,
		},
	},

	setup(props, { emit }) {
		const currentValue = ref(props.modelValue);
		const totalMarks = 41;
		const centerMarkIndex = 21;
		const touchStartX = ref(0);
		const touchStartValue = ref(0);
		const sensitivity = 0.1;

		// 在组件挂载后初始化数据
		onMounted(() => {
			currentValue.value = props.modelValue;
		});

		// 监听 modelValue 变化
		watch(
			() => props.modelValue,
			(newVal) => {
				currentValue.value = newVal;
			}
		);

		// 计算显示的数字
		const displayNumbers = computed(() => {
			const mainValue = Math.floor(currentValue.value);
			return [mainValue - 1, mainValue, mainValue + 1];
		});

		// 触摸事件处理
		const handleTouchStart = (event) => {
			touchStartX.value = event.touches[0].clientX;
			touchStartValue.value = currentValue.value;
		};

		const handleTouchMove = (event) => {
			const deltaX = event.touches[0].clientX - touchStartX.value;
			const deltaValue = -deltaX * sensitivity;

			let newValue = touchStartValue.value + deltaValue;
			newValue = Math.max(props.min, Math.min(props.max, newValue));
			newValue = Math.round(newValue / props.step) * props.step;

			if (currentValue.value !== newValue) {
				currentValue.value = newValue;
				emit("update:modelValue", newValue);
				emit("change", newValue);
			}
		};

		const handleTouchEnd = () => {
			const finalValue = Math.round(currentValue.value);
			if (currentValue.value !== finalValue) {
				currentValue.value = finalValue;
				emit("update:modelValue", finalValue);
				emit("change", finalValue);
			}
		};

		return {
			currentValue,
			totalMarks,
			centerMarkIndex,
			displayNumbers,
			handleTouchStart,
			handleTouchMove,
			handleTouchEnd,
		};
	},
};
</script>

<style lang="scss" scoped>
.weight-scale {
	width: 100%;
	padding: 20px;
	box-sizing: border-box;
		display: flex;
	flex-direction: column;
	align-items: center;
	user-select: none;

	.scale-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 40rpx;
	}

	.number-display {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 40rpx;

		.number {
			font-size: 34px;
			color: #999;
			transition: all 0.3s;

			&.active {
				font-size: 58px;
				color: #333;
				font-weight: 500;
			}
		}
	}

	.scale-marks {
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		gap: 12rpx;
		padding: 0 40rpx;
		box-sizing: border-box;

		.mark {
			width: 4rpx;
			height: 24rpx;
			background-color: #ffe168;
			transition: all 0.2s;

			&.long {
				height: 40rpx;
			}

			&.active {
				height: 60rpx;
				width: 6rpx;
				background-color: #ffda00;
			}
		}
	}
}
</style>
