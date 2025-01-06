<template>
	<view class="swimmer-community">
		<!-- 顶部导航栏 -->
		<view class="nav-tabs">
			<view
				v-for="(tab, index) in tabs"
				:key="index"
				class="tab-item"
				:class="{ active: currentTab === index }"
				@tap="handleTabChange(index)"
			>
				{{ tab }}
			</view>
		</view>

		<!-- 内容区域 -->
		<scroll-view
			scroll-y
			class="content-scroll"
			@scrolltolower="loadMore"
			refresher-enabled
			:refresher-triggered="isRefreshing"
			@refresherrefresh="onRefresh"
		>
			<!-- 帖子列表 -->
			<view class="post-list">
				<view v-for="(post, index) in posts" :key="index" class="post-item">
					<!-- 用户信息 -->
					<view class="user-info">
						<image class="avatar" :src="post.avatar" mode="aspectFill" />
						<view class="user-detail">
							<text class="username">{{ post.username }}</text>
							<text class="post-time">{{ post.createTime }}</text>
						</view>
						<button
							class="follow-btn"
							:class="{ followed: post.isFollowed }"
							@tap="handleFollow(post)"
						>
							{{ post.isFollowed ? "已关注" : "关注" }}
						</button>
					</view>

					<view @tap="navigateToDetail(post.id)">
						<!-- 帖子内容 -->
						<view class="post-content">
							<text class="post-text">{{ post.content }}</text>
							<image
								v-if="post.image"
								class="post-image"
								:src="post.image"
								mode="aspectFill"
								@tap="previewImage(post.image)"
							/>
						</view>
						<!-- 运动数据卡片 -->
						<view v-if="post.sportData" class="sport-data">
							<view class="data-item">
								<text class="data-value">{{ post.sportData.distance }}M</text>
								<text class="data-label">距离</text>
							</view>
							<view class="data-item">
								<text class="data-value">{{ post.sportData.duration }}</text>
								<text class="data-label">时间</text>
							</view>
							<view class="data-item">
								<text class="data-value">{{ post.sportData.pace }}</text>
								<text class="data-label">平均百米配速</text>
							</view>
							<view class="data-item">
								<text class="data-value"
									>{{ post.sportData.calories }} KCAL</text
								>
								<text class="data-label">消耗热量</text>
							</view>
						</view>
					</view>
					<!-- 互动区域 -->
					<view class="interaction-bar">
						<view class="action-item" @tap="handleLike(post)">
							<image
								class="action-icon"
								:src="
									post.isLiked
										? '/static/icons/moments-share.png'
										: '/static/icons/moments-like.png'
								"
								mode="aspectFit"
							/>
							<text class="count">{{ post.likes }}</text>
						</view>
						<view class="action-item" @tap="navigateToDetail(post.id)">
							<image
								class="action-icon"
								src="/static/icons/moments-comments.png"
								mode="aspectFit"
							/>
							<text class="count">{{ post.comments }}</text>
						</view>
						<view class="action-item" @tap="handleShare(post)">
							<image
								class="action-icon"
								src="/static/icons/moments-share.png"
								mode="aspectFit"
							/>
							<text class="count">{{ post.shares }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载更多 -->
			<view v-if="loading" class="loading">加载中...</view>
		</scroll-view>

		<!-- 发布按钮 -->
		<view class="publish-btn" @tap="handlePublish">发布</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { momentApi } from "../../api/moments.js";

// 状态定义
const tabs = ["推荐", "关注", "我的"];
const currentTab = ref(0);
const posts = ref([]);
const loading = ref(false);
const isRefreshing = ref(false);
const page = ref(1);
const pageSize = 20;

// 获取动态列表
const fetchMoments = async (isRefresh = false) => {
	try {
		if (isRefresh) {
			page.value = 1;
		}

		const params = {
			page: page.value,
			limit: pageSize,
			type: tabs[currentTab.value].toLowerCase(),
		};

		const res = await momentApi.getMoments(params);
		const currentUserId = JSON.parse(uni.getStorageSync("userInfo"))._id;
		if (res.data.code === 200) {
			// 处理返回的数据
			const formattedPosts = res.data.data.items.map((item) => ({
				id: item._id,
				username: item.author.nickname,
				avatar: item.author.avatarUrl,
				createTime: new Date(item.createdAt).toLocaleDateString("zh-CN"),
				content: item.content,
				image: item.images?.[0] || "",
				images: item.images || [],
				isFollowed: false,
				isLiked: item.likedBy?.includes(currentUserId), // 添加这个字段，需要后端返回当前用户是否点赞
				likes: item.likeCount,
				comments: item.commentCount,
				shares: 0,
				sportData: item.metadata?.sportData,
			}));

			if (isRefresh) {
				posts.value = formattedPosts;
			} else {
				posts.value = [...posts.value, ...formattedPosts];
			}

			page.value++;
		} else {
			throw new Error(res.data.message || "获取动态列表失败");
		}
	} catch (error) {
		console.error("获取动态列表失败:", error);
		uni.showToast({
			title: error.message || "获取动态列表失败",
			icon: "none",
		});
	}
};

// 下拉刷新
const onRefresh = async () => {
	isRefreshing.value = true;
	try {
		await fetchMoments(true);
	} catch (error) {
		console.error("刷新失败:", error);
	} finally {
		isRefreshing.value = false;
	}
};

// 加载更多
const loadMore = async () => {
	if (!loading.value) {
		loading.value = true;
		try {
			await fetchMoments();
		} finally {
			loading.value = false;
		}
	}
};

// 切换标签
const handleTabChange = (index) => {
	currentTab.value = index;
	onRefresh();
};

// 关注/取消关注
const handleFollow = (post) => {
	post.isFollowed = !post.isFollowed;
	uni.showToast({
		title: post.isFollowed ? "关注成功" : "已取消关注",
		icon: "success",
	});
};

// 点赞
const handleLike = async (post) => {
	try {
		const res = await momentApi.likeMoment(post.id);
		// 根据后端返回的 liked 状态更新点赞数
		if (res.data.code === 201) {
			// 假设成功响应的状态码是 200
			const { liked } = res.data.data; // 从响应中获取点赞状态
			post.likes += liked ? 1 : -1; // 根据状态更新点赞数

			// 可选：更新点赞状态的视觉反馈
			uni.showToast({
				title: liked ? "点赞成功" : "取消点赞",
				icon: "success",
			});
		} else {
			throw new Error(res.data.message || "操作失败");
		}
	} catch (error) {
		console.error("点赞操作失败:", error);
		uni.showToast({
			title: error.message || "操作失败",
			icon: "none",
		});
	}
};

// 分享
const handleShare = (post) => {
	uni.showShareMenu({
		withShareTicket: true,
		menus: ["shareAppMessage", "shareTimeline"],
	});
};

// 跳转到发布页面
const handlePublish = () => {
	uni.navigateTo({
		url: "/pages/publish/publish",
	});
};

const navigateToDetail = (postId) => {
	uni.navigateTo({
		url: `/pages/swimmerDetail/swimmerDetail?id=${postId}`,
	});
};

// 预览图片
const previewImage = (url) => {
	uni.previewImage({
		urls: [url],
	});
};

onMounted(() => {
	fetchMoments(true);
});
</script>

<style lang="scss" scoped>
.swimmer-community {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #f8f8f8;
}

.nav-tabs {
	display: flex;
	justify-content: space-around;
	padding: 20rpx 0;
	background-color: #fff;
	position: sticky;
	top: 0;
	z-index: 1;

	.tab-item {
		font-size: 28rpx;
		color: #666;
		padding: 10rpx 20rpx;

		&.active {
			color: #333;
			font-weight: bold;
			position: relative;

			&::after {
				content: "";
				position: absolute;
				bottom: -10rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 40rpx;
				height: 4rpx;
				background-color: #ffd700;
				border-radius: 2rpx;
			}
		}
	}
}

.content-scroll {
	flex: 1;
	height: 0;
}

.post-item {
	margin-bottom: 20rpx;
	background-color: #fff;
	padding: 20rpx;
}

.user-info {
	display: flex;
	align-items: center;
	margin-bottom: 20rpx;

	.avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}

	.user-detail {
		flex: 1;

		.username {
			font-size: 28rpx;
			font-weight: bold;
			color: #333;
			display: block;
		}

		.post-time {
			font-size: 24rpx;
			color: #999;
		}
	}

	.follow-btn {
		font-size: 24rpx;
		padding: 4rpx 30rpx;
		border-radius: 32rpx;
		background-color: #ffd700;
		color: #fff;
		min-width: 120rpx;
		border: none;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);

		&.followed {
			background-color: #f0f0f0;
			color: #666;
		}
	}
}

