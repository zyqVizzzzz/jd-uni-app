<template>
	<view class="profile-edit-page">
		<!-- Step Content -->
		<view v-if="currentStep === 1" class="gender-selection">
			<view
				class="gender-item male"
				:class="{ selected: selectedGender === 'male' }"
				@tap="selectGender('male')"
			>
				<view class="icon">♂</view>
				<text class="label">男</text>
			</view>
			<view
				class="gender-item female"
				:class="{ selected: selectedGender === 'female' }"
				@tap="selectGender('female')"
			>
				<view class="icon">♀</view>
				<text class="label">女</text>
			</view>
		</view>

		<view v-if="currentStep === 2" class="custom-picker">
			<scroll-picker
				style="width: 100%; background-color: transparent"
				:columns="[
					{
						options: generateYearOptions(1989, 1995),
						defaultValue: '1992',
					},
					{
						options: generateMonthOptions(),
						defaultValue: '05',
					},
					{
						options: generateDayOptions(1992, 5),
						defaultValue: '05',
					},
				]"
				title="您的生日"
				@change="handleDateChange"
			/>
		</view>

		<view v-if="currentStep === 3" class="custom-picker">
			<weight-scale
				style="width: 100%"
				v-model="weight"
				:min="30"
				:max="150"
				:step="1"
				@change="handleWeightChange"
			/>
		</view>

		<view v-if="currentStep === 4" class="custom-picker"> </view>

		<!-- Navigation Buttons -->
		<view class="navigation-buttons">
			<button v-if="currentStep > 1" @tap="goPrevious">上一页</button>
			<button
				v-if="currentStep < totalSteps && currentStep !== 1"
				@tap="goNext"
			>
				下一页
			</button>
		</view>
	</view>
</template>

<script setup>
import { ref, reactive } from "vue";
import ScrollPicker from "@/components/ScrollPicker.vue";
import WeightScale from "@/components/WeightScale.vue";

const currentStep = ref(1);
const totalSteps = ref(4);
const selectedGender = ref(null);
const stepTitle = ref("选择性别");
const weight = ref(54);

const handleWeightChange = (value) => {
	weight.value = value;
	// 可以在这里添加其他处理逻辑
};

const goNext = () => {
	if (currentStep.value < totalSteps.value) {
		currentStep.value++;
		updateStepTitle();
	}
};

const goPrevious = () => {
	if (currentStep.value > 1) {
		currentStep.value--;
		updateStepTitle();
	}
};

const selectGender = (gender) => {
	selectedGender.value = gender;
	goNext();
};

const updateStepTitle = () => {
	const titles = ["选择性别", "您的生日", "您的体重 (KG)", "您的身高 (CM)"];
	stepTitle.value = titles[currentStep.value - 1];
};

const generateYearOptions = (startYear, endYear) => {
	const options = [];
	for (let year = startYear; year <= endYear; year++) {
		options.push({
			label: year,
			value: year.toString(),
		});
	}
	return options;
};

const generateMonthOptions = () => {
	const options = [];
	for (let month = 1; month <= 12; month++) {
		const value = month.toString().padStart(2, "0");
		options.push({
			label: value,
			value,
		});
	}
	return options;
};

const generateDayOptions = (year, month) => {
	const days = new Date(year, month, 0).getDate();
	const options = [];
	for (let day = 1; day <= days; day++) {
		const value = day.toString().padStart(2, "0");
		options.push({
			label: value,
			value,
		});
	}
	return options;
};

const dateColumns = reactive([
	{
		options: generateYearOptions(1989, 1995),
		defaultValue: "1992",
	},
	{
		options: generateMonthOptions(),
		defaultValue: "05",
	},
	{
		options: generateDayOptions(1992, 5),
		defaultValue: "05",
	},
]);

const handleDateChange = (e) => {
	const { values, columnIndex } = e;
	// 更新日期选项
	if (columnIndex === 0 || columnIndex === 1) {
		const year = values[0]?.value || dateColumns[0].defaultValue;
		const month = values[1]?.value || dateColumns[1].defaultValue;
		dateColumns[2].options = generateDayOptions(
			parseInt(year),
			parseInt(month)
		);
	}
};
</script>

<style scoped>
.custom-picker {
	height: 400px;
	width: 100%;
	display: flex;
	/* align-items: center; */
	border-radius: 8px;
	margin: 20px 0;
}

.profile-edit-page {
	background-color: #fff;
	min-height: 100vh;
	padding: 16px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
}

.gender-selection {
	display: flex;
	flex-direction: column;
	gap: 20px;
	align-items: center;
}

.gender-item {
	width: 120px;
	height: 120px;
	border-radius: 60px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border: 2px solid #ccc;
	background-color: #f0f0f0;
	transition: all 0.3s;
	cursor: pointer;
}

.gender-item.selected {
	border-color: #ffc107;
	background-color: #ffc107;
}

.gender-item .icon {
	font-size: 36px;
	color: #333;
}

.gender-item .label {
	font-size: 16px;
	margin-top: 8px;
	color: #333;
}

.gender-item.selected .icon,
.gender-item.selected .label {
	color: #fff;
}

.birthday-selection {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.birthday-picker {
	margin-top: 20px;
}

.birthday-label {
	font-size: 16px;
	margin-bottom: 10px;
	color: #333;
}

.picker {
	width: 200px;
	height: 40px;
	line-height: 40px;
	text-align: center;
	border: 1px solid #ccc;
	border-radius: 4px;
	background-color: #fff;
}

.navigation-buttons {
	margin-top: 40px;
	display: flex;
	gap: 20px;
}

button {
	padding: 10px 20px;
	font-size: 16px;
	border: none;
	border-radius: 4px;
	background-color: #ffc107;
	color: #fff;
	cursor: pointer;
}

button:active {
	background-color: #e0a800;
}

.note {
	margin-top: 20px;
	text-align: center;
	color: #666;
	font-size: 14px;
}
</style>
