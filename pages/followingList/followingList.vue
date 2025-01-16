<template>
	<view class="page">
		<!-- 顶部导航栏 -->
		<view class="tabs">
			<view
				class="tab-item"
				:class="{ active: activeTab === 'following' }"
				@tap="switchTab('following')"
			>
				关注
				<view class="tab-line" v-if="activeTab === 'following'"></view>
			</view>
			<view
				class="tab-item"
				:class="{ active: activeTab === 'followers' }"
				@tap="switchTab('followers')"
			>
				粉丝
				<view class="tab-line" v-if="activeTab === 'followers'"></view>
			</view>
		</view>

		<!-- 用户列表 -->
		<scroll-view
			scroll-y
			class="user-list"
			@scrolltolower="loadMore"
			:refresher-enabled="true"
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh"
		>
			<view v-if="list.length > 0">
				<view v-for="(user, index) in list" :key="index" class="user-item">
					<view class="user-info" @tap="navigateToUserProfile(user.id)">
						<image
							:src="user.avatarUrl || '/static/avatar.png'"
							class="avatar"
							mode="aspectFill"
						/>
						<view class="user-detail">
							<text class="nickname">{{ user.nickname || "未设置昵称" }}</text>
							<text class="bio">{{ user.bio || "这个人很懒，没有签名" }}</text>
						</view>
					</view>
					<view
						class="action-btn"
						@tap="handleFollow(user)"
						v-if="activeTab === 'following'"
					>
						<text :class="['btn-text', user.isFollowing ? 'following' : '']">
							{{ user.isFollowing ? "已关注" : "关注" }}
						</text>
					</view>
				</view>
			</view>

			<!-- 空状态 -->
			<view v-else class="empty-state">
				<image src="/static/empty.png" mode="aspectFit" class="empty-image" />
				<text class="empty-text">{{
					activeTab === "following" ? "还没有关注任何人" : "还没有粉丝"
				}}</text>
			</view>

			<!-- 加载状态 -->
			<view class="loading-state" v-if="isLoading && list.length > 0">
				<text class="loading-text">加载中...</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { userRelationsApi } from "../../api/userRelations.js";
import { request } from "@/utils/require";

const activeTab = ref("following");
// 模拟数据
const mockFollowingList = [
	{
		id: "1",
		nickname: "游泳达人",
		avatarUrl: "/static/avatar.png",
		bio: "游泳爱好者，每周游3次",
		isFollowing: true,
	},
	{
		id: "2",
		nickname: "自由泳教练",
		avatarUrl: "/static/avatar.png",
		bio: "专业教练，8年教学经验",
		isFollowing: true,
	},
	{
		id: "3",
		nickname: "蛙泳小王子",
		avatarUrl: "/static/avatar.png",
		bio: "最爱蛙泳，比赛获奖多次",
		isFollowing: true,
	},
];

const mockFollowersList = [
	{
		id: "4",
		nickname: "游泳初学者",
		avatarUrl: "/static/avatar.png",
		bio: "刚开始学习游泳，请多指教",
		isFollowing: false,
	},
	{
		id: "5",
		nickname: "泳池常客",
		avatarUrl: "/static/avatar.png",
		bio: "每天都来游泳",
		isFollowing: true,
	},
];

const list = ref([]);
const page = ref(1);
const pageSize = ref(20);
const isLoading = ref(false);
const isRefreshing = ref(false);
const hasMore = ref(false); // 由于是假数据，默认没有更多

// 切换标签
const switchTab = (tab) => {
	activeTab.value = tab;
	fetchUserList();
};

// 获取用户列表
const fetchUserList = async () => {
	if (isLoading.value) return;

	isLoading.value = true;
	try {
		// 根据当前标签请求不同的接口
		const endpoint = `/user-relations/${activeTab.value}`;
		const res = await request({
			url: endpoint,
		});

		if (res.data.code === 200) {
			// 处理返回的数据,从关系对象中提取用户信息
			list.value = res.data.data.map((item) => {
				const user =
					activeTab.value === "following" ? item.toUser : item.fromUser;
				return {
					id: user._id,
					nickname: user.nickname,
					avatarUrl: user.avatarUrl,
					bio: user.bio,
					isFollowing: true, // following列表中都是已关注的
				};
			});
		}
	} catch (error) {
		console.error("获取用户列表失败:", error);
		uni.showToast({
			title: "获取用户列表失败",
			icon: "none",
		});
	} finally {
		isLoading.value = false;
		isRefreshing.value = false;
	}
};

// 下拉刷新
const onRefresh = () => {
	isRefreshing.value = true;
	fetchUserList();
};

// 加载更多
const loadMore = () => {
	fetchUserList();
};

// 关注/取消关注操作
const handleFollow = async (user) => {
	try {
		if (user.isFollowing) {
			// 取消关注
			await userRelationsApi.unfollowUser(user.id);
			user.isFollowing = false;

			// 如果在关注列表中取消关注,则移除该用户
			if (activeTab.value === "following") {
				list.value = list.value.filter((item) => item.id !== user.id);
			}
		} else {
			// 关注
			await userRelationsApi.followUser(user.id);
			user.isFollowing = true;
		}

		uni.showToast({
			title: user.isFollowing ? "关注成功" : "取消关注成功",
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

// 跳转到用户主页
const navigateToUserProfile = (userId) => {
	uni.navigateTo({
		url: `/pages/userProfile/userProfile?id=${userId}`,
	});
};

onMounted(() => {
	fetchUserList();
});
</script>

<style lang="scss">
.page {
	min-height: 100vh;
	background-color: #f5f5f5;
}

.tabs {
	display: flex;
	background-color: #fff;
	padding: 0 32rpx;
	border-bottom: 1rpx solid #eee;
	position: sticky;
	top: 0;
	z-index: 1;
}

.tab-item {
	position: relative;
	padding: 24rpx 32rpx;
	font-size: 32rpx;
	color: #999;

	&.active {
		color: #333;
		font-weight: 500;
	}
}

.tab-line {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 48rpx;
	height: 4rpx;
	background-color: #ffc107;
	border-radius: 2rpx;
}

.user-list {
	height: calc(100vh - 82rpx); // 减去 tabs 的高度
}

.user-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 24rpx 32rpx;
	background-color: #fff;
	margin-bottom: 2rpx;
}

.user-info {
	display: flex;
	align-items: center;
	flex: 1;
}

.avatar {
	width: 88rpx;
	height: 88rpx;
	border-radius: 44rpx;
	margin-right: 24rpx;
}

.user-detail {
	flex: 1;
}

.nickname {
	font-size: 32rpx;
	color: #333;
	margin-bottom: 8rpx;
}

.bio {
	font-size: 26rpx;
	color: #999;
}

.action-btn {
	padding: 12rpx 32rpx;
	border-radius: 32rpx;
	background-color: #ffc107;

	.btn-text {
		font-size: 28rpx;
		color: #fff;

		&.following {
			color: #666;
		}
	}

	&:active {
		opacity: 0.8;
	}
}

.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 120rpx 32rpx;
}

.empty-image {
	width: 240rpx;
	height: 240rpx;
	margin-bottom: 32rpx;
}

.empty-text {
	font-size: 28rpx;
	color: #999;
}

.loading-state {
	display: flex;
	justify-content: center;
	padding: 24rpx 0;
}

.loading-text {
	font-size: 26rpx;
	color: #999;
}
</style>
