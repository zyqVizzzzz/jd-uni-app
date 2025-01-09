// 动态详情页
<template>
	<view class="post-detail">
		<!-- 帖子内容区域 -->
		<view class="content-scroll">
			<!-- 用户信息 -->
			<view class="user-info">
				<image class="avatar" :src="post.avatar" mode="aspectFill" />
				<view class="user-detail">
					<text class="username">{{ post.username }}</text>
					<text class="location">{{ post.location }}</text>
				</view>
				<button
					class="follow-btn"
					:class="{ followed: post.isFollowed }"
					@tap="handleFollow"
				>
					{{ post.isFollowed ? "已关注" : "关注" }}
				</button>
			</view>

			<!-- 帖子内容 -->
			<view class="post-content">
				<text class="post-text">{{ post.content }}</text>
				<view class="image-grid" v-if="post.images && post.images.length">
					<image
						v-for="(image, index) in post.images"
						:key="index"
						:src="image"
						mode="aspectFill"
						class="post-image"
						@tap="previewImage(index)"
					/>
				</view>
			</view>

			<!-- 互动数据 -->
			<view class="interaction-bar">
				<!-- 左侧互动按钮组 -->
				<view class="left-actions">
					<view class="action-item" @tap="handleLike">
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
					<view class="action-item">
						<image
							class="action-icon"
							src="/static/icons/moments-comments.png"
							mode="aspectFit"
						/>
						<text class="count">{{ post.comments }}</text>
					</view>
					<view class="action-item" @tap="handleShare">
						<image
							class="action-icon"
							src="/static/icons/moments-share.png"
							mode="aspectFit"
						/>
						<text class="count">{{ post.shares }}</text>
					</view>
				</view>

				<!-- 右侧更多按钮 -->
				<view class="action-item more-btn" @tap="handleMore">
					<image
						class="action-icon"
						src="/static/icons/moments-more.png"
						mode="aspectFit"
					/>
				</view>
			</view>

			<!-- 评论列表 -->
			<view class="comment-list">
				<view
					v-for="comment in commentList"
					:key="comment._id"
					class="comment-item"
				>
					<image
						class="avatar"
						:src="comment.author.avatarUrl"
						mode="aspectFill"
					/>
					<view class="content" @tap="handleReply(comment)">
						<view class="user-info">
							<text v-if="!comment.parentComment" class="username">{{
								comment.author.nickname
							}}</text>
							<template v-else>
								<text class="username">{{ comment.author.nickname }}</text>
								<text class="reply-text">回复</text>
								<text class="username"
									>{{ comment.parentComment.author.nickname }}
								</text>
							</template>
						</view>
						<text class="time">{{ formatTime(comment.createdAt) }}</text>
						<text class="comment-text">{{ comment.content }}</text>
						<!-- <view class="actions">
							<text class="reply-btn" @tap="handleReply(comment)">回复</text>
							<text
								v-if="isCommentAuthor(comment)"
								class="delete-btn"
								@tap="handleDeleteComment(comment)"
								>删除</text
							>
						</view> -->
					</view>
				</view>
			</view>
		</view>

		<!-- 底部评论框 -->
		<view class="comment-box">
			<input
				class="comment-input"
				type="text"
				:placeholder="
					replyTo ? `回复 @${replyTo.author.nickname}` : '说点什么吧...'
				"
				v-model="commentText"
				:focus="inputFocus"
				@blur="handleInputBlur"
			/>
			<view v-if="replyTo" class="cancel-reply" @tap="cancelReply"
				>取消回复</view
			>
			<button
				class="send-btn"
				:class="{ active: commentText.length > 0 }"
				@tap="handleSendComment"
			>
				发送
			</button>
		</view>
	</view>
</template>

<script setup>
import { ref } from "vue";
import { onLoad, onHide } from "@dcloudio/uni-app";
import { momentApi } from "../../api/moments.js";
import { interactionsApi } from "../../api/interactions.js";
import { commentsApi } from "../../api/comments.js";
import { userRelationsApi } from "../../api/userRelations.js";
import emitter from "../../utils/eventBus";

// 定义帖子数据
const post = ref({});
const postId = ref("");
const isFollowed = ref(false);

// 评论列表状态
const commentList = ref([]);
const page = ref(1);
const pageSize = 20;
const loading = ref(false);
const hasMore = ref(true);

// 评论输入状态
const commentText = ref("");
const inputFocus = ref(false);
const replyTo = ref(null);

// 获取动态详情的函数
const fetchPostDetail = async (id) => {
	try {
		const res = await momentApi.getMomentDetail(id);
		const currentUserId = JSON.parse(uni.getStorageSync("userInfo"))._id;

		if (res.data.code === 200) {
			// 处理返回的数据
			const data = res.data.data;
			console.log(data);
			post.value = {
				id: data._id,
				username: data.author.nickname,
				avatar: data.author.avatarUrl,
				authorId: data.author._id,
				location: data.location || "",
				content: data.content,
				images: data.images || [],
				isFollowed: isFollowed.value,
				isLiked: data.likedBy?.includes(currentUserId),
				likes: data.likeCount,
				comments: data.commentCount,
				shares: data.shareCount || 0,
			};
		} else {
			throw new Error(res.data.message || "获取动态详情失败");
		}
	} catch (error) {
		console.error("获取动态详情失败:", error);
		uni.showToast({
			title: error.message || "获取动态详情失败",
			icon: "none",
		});
	}
};

