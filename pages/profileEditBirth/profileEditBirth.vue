<template>
	<view class="profile-edit-page">
		<view class="custom-picker">
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
		
		<!-- Navigation Buttons -->
		<view class="navigation-buttons">
			<button @tap="goPrevious">上一页</button>
			<button @tap="goNext">下一页</button>
		</view>
	</view>
</template>

<script setup>
	import { ref, reactive } from "vue";
	import ScrollPicker from "@/components/ScrollPicker.vue";
	const goPrevious = () => {
		uni.navigateBack()
	}
	const goNext = () => {
		uni.navigateTo({
		  url: "/pages/profileEditWeight/profileEditWeight",
		});
	}
	
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

<style scoped lang="scss">
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
