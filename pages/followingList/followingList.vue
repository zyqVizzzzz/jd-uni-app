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

		<!-- 搜索框 -->
		<!-- <view class="search-box">
			<view class="search-input-wrap">
				<input
					type="text"
					class="search-input"
					v-model="searchKeyword"
					placeholder="搜索"
					placeholder-class="search-placeholder"
					confirm-type="search"
					@confirm="handleSearch"
				/>
				<view class="search-clear" v-if="searchKeyword" @tap="clearSearch">
					<text class="clear-icon">×</text>
				</view>
			</view>
		</view> -->

		<!-- 用户列表 -->
		<scroll-view
			scroll-y
			class="user-list"
			@scrolltolower="loadMore"
			:refresher-enabled="true"
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh"
		>
			<view v-if="filteredList.length > 0">
				<view
					v-for="(user, index) in filteredList"
					:key="index"
					class="user-item"
				>
					<view class="user-info" @tap="navigateToUserProfile(user.id)">
						<image
							:src="user.avatarUrl || '/static/avatar.png'"
							class="avatar"
							mode="aspectFill"
						/>
						<view class="user-detail">
							<text class="nickname">{{ user.nickname || "未设置昵称" }}</text>
						</view>
					</view>
					<view
						class="action-btn"
						:class="{ 'btn-following': user.isFollowing }"
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
			<view class="loading-state" v-if="isLoading && filteredList.length > 0">
				<text class="loading-text">加载中...</text>
			</view>
		</scroll-view>
	</view>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { request } from "@/utils/require";
import { userRelationsApi } from "@/api/userRelations.js";

const activeTab = ref("following");
const searchKeyword = ref("");
const list = ref([]);
const page = ref(1);
const pageSize = ref(20);
const isLoading = ref(false);
const isRefreshing = ref(false);
const hasMore = ref(true);

// 搜索过滤后的列表
const filteredList = computed(() => {
	if (!searchKeyword.value) return list.value;
	return list.value.filter((user) =>
		user.nickname.toLowerCase().includes(searchKeyword.value.toLowerCase())
	);
});

// 切换标签
const switchTab = (tab) => {
	activeTab.value = tab;
	page.value = 1;
	list.value = [];
	fetchUserList();
};

// 获取用户列表
const fetchUserList = async () => {
	if (isLoading.value || (!hasMore.value && page.value > 1)) return;

	isLoading.value = true;
	try {
		const endpoint = `/user-relations/${activeTab.value}`;
		const res = await request({
			url: endpoint,
			data: {
				page: page.value,
				pageSize: pageSize.value,
			},
		});

		if (res.statusCode === 200) {
			const newList = res.data.data.map((item) => {
				const user =
					activeTab.value === "following" ? item.toUser : item.fromUser;
				return {
					id: user._id,
					nickname: user.nickname,
					avatarUrl: user.avatarUrl,
					bio: user.bio,
					isFollowing: true,
				};
			});

			if (page.value === 1) {
				list.value = newList;
			} else {
				list.value = [...list.value, ...newList];
			}

			hasMore.value = newList.length === pageSize.value;
			page.value += 1;
		}
	} catch (error) {
		console.error("获取用户列表失败:", error);
		uni.showToast({
			title: "获取列表失败",
			icon: "none",
		});
	} finally {
		isLoading.value = false;
		isRefreshing.value = false;
	}
};

// 搜索处理
const handleSearch = () => {
	page.value = 1;
	fetchUserList();
};

// 下拉刷新
const onRefresh = () => {
	isRefreshing.value = true;
	page.value = 1;
	hasMore.value = true;
	fetchUserList();
};

// 加载更多
const loadMore = () => {
	if (hasMore.value) {
		fetchUserList();
	}
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
	background-color: #fff;
}

.tabs {
	display: flex;
	justify-content: center;
	background-color: #fff;
	position: sticky;
	top: 0;
	z-index: 1;
	box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.02);
}

.tab-item {
	position: relative;
	padding: 28rpx 40rpx;
	margin: 0 20rpx;
	font-size: 30rpx;
	color: #666;
	transition: all 0.3s;

	&.active {
		color: #333;
		font-weight: 600;
	}
}

.tab-line {
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 48rpx;
	height: 6rpx;
	background-color: #333;
	border-radius: 4rpx;
	transition: all 0.3s ease;
}

.search-box {
	padding: 20rpx 32rpx;
	background-color: #fff;
}

.search-input-wrap {
	background-color: #f5f5f5;
	border-radius: 36rpx;
	height: 72rpx;
}

.search-input {
	width: 100%;
	height: 72rpx;
	font-size: 28rpx;
	color: #333;
	text-align: center;
}

.search-placeholder {
	color: #999;
	text-align: center;
}

.user-list {
	height: calc(100vh - 180rpx); // 减去 tabs 和 search-box 的高度
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

	&.btn-following {
		background-color: #f5f5f5;
	}

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
