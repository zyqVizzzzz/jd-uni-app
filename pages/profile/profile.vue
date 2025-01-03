<template>
	<view class="profile-edit-page">
		<view class="section">
			<view class="list-item" @tap="chooseAvatar">
				<text class="label">头像</text>
				<image
					class="avatar"
					:src="userInfo.avatarUrl || '/static/avatar-default@3x.png'"
					mode="aspectFill"
				/>
			</view>
			<view class="list-item" @click="showNicknameInput">
				<text class="label">昵称</text>
				<text class="value"
					>{{ userInfo.nickname || "未设置" }} <text v-html="'>'"></text
				></text>
			</view>
			<view class="list-item" @click="showBioInput">
				<text class="label">简介</text>
				<text class="value"
					>{{ userInfo.bio || "未设置" }} <text v-html="'>'"></text
				></text>
			</view>
			<view class="list-item">
				<text class="label">手机号</text>
				<button
					v-if="!userInfo.phone"
					class="get-phone-btn"
					open-type="getPhoneNumber"
					@getphonenumber="getPhoneNumber"
				>
					<text class="value">未绑定 <text v-html="'>'"></text></text>
				</button>
			</view>
		</view>

		<view class="info-note">以下信息用于精准数据计算，不展示用户信息</view>

		<view class="section">
			<view class="list-item">
				<text class="label">性别</text>
				<picker
					@change="handleGenderChange"
					:value="userInfo.gender || 0"
					:range="genderOptions"
				>
					<text class="value"
						>{{ genderOptions[userInfo.gender] || "未设置" }}
						<text v-html="'>'"></text
					></text>
				</picker>
			</view>
			<view class="list-item">
				<text class="label">生日</text>
				<picker
					mode="date"
					:value="userInfo.birthday || currentDate"
					:start="startDate"
					:end="endDate"
					@change="handleBirthdayChange"
				>
					<text class="value"
						>{{ userInfo.birthday || "未设置" }} <text v-html="'>'"></text
					></text>
				</picker>
			</view>
			<view class="list-item">
				<text class="label">体重</text>
				<picker
					@change="handleWeightChange"
					:value="weightIndex"
					:range="weightOptions"
				>
					<text class="value"
						>{{ userInfo.weight ? `${userInfo.weight}kg` : "未设置" }}
						<text v-html="'>'"></text
					></text>
				</picker>
			</view>
			<view class="list-item">
				<text class="label">身高</text>
				<picker
					@change="handleHeightChange"
					:value="heightIndex"
					:range="heightOptions"
				>
					<text class="value"
						>{{ userInfo.height ? `${userInfo.height}cm` : "未设置" }}
						<text v-html="'>'"></text
					></text>
				</picker>
			</view>
			<view class="list-item">
				<text class="label">城市</text>
				<picker mode="region" @change="handleCityChange" :value="cityArray">
					<text class="value"
						>{{ userInfo.city + " " + userInfo.district || "未设置" }}
						<text v-html="'>'"></text
					></text>
				</picker>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { request } from "@/utils/require";

const userInfo = ref({});

const genderOptions = ["未设置", "男", "女"]; // 性别选项
const cityArray = ref(["", "", ""]); // 默认空数组，对应省市区

// 生成体重选项 (30kg-200kg)
const weightOptions = Array.from(
	{
		length: 171,
	},
	(_, i) => `${i + 30}kg`
);
const weightIndex = computed(() => {
	if (!userInfo.value.weight) {
		// 如果没有设置体重，返回对应 50kg 的索引
		return 20; // (50 - 30)，因为数组是从30开始的
	}
	return (
		weightOptions.findIndex((w) => parseInt(w) === userInfo.value.weight) || 20
	);
});

// 生成身高选项 (100cm-250cm)
const heightOptions = Array.from(
	{
		length: 151,
	},
	(_, i) => `${i + 100}cm`
);
const heightIndex = computed(() => {
	if (!userInfo.value.height) {
		// 如果没有设置身高，返回对应 170cm 的索引
		return 70; // (170 - 100)，因为数组是从100开始的
	}
	return (
		heightOptions.findIndex((h) => parseInt(h) === userInfo.value.height) || 70
	);
});

// 处理城市选择变化
const handleCityChange = (e) => {
	const [province, city, district] = e.detail.value;
	const [provinceCode, cityCode, districtCode] = e.detail.code || [];

	// 更新显示的城市信息（这里可以根据需求决定是否显示省份和区）
	const cityDisplay = city || province; // 这里只显示市级名称，可以根据需求调整

	updateUserInfo({
		province,
		city: cityDisplay,
		district,
		provinceCode: provinceCode?.toString(), // 转换为字符串存储
		cityCode: cityCode?.toString(),
		districtCode: districtCode?.toString(),
	});
};

// 获取日期
const getDate = (type) => {
	const date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();

	if (type === "start") {
		year = year - 100; // 开始年份：当前年份-100年
	} else if (type === "end") {
		year = year; // 结束年份：当前年份
	} else if (type === "default") {
		year = 2000; // 默认显示2000年
	}

	month = month > 9 ? month : "0" + month;
	day = day > 9 ? day : "0" + day;
	return `${year}-${month}-${day}`;
};

// 计算默认日期，如果用户没有设置生日则显示2000年
const currentDate = computed(() => {
	return userInfo.value.birthday || getDate("default");
});
const startDate = computed(() => getDate("start"));
const endDate = computed(() => getDate("end"));

const formatPhone = (phone) => {
	if (!phone) return "";
	return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
};

