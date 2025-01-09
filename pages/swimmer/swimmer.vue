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

					<view @tap="navigateToDetail(post.id, post.isFollowed)">
						<!-- 帖子内容 -->
						<view class="post-content">
							<text class="post-text">{{ post.content }}</text>
							<!-- 图片网格 -->
							<view
								class="image-grid"
								v-if="post.images && post.images.length > 0"
							>
								<view
									class="image-grid-item"
									:class="[
										post.images.length === 1 ? 'single-image' : '',
										post.images.length === 4 ? 'four-grid' : '',
										post.images.length > 4 ? 'multi-grid' : '',
									]"
									v-for="(image, imageIndex) in post.images"
									:key="imageIndex"
									@tap="previewImage(post.images, imageIndex)"
								>
									<image class="grid-image" :src="image" mode="aspectFill" />
								</view>
							</view>
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
						<!-- 左侧互动按钮组 -->
						<view class="left-actions">
							<view class="action-item" @tap="handleLike(post)">
								<image
									class="action-icon"
									:src="
										post.isLiked
											? '/static/icons/moments-like-active.png'
											: '/static/icons/moments-like.png'
									"
									mode="aspectFit"
								/>
								<text class="count">{{ post.likes }}</text>
							</view>
							<view
								class="action-item"
								@tap="navigateToDetail(post.id, post.isFollowed)"
							>
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

						<!-- 右侧更多按钮 -->
						<view class="action-item more-btn" @tap="handleMore(post)">
							<image
								class="action-icon"
								src="/static/icons/moments-more.png"
								mode="aspectFit"
							/>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载更多 -->
			<view v-if="loading" class="loading">加载中...</view>
		</scroll-view>

		<!-- 发布按钮 -->
		<view class="publish-btn" @tap="handlePublish">
			<image
				class="action-icon"
				src="/static/icons/publish.png"
				mode="aspectFit"
			/>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { momentApi } from "../../api/moments.js";
import { userRelationsApi } from "../../api/userRelations.js";

import emitter from "../../utils/eventBus";