button::after {
	border: none;
}

.post-content {
	margin-bottom: 20rpx;

	.post-text {
		font-size: 28rpx;
		color: #333;
		line-height: 1.6;
		margin-bottom: 20rpx;
	}

	.post-image {
		width: 100%;
		height: 400rpx;
		border-radius: 12rpx;
		margin-top: 20rpx;
	}
}

.sport-data {
	display: flex;
	justify-content: space-between;
	background-color: #f8f8f8;
	padding: 20rpx;
	border-radius: 12rpx;
	margin-bottom: 20rpx;

	.data-item {
		text-align: center;

		.data-value {
			font-size: 32rpx;
			color: #333;
			font-weight: bold;
			display: block;
			margin-bottom: 8rpx;
		}

		.data-label {
			font-size: 24rpx;
			color: #999;
		}
	}
}

.interaction-bar {
	display: flex;
	border-top: 1rpx solid #f0f0f0;
	padding-top: 20rpx;

	.action-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8rpx;

		.action-icon {
			width: 40rpx;
			height: 40rpx;
		}

		.count {
			font-size: 24rpx;
			color: #999;
		}
	}
}

.loading {
	text-align: center;
	padding: 20rpx;
	color: #999;
	font-size: 24rpx;
}

.publish-btn {
	position: fixed;
	right: 40rpx;
	bottom: 140rpx;
	width: 120rpx;
	height: 120rpx;
	background-color: #ffd700;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 28rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}
</style>