onMounted(() => {
	fetchUserInfo();
});

// 获取用户信息
const fetchUserInfo = async () => {
	try {
		const res = await request({
			url: "/users/me",
		});
		if (res.data.code === 200) {
			// 接收到数据后，将 ISO 日期字符串转换回 Date 对象
			const userData = res.data.data;
			userInfo.value = userData;
			uni.setStorageSync("userInfo", JSON.stringify(userData));
		}
	} catch (error) {
		console.error("获取用户信息失败:", error);
	}
};

// 更新用户信息
const updateUserInfo = async (data) => {
	try {
		const res = await request({
			url: "/users/me",
			method: "POST",
			data,
		});
		if (res.data.code === 201) {
			uni.showToast({
				title: "更新成功",
				icon: "success",
			});
			fetchUserInfo();
		}
	} catch (error) {
		uni.showToast({
			title: "更新失败",
			icon: "none",
		});
	}
};

// 昵称编辑
const showNicknameInput = () => {
	uni.showModal({
		title: "修改昵称",
		editable: true,
		placeholderText: "请输入昵称",
		content: userInfo.value.nickname || "",
		success: function (res) {
			if (res.confirm && res.content) {
				updateUserInfo({
					nickname: res.content,
				});
			}
		},
	});
};

const chooseAvatar = async () => {
	try {
		const res = await uni.chooseImage({
			count: 1,
			sizeType: ["compressed"],
			sourceType: ["album", "camera"],
		});

		if (res.tempFilePaths && res.tempFilePaths[0]) {
			const filePath = res.tempFilePaths[0];

			// 上传图片
			await uploadAvatar(filePath);
		}
	} catch (error) {
		console.error("选择图片失败:", error);
		uni.showToast({
			title: "选择图片失败",
			icon: "none",
		});
	}
};

const uploadAvatar = async (filePath) => {
	try {
		uni.showLoading({
			title: "上传中...",
		});

		const uploadRes = await uni.uploadFile({
			url: "http://localhost:3000/users/me/avatar",
			filePath: filePath,
			name: "avatar",
			header: {
				Authorization: `Bearer ${uni.getStorageSync("token")}`,
			},
		});

		uni.hideLoading();

		if (uploadRes.data.code === 200 || uploadRes.data.code === 201) {
			uni.showToast({
				title: "上传成功",
				icon: "success",
			});

			// 重新获取用户信息以更新头像
			await fetchUserInfo();
		} else {
			throw new Error("上传失败");
		}
	} catch (error) {
		uni.hideLoading();
		console.error("上传头像失败:", error);
		uni.showToast({
			title: "上传失败",
			icon: "none",
		});
	}
};

// 简介编辑
const showBioInput = () => {
	uni.showModal({
		title: "修改简介",
		editable: true,
		placeholderText: "请输入简介",
		content: userInfo.value.bio || "",
		success: function (res) {
			if (res.confirm && res.content) {
				updateUserInfo({
					bio: res.content,
				});
			}
		},
	});
};

const handleUserInfoUpdate = (userData) => {
	userInfo.value = userData;
	// 如果有已保存的城市信息，更新 cityArray
	if (userData.province && userData.city) {
		cityArray.value = [
			userData.province,
			userData.city,
			userData.district || "",
		];
	}
};

// 处理获取手机号
const getPhoneNumber = async (e) => {
	// 用户拒绝授权
	if (e.detail.errMsg !== "getPhoneNumber:ok") {
		return;
	}

	try {
		// 更新用户手机号
		const res = await request({
			url: "/users/me",
			method: "POST",
			data: {
				code: e.detail.code, // 微信返回的code
			},
		});

		if (res.data.code === 201) {
			uni.showToast({
				title: "手机号绑定成功",
				icon: "success",
			});
			// 重新获取用户信息
			fetchUserInfo();
		}
	} catch (error) {
		uni.showToast({
			title: "手机号绑定失败",
			icon: "none",
		});
	}
};

// 处理选择器变化
const handleGenderChange = (e) => {
	const value = parseInt(e.detail.value);
	updateUserInfo({
		gender: value,
	});
};

const handleBirthdayChange = (e) => {
	updateUserInfo({
		birthday: e.detail.value,
	});
};

const handleWeightChange = (e) => {
	const weight = parseInt(weightOptions[e.detail.value]);
	updateUserInfo({
		weight,
	});
};

const handleHeightChange = (e) => {
	const height = parseInt(heightOptions[e.detail.value]);
	updateUserInfo({
		height,
	});
};
</script>

<style lang="scss">
.profile-edit-page {
	background-color: rgba(244, 248, 251, 1);
	min-height: 100vh;
	padding-top: 1px;

	.section {
		background-color: #fff;
		margin-top: 20rpx;
		border-radius: 8rpx;
		overflow: hidden;
	}

	.list-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 40rpx 30rpx;
		border-bottom: 1px solid #eee;
	}

	.list-item:last-child {
		border-bottom: none;
	}

	.label {
		font-size: 32rpx;
		color: #333;
	}

	.value {
		font-size: 32rpx;
		color: #999;
	}

	.arrow {
		font-size: 18rpx;
		color: #ccc;
	}

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.info-note {
		font-size: 24rpx;
		color: #666;
		margin: 30rpx 24rpx;
		text-align: left;
	}
}
.get-phone-btn {
	background: none;
	padding: 0;
	margin: 0;
	line-height: normal;
	border: none;
	outline: none;

	&::after {
		border: none;
	}

	.value {
		font-size: 32rpx;
		color: #999;
	}
}
</style>
