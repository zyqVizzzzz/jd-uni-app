<template>
	<view class="profile-page">
		<!-- 用户信息区域 -->
		<view class="user-info-section">
			<!-- 头像和基本信息 -->
			<view class="user-header">
				<view class="left-section">
					<image
						:src="userInfo.avatar || '/static/avatar.png'"
						class="avatar"
						mode="aspectFill"
					/>
					<view class="user-text">
						<text class="username">{{ userInfo.nickname }}</text>
						<text class="bio">{{ userInfo.bio || "简介XXXXXXXXXXXX" }}</text>
					</view>
				</view>
			</view>

			<view class="stats-row">
				<view class="stats">
					<view class="stat-item" @tap="navigateToFollows('following')">
						<text class="number">{{ userInfo.followingCount || 0 }}</text>
						<text class="label">关注</text>
					</view>
					<view class="stat-item" @tap="navigateToFollows('followers')">
						<text class="number">{{ userInfo.followersCount || 0 }}</text>
						<text class="label">粉丝</text>
					</view>
					<view class="stat-item">
						<text class="number">{{ points || 0 }}</text>
						<text class="label">积分</text>
					</view>
				</view>
				<button
					class="follow-btn"
					:class="{ followed: userInfo.isFollowing }"
					@tap="handleFollow"
				>
					{{ userInfo.isFollowing ? "已关注" : "关注" }}
				</button>
			</view>
		</view>

		<!-- 内容标签页 -->
		<view class="content-tabs">
			<view
				class="tab-item"
				:class="{ active: activeTab === 'dynamics' }"
				@tap="switchTab('dynamics')"
			>
				动态
				<view class="tab-line" v-if="activeTab === 'dynamics'"></view>
			</view>
			<view
				class="tab-item"
				:class="{ active: activeTab === 'badges' }"
				@tap="switchTab('badges')"
			>
				徽章
				<view class="tab-line" v-if="activeTab === 'badges'"></view>
			</view>
		</view>

		<!-- 内容区域 -->
		<scroll-view
			scroll-y
			class="content-area"
			@scrolltolower="loadMore"
			:refresher-enabled="true"
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh"
		>
			<!-- 动态列表 -->
			<block v-if="activeTab === 'dynamics'">
				<view v-if="dynamicsList.length > 0" class="dynamics-list">
					<view
						v-for="(item, index) in dynamicsList"
						:key="index"
						class="dynamic-item"
					>
						<!-- 动态内容 -->
					</view>
				</view>
				<view v-else class="empty-state">
					<text>暂无动态</text>
				</view>
			</block>

			<!-- 徽章列表 -->
			<block v-if="activeTab === 'badges'">
				<view v-if="badgesList.length > 0" class="badges-list">
					<view
						v-for="(badge, index) in badgesList"
						:key="index"
						class="badge-item"
					>
						<!-- 徽章内容 -->
					</view>
				</view>
				<view v-else class="empty-state">
					<text>暂无徽章</text>
				</view>
			</block>

			<!-- 加载状态 -->
			<view class="loading-state" v-if="isLoading">
				<text>加载中...</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { userRelationsApi } from "@/api/userRelations";
import { pointApi } from "@/api/points";

import { request } from "@/utils/require";
import { onLoad, onHide } from "@dcloudio/uni-app";

const props = defineProps({
	userId: {
		type: String,
		required: true,
	},
});

const userId = ref("");

// 页面状态
const activeTab = ref("dynamics");
const isLoading = ref(false);
const isRefreshing = ref(false);
const page = ref(1);
const pageSize = ref(20);

// 用户数据
const userInfo = ref({
	id: "",
	nickname: "",
	avatar: "",
	bio: "",
	followingCount: 0,
	followersCount: 0,
	points: 0,
	isFollowing: false,
	isBlocked: false,
	// 额外信息
	gender: 0,
	city: "",
	province: "",
	birthday: "",
	weight: 0,
	height: 0,
	target: 0,
});

// 列表数据
const dynamicsList = ref([]);
const badgesList = ref([]);

// 切换标签
const switchTab = (tab) => {
	activeTab.value = tab;
	page.value = 1;
	fetchTabContent();
};

