<template>
	<view class="page">
		<!-- 用户信息区 -->
		<view class="user-info">
			<!-- 头像和名称 -->
			<view class="user-profile">
				<image
					:src="userInfo.avatarUrl || '/static/avatar.png'"
					class="avatar"
					mode="aspectFill"
				/>
				<text class="username">{{ userInfo.nickname || "未设置昵称" }}</text>
				<text class="description">{{ userInfo.bio || "" }}</text>
			</view>

			<!-- 数据统计 -->
			<view class="stats">
				<view class="stat-item" @tap="navigateToFollowingList">
					<text class="stat-num">{{ userInfo.following || 0 }}</text>
					<text class="stat-label">关注</text>
				</view>
				<view class="stat-item" @tap="navigateToFollowingList">
					<text class="stat-num">{{ userInfo.followers || 0 }}</text>
					<text class="stat-label">粉丝</text>
				</view>
				<view class="stat-item">
					<text class="stat-num" @tap="navigateToPoints">{{
						points || 0
					}}</text>
					<text class="stat-label">积分</text>
				</view>
			</view>
		</view>

		<!-- 设备展示区域 -->
		<view class="device-section">
			<!-- Tab 切换 -->
			<view class="device-tabs">
				<view
					class="tab-item"
					:class="{ active: activeTab === 'device' }"
					@tap="handleTabClick('device')"
				>
					<text>我的设备</text>
					<view class="active-line" v-if="activeTab === 'device'"></view>
				</view>
				<view
					class="tab-item"
					:class="{ active: activeTab === 'medal' }"
					@tap="handleTabClick('medal')"
				>
					<text>我的勋章</text>
					<view class="active-line" v-if="activeTab === 'medal'"></view>
				</view>
			</view>

			<!-- 设备内容 -->
			<view class="device-content" v-if="activeTab === 'device'">
				<swiper
					class="device-swiper"
					:indicator-dots="false"
					:current="currentDevice"
					@change="handleDeviceChange"
				>
					<swiper-item v-for="(device, index) in devicesList" :key="index">
						<view class="device-item">
							<image
								src="https://test-1251994034.cos.ap-shanghai.myqcloud.com/device.png"
								class="device-image"
								mode="aspectFit"
							/>
							<view class="device-info">
								<text class="device-name">{{ device.device_name }}</text>
								<view class="connection-status">
									<view
										class="status-dot"
										:class="{
											'status-online': device.device_status === 'online',
										}"
									></view>
									<text class="status-text">
										{{
											device.device_status === "online" ? "已连接" : "未连接"
										}}
									</text>
								</view>
							</view>
						</view>
					</swiper-item>
					<swiper-item>
						<view class="device-item add-device" @tap="handleAddDevice">
							<image
								src="https://test-1251994034.cos.ap-shanghai.myqcloud.com/device.png"
								class="device-image"
								mode="aspectFit"
								@tap="navigateToDevice(device)"
							/>
							<view class="device-info">
								<text class="device-name">添加新设备</text>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>

			<!-- 勋章内容 -->
			<view class="medal-content" v-if="activeTab === 'medal'">
				<text class="empty-text">暂无勋章</text>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-list">
			<view class="menu-item" @tap="navigateToAccount">
				<text>账号信息</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item" @tap="navigateToMessage">
				<text>消息中心</text>
				<text class="arrow">></text>
			</view>
			<view class="menu-item" @tap="navigateToContact">
				<text>联系客服</text>
				<text class="arrow">></text>
			</view>

			<!-- <view class="menu-item">
				<text>语言设置</text>
				<text class="arrow">></text>
			</view> -->
		</view>
		<login-popup
			ref="loginPopupRef"
			@success="handleLoginSuccess"
			@close="handleLoginClose"
		/>
	</view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { request } from "@/utils/require";
import { pointApi } from "@/api/points";
import LoginPopup from "@/components/LoginPopup.vue";
import { onShow } from "@dcloudio/uni-app";
import emitter from "@/utils/eventBus";

const loginPopupRef = ref(null);
const activeTab = ref("device");
const userInfo = ref({
	nickname: "",
	avatarUrl: "",
	bio: "",
	following: 0,
	followers: 0,
	points: 0,
});
const devicesList = ref([]);
const currentDevice = ref(0);

const handleDeviceChange = (e) => {
	currentDevice.value = e.detail.current;
};

onMounted(() => {
	// 先尝试从本地存储获取用户信息
	const localUserInfo = uni.getStorageSync("userInfo");
	if (localUserInfo) {
		try {
			userInfo.value = JSON.parse(localUserInfo);
		} catch (e) {
			console.error("解析本地用户信息失败:", e);
		}
	}
	checkLoginStatus(() => {
		fetchUserInfo();
		fetchPoints();
		fetchUserDevices();
	});

	emitter.on("updateUserInfo", () => {
		console.log("收到更新事件");
		fetchUserInfo();
		fetchPoints();
		fetchUserDevices();
	});
});

onShow(() => {
	// 先尝试从本地存储获取用户信息
	const localUserInfo = uni.getStorageSync("userInfo");
	if (localUserInfo) {
		try {
			userInfo.value = JSON.parse(localUserInfo);
		} catch (e) {
			console.error("解析本地用户信息失败:", e);
		}
	}
	checkLoginStatus(() => {
		fetchUserInfo();
		fetchPoints();
		fetchUserDevices();
	});
});

// 检查登录状态
const checkLoginStatus = (cb) => {
	const token = uni.getStorageSync("token");
	if (!token) {
		handleNeedLogin();
		return false;
	}
	cb();
};

