<template>
	<view class="profile-edit-page">
		<view class="gender-selection">
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
	</view>
</template>

<script setup>
import { ref, reactive } from "vue";
import { request } from "@/utils/require";
const selectedGender = ref(null);

// 更新用户信息
const updateUserInfo = async (data) => {
	try {
		const res = await request({
			url: "/users/me",
			method: "POST",
			data,
		});
		if (res.data.code === 201) {
			uni.navigateTo({
				url: "/pages/profileEditBirth/profileEditBirth",
			});
		}
	} catch (error) {
		uni.showToast({
			title: "更新失败",
			icon: "none",
		});
	}
};

const selectGender = (gender) => {
	console.log(gender);
	const genderObj = { male: 1, female: 2 };
	updateUserInfo({
		gender: parseInt(genderObj[gender]),
	});
};
</script>

<style scoped>
.profile-edit-page {
	background-color: #fff;
	min-height: 100vh;
	padding: 16px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	padding-top: 150px;
}

.gender-selection {
	display: flex;
	flex-direction: column;
	gap: 30px;
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
</style>