// 获取用户信息
const fetchUserInfo = async () => {
	try {
		const res = await request({
			url: `/users/${userId.value}/profile`,
		});
		if (res.data.code === 200) {
			const userData = res.data.data;
			userInfo.value = {
				id: userData._id,
				nickname: userData.nickname || "未设置昵称",
				avatar: userData.avatarUrl,
				bio: userData.bio || "这个人很懒，没有签名",
				followingCount: userData.following >= 0 ? userData.following : 0,
				followersCount: userData.followers || 0,
				points: userData.points || 0,
				isFollowing: userData.isFollowing,
				isBlocked: userData.isBlocked,
				// 额外信息
				gender: userData.gender,
				city: userData.city,
				province: userData.province,
				birthday: userData.birthday,
				weight: userData.weight,
				height: userData.height,
				target: userData.target,
			};
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

// 页面加载时获取动态ID并请求数据
onLoad((options) => {
	if (options.id) {
		userId.value = options.id;
	}
});

// 获取标签页内容
const fetchTabContent = async () => {
	if (isLoading.value) return;

	isLoading.value = true;
	try {
		const endpoint =
			activeTab.value === "dynamics"
				? `/dynamics/${userId.value}`
				: `/badges/${userId.value}`;

		const res = await request({
			url: endpoint,
			data: {
				page: page.value,
				pageSize: pageSize.value,
			},
		});

		if (res.statusCode === 200) {
			const list = activeTab.value === "dynamics" ? dynamicsList : badgesList;

			if (page.value === 1) {
				list.value = res.data;
			} else {
				list.value = [...list.value, ...res.data];
			}
		}
	} catch (error) {
		console.error("获取内容失败:", error);
		uni.showToast({
			title: "获取内容失败",
			icon: "none",
		});
	} finally {
		isLoading.value = false;
		isRefreshing.value = false;
	}
};

// 关注/取消关注
const handleFollow = async () => {
	try {
		if (userInfo.value.isFollowing) {
			await userRelationsApi.unfollowUser(userId.value);
		} else {
			await userRelationsApi.followUser(userId.value);
		}

		userInfo.value.isFollowing = !userInfo.value.isFollowing;
		uni.showToast({
			title: userInfo.value.isFollowing ? "关注成功" : "取消关注成功",
			icon: "success",
		});
	} catch (error) {
		console.error("操作失败:", error);
		uni.showToast({
			title: "操作失败",
			icon: "none",
		});
	}
};

// 跳转到关注/粉丝列表
const navigateToFollows = (type) => {
	uni.navigateTo({
		url: `/pages/follows/follows?type=${type}&userId=${props.userId}`,
	});
};

// 下拉刷新
const onRefresh = () => {
	isRefreshing.value = true;
	page.value = 1;
	fetchTabContent();
};

// 加载更多
const loadMore = () => {
	fetchTabContent();
};

onMounted(() => {
	fetchUserInfo();
	fetchPoints();
	fetchTabContent();
});
</script>

<style lang="scss">
.profile-page {
	min-height: 100vh;
	background-color: #fff;
}

.user-info-section {
	padding: 32rpx 64rpx;
	background-color: #f5f7fa;
}

.user-header {
	margin-bottom: 32rpx;
}

.left-section {
	display: flex;
	align-items: center;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	margin-right: 24rpx;
}

.user-text {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.username {
	font-size: 36rpx;
	color: #333;
	font-weight: 600;
	margin-bottom: 12rpx;
}

.bio {
	font-size: 28rpx;
	color: #999;
}

.stats-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.stats {
	display: flex;
	gap: 80rpx;
	margin-left: 24rpx;
}

.stat-item {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}

.number {
	font-size: 32rpx;
	color: #333;
	font-weight: 600;
	margin-bottom: 8rpx;
}

.label {
	font-size: 24rpx;
	color: #999;
}

.follow-btn {
	width: 160rpx;
	height: 64rpx;
	line-height: 64rpx;
	text-align: center;
	border-radius: 32rpx;
	font-size: 28rpx;
	color: #303133;
	background-color: #ffda00;
	border: none;
	padding: 0;
	margin: 0; // 移除按钮默认边距

	&.followed {
		background-color: #dcdfe6;
		color: #606266;
	}
	&::after {
		border: none;
	}
}

.content-tabs {
	display: flex;
	border-bottom: 1rpx solid #f5f5f5;
	background: #f5f7fa;
	border-radius: 32rpx 32rpx 0 0;
}

.tab-item {
	position: relative;
	flex: 1;
	text-align: center;
	padding: 36rpx 0;
	font-size: 30rpx;
	color: #666;
	background: #fff;

	&.active {
		color: #333;
		font-weight: 500;
	}
	&:first-child {
		border-top-left-radius: 32rpx;
	}
	&:last-child {
		border-top-right-radius: 32rpx;
	}
}

.tab-line {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 48rpx;
	height: 6rpx;
	background-color: #ffc107;
	border-radius: 3rpx;
}

.content-area {
	flex: 1;
	background: #ffffff;
}

.empty-state {
	padding: 120rpx 0;
	text-align: center;
	color: #999;
	font-size: 28rpx;
}

.loading-state {
	padding: 24rpx 0;
	text-align: center;
	color: #999;
	font-size: 26rpx;
}
</style>