// 状态定义
const tabConfig = [
	{ text: "推荐", type: "all" },
	{ text: "关注", type: "following" },
	{ text: "我的", type: "my" },
];
const tabs = tabConfig.map((tab) => tab.text); // 用于显示

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
		console.log(page.value);
		const params = {
			page: Number(page.value),
			limit: Number(pageSize),
			type: tabConfig[currentTab.value].type,
		};

		const res = await momentApi.getMoments(params);
		const currentUserId = JSON.parse(uni.getStorageSync("userInfo"))._id;
		if (res.data.code === 200) {
			// 处理返回的数据
			const formattedPosts = res.data.data.items.map((item) => ({
				id: item._id,
				username: item.author.nickname,
				authorId: item.author._id,
				avatar: item.author.avatarUrl,
				createTime: new Date(item.createdAt).toLocaleDateString("zh-CN"),
				content: item.content,
				image: item.images?.[0] || "",
				images: item.images || [],
				isFollowed: item.author.isFollowing,
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

// 处理更多按钮点击
const handleMore = (post) => {
	// 获取当前登录用户ID
	const currentUserId = JSON.parse(uni.getStorageSync("userInfo"))._id;
	// 判断是否是自己的动态
	const isOwnPost = post.authorId === currentUserId;

	// 根据是否是自己的动态显示不同的选项
	const itemList = isOwnPost ? ["删除"] : ["举报", "不感兴趣"];

	uni.showActionSheet({
		itemList,
		success: async function (res) {
			if (isOwnPost) {
				// 自己的动态
				switch (res.tapIndex) {
					case 0:
						// 删除动态
						try {
							await handleDeletePost(post.id);
						} catch (error) {
							console.error("删除动态失败:", error);
						}
						break;
					case 1:
						// 举报
						uni.showToast({
							title: "举报成功",
							icon: "success",
						});
						break;
				}
			} else {
				// 他人的动态
				switch (res.tapIndex) {
					case 0:
						// 举报
						uni.showToast({
							title: "举报成功",
							icon: "success",
						});
						break;
					case 1:
						// 不感兴趣
						uni.showToast({
							title: "已减少此类内容推荐",
							icon: "none",
						});
						break;
				}
			}
		},
	});
};

// 处理删除动态
const handleDeletePost = async (postId) => {
	// 显示确认弹窗
	uni.showModal({
		title: "提示",
		content: "确定要删除这条动态吗？",
		success: async function (res) {
			if (res.confirm) {
				try {
					const res = await momentApi.deleteMoment(postId);
					if (res.data.code === 200) {
						// 删除成功后从列表中移除该动态
						posts.value = posts.value.filter((p) => p.id !== postId);
						uni.showToast({
							title: "删除成功",
							icon: "success",
						});
					} else {
						throw new Error(res.data.message || "删除失败");
					}
				} catch (error) {
					console.error("删除动态失败:", error);
					uni.showToast({
						title: error.message || "删除失败",
						icon: "none",
					});
				}
			}
		},
	});
};

// 关注/取消关注
const handleFollow = async (post) => {
	console.log(post);
	try {
		// 判断是否是自己
		const userInfo = JSON.parse(uni.getStorageSync("userInfo") || "{}");
		// if (post.authorId === userInfo._id) {
		//   uni.showToast({
		//     title: '不能关注自己',
		//     icon: 'none'
		//   })
		//   return
		// }

		// 调用关注/取关API
		let res;
		if (!post.isFollowed) {
			res = await userRelationsApi.followUser(post.authorId);
		} else {
			res = await userRelationsApi.unfollowUser(post.authorId);
		}

		if (res.data.code === 200 || res.data.code === 201) {
			// 更新当前列表中该作者的所有动态的关注状态
			console.log(posts.value);
			posts.value = posts.value.map((p) => {
				if (p.authorId === post.authorId) {
					return {
						...p,
						isFollowed: !p.isFollowed,
					};
				}
				return p;
			});
		}
	} catch (error) {
		console.error("关注操作失败:", error);
		uni.showToast({
			title: error.message || "操作失败",
			icon: "none",
		});
	}
};

// 点赞
const handleLike = async (post) => {
	try {
		const res = await momentApi.likeMoment(post.id);
		if (res.data.code === 201) {
			const { liked } = res.data.data;
			// 创建新的 posts 数组，替换整个数组来触发响应式更新
			posts.value = posts.value.map((p) => {
				if (p.id === post.id) {
					return {
						...p,
						likes: p.likes + (liked ? 1 : -1),
						isLiked: liked,
					};
				}
				return p;
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

const navigateToDetail = (postId, isFollowed) => {
	uni.navigateTo({
		url: `/pages/swimmerDetail/swimmerDetail?id=${postId}&isFollowed=${isFollowed}`,
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
	emitter.on("updateSwimmerList", () => {
		console.log("收到更新事件");
		fetchMoments(true);
	});
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
		padding: 0rpx 40rpx;
		border-radius: 8rpx;
		background-color: #ffd700;
		color: #18191d;
		min-width: 120rpx;
		border: none;
		box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
		margin-right: 10rpx;

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

	.image-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
		margin-top: 30rpx;

		.image-grid-item {
			position: relative;
			width: calc((100% - 20rpx) / 3);
			height: 200rpx;

			&.single-image {
				width: 100%;
				height: 400rpx;

				.grid-image {
					border-radius: 12rpx;
				}
			}

			&.four-grid {
				width: calc((100% - 10rpx) / 2);
				height: 300rpx;
			}

			&.multi-grid {
				height: 200rpx;
			}

			.grid-image {
				width: 100%;
				height: 100%;
				border-radius: 8rpx;
			}
		}
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
	justify-content: space-between;
	align-items: center;
	padding: 16rpx 0;
}

.left-actions {
	display: flex;
	align-items: center;
	gap: 64rpx; // 设置图标之间的间距
}

.action-item {
	display: flex;
	align-items: center;

	.action-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.count {
		font-size: 24rpx;
		color: #666;
		margin-left: 8rpx;
	}
}

.more-btn {
	padding: 0 8rpx; // 给更多按钮添加一些点击区域
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
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #fff;
	font-size: 28rpx;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}
</style>