const fetchUserInfo = async () => {
	try {
		const res = await request({
			url: "/users/me",
		});
		if (res.data.code === 200) {
			userInfo.value = res.data.data;
			// 将用户信息保存到本地存储
			uni.setStorageSync("userInfo", JSON.stringify(res.data.data));
		}
	} catch (error) {
		console.error("获取用户信息失败:", error);
		uni.showToast({
			title: "获取用户信息失败",
			icon: "none",
		});
	}
};

const points = ref(0);
const fetchPoints = async () => {
	try {
		const res = await pointApi.getUserPoints();
		if (res.data.code === 200) {
			// 更新任务状态
			points.value = res.data.data.totalPoints;
		}
	} catch (error) {}
};

const fetchUserDevices = async () => {
	const openid = JSON.parse(uni.getStorageSync("userInfo")).openid;
	try {
		const res = await request({
			url: "/devices/user/" + openid,
		});
		if (res.data.code === 200) {
			devicesList.value = res.data.data;
		}
	} catch (error) {
		console.error("获取设备列表失败:", error);
		uni.showToast({
			title: "获取设备列表失败",
			icon: "none",
		});
	}
};

// 在需要登录的地方调用
const handleNeedLogin = () => {
	loginPopupRef.value.open();
};

// 登录成功回调
const handleLoginSuccess = (data) => {
	// 处理登录成功后的逻辑
	// 例如获取用户信息等
	console.log(data);
};

// 登录弹窗关闭回调
const handleLoginClose = () => {
	// 处理弹窗关闭后的逻辑
};

const handleTabClick = (tab) => {
	activeTab.value = tab;
};

const navigateToAccount = () => {
	uni.navigateTo({
		url: "/pages/setting/setting",
	});
};

const navigateToPoints = () => {
	uni.navigateTo({
		url: "/pages/points/points",
	});
};

const navigateToDevice = () => {
	uni.navigateTo({
		url: "/pages/device/device",
	});
};

const navigateToFollowingList = () => {
	uni.navigateTo({
		url: "/pages/followingList/followingList",
	});
};

const navigateToContact = () => {
	uni.navigateTo({
		url: "/pages/contactCostumer/contactCostumer",
	});
};

const navigateToMessage = () => {
	uni.navigateTo({
		url: "/pages/message/message",
	});
};
</script>

<style lang="scss">
view {
	box-sizing: border-box;
}

/* 页面容器 */
.page {
	min-height: 100vh;
	background-color: #f5f5f5;
}

.user-info {
	padding: 32rpx;
}

.user-profile {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.avatar {
	width: 140rpx;
	height: 140rpx;
	border-radius: 70rpx;
}

.username {
	font-size: 32rpx;
	font-weight: 500;
	margin-top: 16rpx;
}

.description {
	font-size: 28rpx;
	color: #999999;
	margin-top: 8rpx;
}

.stats {
	display: flex;
	justify-content: center;
	margin-top: 32rpx;
}

.stat-item {
	text-align: center;
	margin: 0 48rpx;
}

.stat-num {
	display: block;
	font-size: 36rpx;
	font-weight: 500;
}

.stat-label {
	font-size: 24rpx;
	color: #666666;
}

.tabs {
	display: flex;
	padding: 0 32rpx;
	border-bottom: 1rpx solid #eeeeee;
}

.tab-item {
	position: relative;
	margin-right: 32rpx;
	padding: 16rpx 0;
}

.tab-item-active {
	color: #333333;
}

.tab-line {
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 4rpx;
	background-color: #ffc107;
	border-radius: 4rpx;
}

.device-section {
	background-color: #fff;
	border-radius: 32rpx;
	padding: 36rpx 48rpx 49rpx;
	margin-top: 32rpx;
}

.device-tabs {
	display: flex;
	justify-content: space-between;
	margin-bottom: 64rpx;
}

.tab-item {
	position: relative;
	font-size: 32rpx;
	color: #999;
}

.tab-item.active {
	font-weight: 500;
	color: #333;
}

.active-line {
	position: absolute;
	left: 0;
	bottom: -8rpx;
	width: 100%;
	height: 8rpx;
	background-color: #ffc107;
	border-radius: 8rpx 8rpx 0 0;
}

.device-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
}

.device-swiper {
	width: 100%;
	height: 240rpx; /* 适配原有图片高度 */
}

.device-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 20rpx 0;
}

.device-image {
	width: 256rpx;
	height: 128rpx;
}

.device-image {
	width: 256rpx;
	height: 128rpx;
}

.device-info {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.device-name {
	font-size: 28rpx;
	color: #333;
	margin: 16rpx 0 8rpx;
}

.connection-status {
	align-self: flex-end;
	display: flex;
	align-items: center;
}

.status-dot {
	width: 12rpx;
	height: 12rpx;
	background-color: #ffc107;
	border-radius: 50%;
	margin-right: 8rpx;
}

.status-text {
	font-size: 24rpx;
	color: #666;
}

.medal-content {
	min-height: 200rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.empty-text {
	color: #999;
	font-size: 28rpx;
}

.menu-list {
	margin-top: 32rpx;
	background-color: #ffffff;
}

.menu-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx;
	border-bottom: 1rpx solid #eeeeee;
}

.arrow {
	color: #cccccc;
}

.add-device {
	opacity: 0.7;
	transition: opacity 0.3s;
}

.add-device:active {
	opacity: 1;
}

.add-device .device-image {
	width: 128rpx; /* 可能需要调整大小 */
	height: 128rpx;
}

.add-device .device-name {
	color: #999;
	margin-top: 0rpx;
}
</style>
