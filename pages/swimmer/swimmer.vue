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

						<!-- 互动区域 -->
						<view class="interaction-bar">
							<view class="action-item" @tap="handleLike(post)">
								<text class="icon">❤️</text>
								<text class="count">{{ post.likes }}</text>
							</view>
							<view class="action-item" @tap="handleComment(post)">
								<text class="icon">💬</text>
								<text class="count">{{ post.comments }}</text>
							</view>
							<view class="action-item" @tap="handleShare(post)">
								<text class="icon">↗️</text>
								<text class="count">{{ post.shares }}</text>
							</view>
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

// 模拟数据
const mockPosts = [
	{
		id: 1,
		username: "徐文",
		avatar: "/static/avatar.jpg",
		createTime: "2024年4月23日",
		content: "享受失重，掌控自由！",
		image: "/static/avatar.jpg",
		isFollowed: false,
		likes: 340,
		comments: 340,
		shares: 10,
	},
	{
		id: 2,
		username: "李星",
		avatar: "/static/avatar.jpg",
		createTime: "2024年4月23日",
		content: "在水里，才自由！！！",
		image: "",
		isFollowed: true,
		likes: 340,
		comments: 340,
		shares: 10,
		sportData: {
			distance: "275",
			duration: "1:13:41",
			pace: "26'47\"",
			calories: "99",
		},
	},
	{
		id: 3,
		username: "张教练",
		avatar: "/static/avatar.jpg",
		createTime: "2024年4月23日",
		content: "今天的训练很充实，学员们都很给力！",
		image: "/static/avatar.jpg",
		isFollowed: false,
		likes: 288,
		comments: 120,
		shares: 15,
	},
];

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
				isFollowed: false, // 这个状态需要后端提供
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
		uni.showToast({
			title: "刷新成功",
			icon: "success",
		});
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
		if (res.data.code === 200) {
			post.likes += 1;
			uni.showToast({
				title: "点赞成功",
				icon: "success",
			});
		} else {
			throw new Error(res.data.message || "点赞失败");
		}
	} catch (error) {
		console.error("点赞失败:", error);
		uni.showToast({
			title: error.message || "点赞失败",
			icon: "none",
		});
	}
};

// 评论
const handleComment = (post) => {
	uni.showToast({
		title: "评论功能开发中",
		icon: "none",
	});
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

		.icon {
			font-size: 32rpx;
			margin-right: 8rpx;
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
