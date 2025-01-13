<template>
	<uni-popup ref="popup" type="bottom" background-color="#fff">
		<view class="login-popup">
			<!-- <view class="header">
				<text class="title">{{ step === 1 ? '登录提示' : '补充信息' }}</text>
				<text class="close" @tap="handleClose">×</text>
			</view> -->

			<!-- 第一步：微信登录 -->
			<template v-if="step === 1">
				<view class="content">
					<image class="logo" src="/static/logo.png" mode="aspectFit" />
					<view class="tips">
						<text class="main-tip">登录后查看游泳数据和个人信息</text>
					</view>
				</view>

				<view class="agreement">
					<checkbox-group @change="handleAgreementChange">
						<label class="agreement-label">
							<checkbox value="1" color="#07c160" :checked="isAgreed" />
							<text class="agreement-text">我已阅读并同意</text>
							<text class="link" @tap="openPrivacyPolicy">《隐私政策》</text>
							<text class="agreement-text">和</text>
							<text class="link" @tap="openUserAgreement">《用户协议》</text>
						</label>
					</checkbox-group>
				</view>

				<view class="footer">
					<button
						class="login-btn"
						@tap="handleLogin"
						:loading="loading"
						:disabled="!isAgreed"
						:class="{ 'login-btn-disabled': !isAgreed }"
					>
						微信一键登录
					</button>
				</view>
			</template>

			<!-- 第二步：获取用户信息 -->
			<template v-else>
				<view class="content">
					<view class="tips">
						<text class="main-tip">完善个人资料</text>
						<text class="sub-tip">授权获取头像、昵称等信息</text>
					</view>
				</view>

				<view class="footer">
					<button class="login-btn" @tap="handleGetUserInfo" :loading="loading">
						授权获取
					</button>
					<button class="skip-btn" @tap="handleSkip">暂不授权</button>
				</view>
			</template>
		</view>
	</uni-popup>
</template>

<script setup>
import { ref } from "vue";
import { request } from "../utils/require";

const emit = defineEmits(["success", "close"]);
const popup = ref(null);
const loading = ref(false);
const isAgreed = ref(false);
const step = ref(1);
const token = ref("");

// 协议勾选处理
const handleAgreementChange = (e) => {
	isAgreed.value = e.detail.value.length > 0;
};

// 打开隐私政策
const openPrivacyPolicy = () => {
	uni.navigateTo({
		url: "/pages/agreement/privacy",
	});
};

// 打开用户协议
const openUserAgreement = () => {
	uni.navigateTo({
		url: "/pages/agreement/user",
	});
};

// 更新用户信息到服务器
const updateUserInfo = async (userInfo) => {
	try {
		const res = await request({
			url: "/auth/update-userinfo",
			method: "POST",
			data: userInfo,
		});
		return res.data.code === 200 || res.data.code === 201
			? res.data.data
			: null;
	} catch (error) {
		console.error("更新用户信息失败", error);
		return null;
	}
};

// 第一步：登录处理
const handleLogin = async () => {
	if (!isAgreed.value) {
		uni.showToast({
			title: "请先同意用户协议和隐私政策",
			icon: "none",
		});
		return;
	}

	try {
		loading.value = true;

		const loginRes = await uni.login({
			provider: "weixin",
		});

		const res = await request({
			url: "/auth/login",
			method: "POST",
			data: {
				code: loginRes.code,
			},
		});

		if (res.data.code === 201 && res.data.data.access_token) {
			token.value = res.data.data.access_token;
			uni.setStorageSync("token", token.value);

			// 检查用户信息是否存在
			if (res.data.data.user?.nickname && res.data.data.user?.avatarUrl) {
				// 如果用户信息已存在，直接完成登录
				emit("success", {
					token: token.value,
					user: res.data.data.user,
				});
				handleClose();
			} else {
				// 只有在用户信息不存在时才进入第二步
				step.value = 2;
			}
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

// 第二步：获取用户信息
const handleGetUserInfo = async () => {
	try {
		loading.value = true;

		const profileRes = await uni.getUserProfile({
			desc: "用于完善用户资料",
		});

		console.log("微信返回的用户信息：", profileRes.userInfo); // 添加日志

		const updatedUser = await updateUserInfo(profileRes.userInfo);

		emit("success", {
			token: token.value,
			user: updatedUser || profileRes.userInfo,
		});

		handleClose();

		uni.showToast({
			title: "登录成功",
			icon: "success",
		});
	} catch (error) {
		console.error("获取用户信息失败", error);
		// 如果用户拒绝授权，不阻止流程
		handleSkip();
	} finally {
		loading.value = false;
	}
};

// 跳过获取用户信息
const handleSkip = () => {
	emit("success", {
		token: token.value,
		user: null,
	});
	handleClose();
};

// 关闭弹窗
const handleClose = () => {
	step.value = 1; // 重置步骤
	token.value = ""; // 重置token
	popup.value.close();
	emit("close");
};

// 打开弹窗方法
const open = () => {
	popup.value.open();
};

// 暴露方法给父组件
defineExpose({
	open,
});
</script>

<style scoped lang="scss">
.login-popup {
	padding: 30rpx;
	border-radius: 24rpx 24rpx 0 0;
	background-color: #fff;
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;
}

.title {
	font-size: 32rpx;
	font-weight: bold;
}

.close {
	font-size: 40rpx;
	color: #999;
	padding: 10rpx;
}

.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 30rpx 0;
}

.logo {
	width: 120rpx;
	height: 120rpx;
	margin-bottom: 30rpx;
}

.tips {
	text-align: center;
}

.main-tip {
	font-size: 32rpx;
	font-weight: 500;
	margin-bottom: 16rpx;
	display: block;
}

.sub-tip {
	font-size: 28rpx;
	color: #666;
}

.footer {
	margin-top: 40rpx;
}

.login-btn {
	background: #07c160;
	color: #fff;
	border-radius: 66rpx;
	font-size: 32rpx;
	padding: 16rpx 0;
}

.agreement {
	padding: 20rpx 0;
}

.agreement-label {
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
}

.agreement-text {
	color: #666;
	margin: 0 4rpx;
}

.link {
	color: #07c160;
}

.login-btn-disabled {
	opacity: 0.5;
	background: #ccc !important;
}

.skip-btn {
	margin-top: 20rpx;
	background: #f7f7f7;
	color: #666;
	border-radius: 66rpx;
	font-size: 32rpx;
	padding: 16rpx 0;
}
</style>
