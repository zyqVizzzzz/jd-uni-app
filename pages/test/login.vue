<!-- pages/test/login.vue -->
<template>
	<view class="container">
		<view class="status-box">
			<text class="label">登录状态：</text>
			<text :class="['status', isLoggedIn ? 'success' : 'default']">
				{{ isLoggedIn ? "已登录" : "未登录" }}
			</text>
		</view>

		<view class="token-box" v-if="token">
			<text class="label">Token：</text>
			<text class="token">{{ token }}</text>
		</view>

		<view class="user-box" v-if="userInfo">
			<text class="label">用户信息：</text>
			<text class="info">{{ JSON.stringify(userInfo, null, 2) }}</text>
		</view>

		<button class="btn" @tap="handleLogin" :loading="loading">
			{{ loading ? "登录中..." : "测试登录" }}
		</button>

		<button class="btn info-btn" @tap="getUserProfile" v-if="isLoggedIn">
			获取用户信息
		</button>
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import config from "@/config";

const loading = ref(false);
const isLoggedIn = ref(false);
const token = ref("");
const userInfo = ref(null);

// 配置后端接口地址
const API_BASE_URL = config.API_BASE_URL;

// 登录方法
const handleLogin = async () => {
	try {
		loading.value = true;

		// 调用微信登录
		const loginRes = await uni.login({
			provider: "weixin",
		});

		console.log("微信登录成功", loginRes);

		// 调用后端登录接口
		const res = await uni.request({
			url: `${API_BASE_URL}/auth/login`,
			method: "POST",
			data: {
				code: loginRes.code,
			},
		});

		console.log("后端登录成功", res);

		if (res.statusCode === 201 && res.data.access_token) {
			token.value = res.data.access_token;
			isLoggedIn.value = true;
			userInfo.value = res.data.user;

			// 保存token到存储
			uni.setStorageSync("token", res.data.access_token);

			uni.showToast({
				title: "登录成功",
				icon: "success",
			});
		} else {
			throw new Error("登录失败");
		}
	} catch (error) {
		console.error("登录错误", error);
		uni.showToast({
			title: "登录失败",
			icon: "error",
		});
	} finally {
		loading.value = false;
	}
};

// 获取用户信息
const getUserProfile = async () => {
	try {
		const profileRes = await uni.getUserProfile({
			desc: "用于完善用户资料",
		});

		console.log("获取用户信息成功", profileRes);

		// 调用后端更新用户信息接口
		const res = await uni.request({
			url: `${API_BASE_URL}/auth/update-userinfo`,
			method: "POST",
			data: profileRes.userInfo,
			header: {
				Authorization: `Bearer ${token.value}`,
			},
		});

		console.log("更新用户信息成功", res);

		if (res.statusCode === 200) {
			userInfo.value = res.data;
			uni.showToast({
				title: "更新成功",
				icon: "success",
			});
		}
	} catch (error) {
		console.error("获取用户信息错误", error);
		uni.showToast({
			title: "获取信息失败",
			icon: "error",
		});
	}
};

// 检查是否已登录
onMounted(() => {
	const savedToken = uni.getStorageSync("token");
	if (savedToken) {
		token.value = savedToken;
		isLoggedIn.value = true;
	}
});
</script>

<style>
.container {
	padding: 20px;
}

.status-box,
.token-box,
.user-box {
	margin-bottom: 20px;
	padding: 15px;
	border-radius: 8px;
	background-color: #f8f8f8;
}

.label {
	font-weight: bold;
	margin-right: 10px;
}

.status {
	padding: 4px 8px;
	border-radius: 4px;
}

.status.success {
	background-color: #e8f5e9;
	color: #2e7d32;
}

.status.default {
	background-color: #f5f5f5;
	color: #757575;
}

.token {
	word-break: break-all;
	font-family: monospace;
	font-size: 12px;
}

.info {
	white-space: pre-wrap;
	font-family: monospace;
	font-size: 12px;
}

.btn {
	margin: 20px 0;
	background-color: #007aff;
	color: white;
}

.info-btn {
	background-color: #4caf50;
}
</style>