// 获取评论列表
const fetchComments = async (id) => {
	try {
		const res = await commentsApi.getComments(id);
		if (res.data.code === 200) {
			commentList.value = res.data.data;
			commentList.value.forEach((item) => {
				console.log(item.author.nickname);
			});
		}
	} catch (error) {
		uni.showToast({ title: "获取评论失败", icon: "none" });
	}
};

// 发送评论
const handleSendComment = async () => {
	if (!commentText.value.trim()) return;

	try {
		let res;
		if (replyTo.value && replyTo.value._id) {
			// 回复评论
			console.log(replyTo.value._id);
			res = await commentsApi.replyComment(replyTo.value._id, {
				content: commentText.value,
			});
		} else {
			// 发表评论
			res = await commentsApi.createComment(post.value.id, {
				content: commentText.value,
			});
		}

		if (res.data.code === 201) {
			await fetchComments(post.value.id);
			commentText.value = "";
			replyTo.value = null;
			post.value.comments++;

			uni.showToast({
				title: "发送成功",
				icon: "success",
			});
		}
	} catch (error) {
		uni.showToast({
			title: "发送失败",
			icon: "none",
		});
	}
};

const handleMore = () => {
	// 获取当前登录用户ID
	const currentUserId = JSON.parse(uni.getStorageSync("userInfo"))._id;
	// 判断是否是自己的动态
	console.log(post.value);
	const isOwnPost = post.value.authorId === currentUserId;

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
							await handleDeletePost(post.value.id);
						} catch (error) {
							console.error("删除动态失败:", error);
						}
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
	uni.showModal({
		title: "提示",
		content: "确定要删除这条动态吗？",
		success: async function (res) {
			if (res.confirm) {
				try {
					const res = await momentApi.deleteMoment(postId);
					if (res.data.code === 200) {
						uni.showToast({
							title: "删除成功",
							icon: "success",
						});
						// 返回上一页
						emitter.emit("updateSwimmerList");
						uni.switchTab({
							url: "/pages/swimmer/swimmer",
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

// 处理评论点赞
const handleCommentLike = async (comment) => {
	try {
		const res = await interactionsApi.toggleCommentLike(comment._id);
		if (res.statusCode === 200) {
			comment.isLiked = !comment.isLiked;
			comment.likeCount += comment.isLiked ? 1 : -1;
		}
	} catch (error) {
		console.error("操作失败:", error);
		uni.showToast({
			title: "操作失败",
			icon: "none",
		});
	}
};

// 回复评论
const handleReply = (comment) => {
	replyTo.value = comment;
	inputFocus.value = true;
};

// 取消回复
const cancelReply = () => {
	replyTo.value = null;
};

// 删除评论
const handleDeleteComment = async (comment) => {
	try {
		const [confirmRes] = await uni.showModal({
			title: "确认删除",
			content: "确定要删除这条评论吗？",
		});

		if (confirmRes.confirm) {
			const res = await interactionsApi.deleteComment(comment._id);
			if (res.statusCode === 200) {
				commentList.value = commentList.value.filter(
					(item) => item._id !== comment._id
				);
				post.value.comments--;
				uni.showToast({
					title: "删除成功",
					icon: "success",
				});
			}
		}
	} catch (error) {
		uni.showToast({
			title: "删除失败",
			icon: "none",
		});
	}
};

// 检查是否是评论作者
const isCommentAuthor = (comment) => {
	const currentUserId = uni.getStorageSync("userId");
	return comment.author._id === currentUserId;
};

// 格式化时间
const formatTime = (time) => {
	const date = new Date(time);
	const hours = date.getHours().toString().padStart(2, "0");
	const minutes = date.getMinutes().toString().padStart(2, "0");
	return `${date.getMonth() + 1}月${date.getDate()}日 ${hours}:${minutes}`;
};

// 输入框失焦
const handleInputBlur = () => {
	inputFocus.value = false;
};

// 关注/取消关注
const handleFollow = async () => {
	try {
		// 判断是否是自己
		const userInfo = JSON.parse(uni.getStorageSync("userInfo") || "{}");

		// 调用关注/取关API
		let res;
		if (!post.value.isFollowed) {
			res = await userRelationsApi.followUser(post.value.authorId);
		} else {
			res = await userRelationsApi.unfollowUser(post.value.authorId);
		}

		if (res.data.code === 200 || res.data.code === 201) {
			// 更新动态详情中的关注状态
			post.value.isFollowed = !post.value.isFollowed;

			// 发送更新事件到动态列表页面
			emitter.emit("updateSwimmerList");
		} else {
			throw new Error(res.data.message || "操作失败");
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
const handleLike = async () => {
	try {
		const res = await momentApi.likeMoment(post.value.id);
		if (res.data.code === 201) {
			const { liked } = res.data.data;
			post.value.likes += liked ? 1 : -1;
			post.value.isLiked = liked;

			// 发送更新事件
			emitter.emit("updateSwimmerList");
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
const handleShare = () => {
	uni.showShareMenu({
		withShareTicket: true,
		menus: ["shareAppMessage", "shareTimeline"],
	});
};

// 预览图片
const previewImage = (index) => {
	uni.previewImage({
		current: post.value.images[index],
		urls: post.value.images,
	});
};

// 页面加载时获取动态ID并请求数据
onLoad((options) => {
	if (options.id) {
		postId.value = options.id;
		isFollowed.value = options.isFollowed === "true" ? true : false;
		console.log(isFollowed.value);
		fetchPostDetail(options.id);
		fetchComments(options.id);
	}
});

onHide(() => {
	emitter.emit("updateSwimmerList");
});
</script>

<style lang="scss" scoped>
page {
	background-color: #fff;
}
.post-detail {
	display: flex;
	flex-direction: column;
	min-height: 100vh;
	background-color: #fff;
	padding-top: 20rpx;
	position: relative; // 添加相对定位
}

.content-scroll {
	flex: 1;
	height: calc(100vh - 20rpx); // 减去顶部padding的高度
	background-color: #fff;
}

.user-info {
	display: flex;
	align-items: center;
	padding: 0 20rpx;

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

		.location {
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
	padding: 0 20rpx;
	margin-top: 20rpx;

	.post-text {
		font-size: 28rpx;
		color: #333;
		line-height: 1.6;
		margin-bottom: 20rpx;
	}

	.image-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8rpx;

		.post-image {
			width: 100%;
			height: 220rpx;
			border-radius: 8rpx;
			margin-top: 20rpx;
		}
	}
}

.interaction-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 36rpx 20rpx 16rpx;
	border-bottom: 1rpx solid #f0f0f0;
}

.left-actions {
	display: flex;
	align-items: center;
	gap: 64rpx;
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
	padding: 0 8rpx;
}

.comment-list {
	padding: 20rpx;

	.comment-item {
		display: flex;
		padding: 20rpx;

		.avatar {
			width: 64rpx;
			height: 64rpx;
			border-radius: 50%;
			margin-right: 20rpx;
			flex-shrink: 0;
		}

		.content {
			flex: 1;

			.user-info {
				display: flex;
				align-items: center;
				gap: 8rpx;
				margin-bottom: 8rpx;

				.username {
					font-size: 28rpx;
					color: #333;
					font-weight: 500;
				}

				.reply-text {
					font-size: 24rpx;
					color: #999;
				}
			}

			.time {
				font-size: 24rpx;
				color: #999;
				display: block;
				margin-bottom: 12rpx;
				margin-left: 20rpx;
			}

			.comment-text {
				font-size: 28rpx;
				color: #333;
				line-height: 1.4;
				display: block;
				margin-bottom: 12rpx;
				margin-left: 20rpx;
			}

			.actions {
				display: flex;
				gap: 24rpx;

				.reply-btn,
				.delete-btn {
					font-size: 24rpx;
					color: #666;
				}

				.delete-btn {
					color: #ff4d4f;
				}
			}
		}
	}
}

.comment-box {
	position: fixed; // 改为固定定位
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	padding: 20rpx;
	border-top: 1rpx solid #f0f0f0;
	background-color: #fff;
	z-index: 100; // 确保在其他内容之上

	.comment-input {
		flex: 1;
		height: 72rpx;
		background-color: #f5f5f5;
		border-radius: 36rpx;
		padding: 0 30rpx;
		font-size: 28rpx;
		margin-right: 20rpx;
	}

	.emoji-btn {
		font-size: 48rpx;
		padding: 0 20rpx;
	}

	.send-btn {
		font-size: 28rpx;
		color: #999;
		background: none;
		padding: 0;
		margin: 0;

		&.active {
			color: #ffd700;
		}

		&::after {
			border: none;
		}
	}
}

// 适配 iPhone X 等机型的底部安全区域
@supports (bottom: env(safe-area-inset-bottom)) {
	.comment-box {
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
	}

	.content-scroll {
		padding-bottom: calc(112rpx + env(safe-area-inset-bottom));
	}
}

.reply-info {
	font-size: 24rpx;
	color: #999;
	margin: 8rpx 0;

	.reply-username {
		color: #07c160;
	}

	.reply-content {
		color: #666;
	}
}

.comment-actions {
	display: flex;
	align-items: center;
	gap: 20rpx;

	.action-item {
		display: flex;
		align-items: center;
		gap: 4rpx;
	}
}

.comment-delete {
	font-size: 24rpx;
	color: #ff4d4f;
}

.cancel-reply {
	font-size: 24rpx;
	color: #999;
	padding: 0 20rpx;
}

.load-more {
	text-align: center;
	padding: 20rpx;
	color: #999;
	font-size: 24rpx;
}
</style>
