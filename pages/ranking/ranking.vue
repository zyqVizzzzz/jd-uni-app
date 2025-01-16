<template>
	<view class="ranking-page">
		<!-- 顶部选项区 -->
		<view class="header">
			<text class="rules" @tap="generateTest">评选规则</text>
			<view class="location-toggle">
				<!-- <view
					class="toggle-item"
					:class="{ active: selectedLocation === 'national' }"
					@tap="selectLocation('national')"
				>
					全国
				</view>
				<view
					class="toggle-item"
					:class="{ active: selectedLocation === 'local' }"
					@tap="handleLocationClick"
				>
					{{ currentCity }}
					<text class="arrow">▼</text>
				</view> -->
			</view>
		</view>

		<!-- 城市选择弹框 -->
		<uni-popup ref="cityPopup" type="center" background-color="#fff">
			<view class="city-selector">
				<view class="city-header">
					<text class="title">选择城市</text>
					<text class="close" @tap="closeCityPopup">×</text>
				</view>
				<scroll-view scroll-y class="city-list">
					<view
						v-for="city in cities"
						:key="city.cityCode"
						class="city-item"
						@tap="selectCity(city)"
					>
						<text class="city-name">{{ city.city }}</text>
						<text class="user-count">{{ city.userCount }}位用户</text>
					</view>
				</scroll-view>
			</view>
		</uni-popup>

		<!-- 时间维度切换 -->
		<view class="time-tabs">
			<text
				class="tab-item"
				:class="{ active: activeTab === 'day' }"
				@tap="selectTab('day')"
			>
				日榜
			</text>
			<text
				class="tab-item"
				:class="{ active: activeTab === 'month' }"
				@tap="selectTab('month')"
			>
				月榜
			</text>
			<text
				class="tab-item"
				:class="{ active: activeTab === 'year' }"
				@tap="selectTab('year')"
			>
				年榜
			</text>
		</view>

		<!-- TOP3 排名展示 -->
		<view class="top-three">
			<template v-for="(user, index) in displayTopThree" :key="index">
				<view
					v-if="user"
					:class="[
						'rank-flag',
						user.rank === 1 ? 'yellow' : user.rank === 2 ? 'orange' : 'pink',
					]"
				>
					<view class="circle-outer">
						<view class="circle-wrapper">
							<image
								:src="user.avatar || '/static/avatar-default@3x.png'"
								class="avatar"
								mode="aspectFill"
							/>
						</view>
					</view>
					<view class="rank-num">{{ user.rank }}</view>
					<text class="name">{{ user.name }}</text>
					<text class="score">{{ user.score }}</text>
					<text class="unit">总距离 (千米)</text>
					<text
						class="btn-follow"
						@tap="handleFollow(user)"
						:class="{ followed: user.isFollowing }"
						>{{ user.isFollowing ? "已关注" : "关注" }}</text
					>
				</view>
				<view
					v-else
					:class="[
						'rank-flag empty',
						index === 0 ? 'orange' : index === 1 ? 'yellow' : 'pink',
					]"
				>
					<view class="circle-outer">
						<view class="circle-wrapper">
							<image
								:src="user.avatar || '/static/avatar-default@3x.png'"
								class="avatar"
								mode="aspectFill"
							/>
						</view>
					</view>
					<view class="rank-num">{{
						index === 0 ? 2 : index === 1 ? 1 : 3
					}}</view>
					<text class="name">暂无</text>
					<text class="score">0</text>
					<text class="unit">总距离 (千米)</text>
					<text class="btn-follow">关注</text>
				</view>
			</template>
		</view>

		<!-- 其他排名列表 -->
		<view class="rank-list" v-if="rankingList.length > 0">
			<view class="rank-item" v-for="item in rankingList" :key="item.rank">
				<text class="rank-num">{{ item.rank }}</text>
				<image
					:src="item.avatar || '/static/avatar-default@3x.png'"
					class="avatar"
					mode="aspectFill"
				/>
				<view class="info">
					<text class="name">{{ item.name }}</text>
					<text class="distance">总距离 {{ item.distance }} 千米</text>
				</view>
			</view>
		</view>

		<!-- 固定在底部的当前用户排名 -->
		<view class="current-user">
			<text class="rank-num">{{ currentUserRank.rank }}</text>
			<image
				:src="currentUserRank.avatar || '/static/avatar-default@3x.png'"
				class="avatar"
				mode="aspectFill"
			/>
			<view class="info">
				<text class="name">{{ currentUserRank.name }}</text>
				<text class="distance">总距离 {{ currentUserRank.distance }}千米</text>
			</view>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { request } from "@/utils/require";
import { onShow } from "@dcloudio/uni-app";
import { userRelationsApi } from "../../api/userRelations.js";

const selectedLocation = ref("national");
const currentCity = ref("杭州"); // 测试阶段默认设置为杭州
const currentProvince = ref("浙江省"); // 添加省份字段

const activeTab = ref("day");
const rankingList = ref([]);
const currentUserRank = ref(null);
const topThree = ref([]);

const cityPopup = ref(null);
const cities = ref([]); // 城市列表
const clickCount = ref(0); // 记录点击次数
const clickTimer = ref(null); // 用于清除点击计时器
const isSelectingCity = ref(false);
const selectedCityCode = ref("");

// 计算属性：重新排序 top3，让第一名在中间
const displayTopThree = computed(() => {
	if (!topThree.value || !Array.isArray(topThree.value)) {
		return [];
	}

	// 如果有数据，始终返回原始顺序
	return topThree.value;
});

// 处理地区点击
const handleLocationClick = async () => {
	if (!isSelectingCity.value) {
		// 第一次点击：切换到当前城市
		selectLocation("local");
		isSelectingCity.value = true;
	} else {
		// 第二次点击：打开城市选择
		await openCitySelector();
	}
};

// 打开城市选择器
const openCitySelector = async () => {
	try {
		const res = await request({
			url: "/rankings/cities",
		});

		if (res.data.code === 200) {
			cities.value = res.data.data;
			cityPopup.value.open();
		}
	} catch (error) {
		console.error("获取城市列表失败:", error);
		uni.showToast({
			title: "获取城市列表失败",
			icon: "none",
		});
	}
};

const deleteAll = async () => {
	const res = await request({
		url: "/rankings/delete-all",
		method: "POST",
	});
};

// 选择城市
const selectCity = (cityData) => {
	currentCity.value = cityData.city;
	selectedCityCode.value = cityData.cityCode;
	closeCityPopup();
	// 更新排行榜数据，现在传入cityCode
	fetchRankings(activeTab.value);
};

const closeCityPopup = () => {
	cityPopup.value.close();
	isSelectingCity.value = false;
};

const selectLocation = (type) => {
	if (type === "national") {
		isSelectingCity.value = false;
		selectedCityCode.value = ""; // 重置cityCode
	}
	selectedLocation.value = type;
	fetchRankings(activeTab.value);
};

const generateTest = async () => {
	const res = await request({
		url: "/rankings/generate-mock-data",
		method: "POST",
	});
};

// 修改 fetchRankings 函数以支持地区筛选
const fetchRankings = async (tab = "daily") => {
	try {
		let res;

		if (selectedLocation.value === "national") {
			// 获取全国排行榜
			res = await request({
				url: "/rankings",
				data: {
					type: tab,
					limit: 20,
				},
			});
		} else {
			// 获取地区排行榜
			res = await request({
				url: "/rankings/region",
				data: {
					type: tab,
					city: currentCity.value,
					cityCode: selectedCityCode.value, // 添加cityCode参数
				},
			});
		}

		if (res.data.code === 200) {
			const rankings = res.data.data;

			// 处理前三名数据
			topThree.value = rankings.slice(0, 3).map((item) => ({
				name: item.user_id.nickname,
				avatar: item.user_id.avatarUrl,
				isFollowing: item.user_id.isFollowing,
				score: ((item.total_distance || 0) / 1000).toFixed(2),
				rank: item.rank,
				userId: item.user_id._id,
			}));

			// 处理第4名之后的数据
			rankingList.value = rankings.slice(3).map((item) => ({
				name: item.user_id.nickname,
				avatar: item.user_id.avatarUrl,
				isFollowing: item.user_id.isFollowing,
				distance: ((item.total_distance || 0) / 1000).toFixed(2),
				rank: item.rank,
				userId: item.user_id._id,
			}));
		}
	} catch (error) {
		console.error("获取排行榜失败:", error);
		uni.showToast({
			title: "获取排行榜失败",
			icon: "none",
		});
	}
};

// 关注/取消关注
const handleFollow = async (user) => {
	try {
		// 调用关注/取关API
		let res;
		if (!user.isFollowing) {
			res = await userRelationsApi.followUser(user.userId);
		} else {
			res = await userRelationsApi.unfollowUser(user.userId);
		}

		if (res.data.code === 200 || res.data.code === 201) {
			// 更新排行榜中的关注状态
			topThree.value = topThree.value.map((item) => {
				if (item.userId === user.userId) {
					return { ...item, isFollowing: !item.isFollowing };
				}
				return item;
			});

			// 更新其他排名列表
			rankingList.value = rankingList.value.map((item) => {
				if (item.userId === user.userId) {
					return { ...item, isFollowing: !item.isFollowing };
				}
				return item;
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

// 获取当前用户排名
const fetchCurrentUserRank = async () => {
	try {
		const res = await request({
			url: "/rankings/me",
			data: {
				type:
					activeTab.value === "day"
						? "daily"
						: activeTab.value === "month"
						? "monthly"
						: "yearly",
			},
		});

		if (res.data.code === 200) {
			const userRank = res.data.data;
			if (userRank) {
				currentUserRank.value = {
					rank: userRank.rank || 0, // 添加默认值
					name: userRank.user_id?.nickname || "未知用户",
					avatar: userRank.user_id?.avatarUrl || "/static/default-avatar.png",
					distance: ((userRank.total_distance || 0) / 1000).toFixed(2),
				};
			} else {
				// 如果没有排名数据，设置默认值
				currentUserRank.value = {
					rank: 0,
					name: "未知用户",
					avatar: "/static/default-avatar.png",
					distance: 0,
				};
			}
		}
	} catch (error) {
		console.error("获取个人排名失败:", error);
		// 发生错误时也设置默认值
		currentUserRank.value = {
			rank: 0,
			name: "未知用户",
			avatar: "/static/default-avatar.png",
			distance: 0,
		};
	}
};

// const selectLocation = (type) => {
// 	selectedLocation.value = type;
// };

// 切换时间维度
const selectTab = async (tab) => {
	activeTab.value = tab;
	// 根据不同tab设置不同的rankType
	const rankTypes = {
		day: "daily",
		month: "monthly",
		year: "yearly",
	};
	await fetchRankings(rankTypes[tab]);
	await fetchCurrentUserRank();
};

onMounted(() => {
	fetchRankings();
	fetchCurrentUserRank();
});

onShow(() => {
	fetchRankings();
	fetchCurrentUserRank();
});
</script>

<style lang="scss">
.ranking-page {
	min-height: 100vh;
	background-color: #ffffff;
	padding-bottom: 120rpx; /* 为固定底部预留空间 */
}

.header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 32rpx 32rpx 0;
}

.rules {
	font-size: 28rpx;
}

.location-toggle {
	display: flex;
	background: #f1f1f1; /* 深一点的灰色背景 */
	border-radius: 32rpx;
	padding: 4rpx;
}

.toggle-item {
	padding: 12rpx 32rpx;
	font-size: 24rpx;
	color: #666;
	border-radius: 28rpx;
	display: flex;
	align-items: center;
}

.toggle-item.active {
	background: #333;
	color: #fff;
}

.arrow {
	font-size: 20rpx;
	margin-left: 8rpx;
}

.time-tabs {
	display: flex;
	justify-content: center;
	gap: 64rpx;
	margin: 32rpx 0 112rpx;
}

.tab-item {
	position: relative;
	padding: 16rpx 0;
}

.tab-item.active::after {
	content: "";
	position: absolute;
	bottom: -4rpx;
	left: 0;
	width: 100%;
	height: 8rpx;
	background-color: #ffc107;
	border-radius: 4rpx;
}

.top-three {
	display: flex;
	justify-content: center;
	align-items: flex-end;
	padding: 32rpx;
	padding-bottom: 0;
	gap: 32rpx;
}

.rank-flag {
	position: relative;
	width: 220rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 20rpx 32rpx;
	border-radius: 24rpx;
}

.circle-outer {
	position: absolute;
	top: -80rpx;
	width: 136rpx; /* 比内层稍大，形成白边 */
	height: 136rpx;
	background: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.circle-wrapper {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
}

.avatar {
	width: 100%;
	height: 100%;
	border-radius: 50%;
}

.rank-num {
	width: 64rpx;
	height: 64rpx;
	background: #fff;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 36rpx;
	font-weight: bold;
	margin: 16rpx 0;
}

.rank-flag.yellow .name {
	color: rgba(240, 184, 0, 1);
	font-weight: bold;
}
.rank-flag.orange .name {
	color: rgba(214, 108, 15, 1);
	font-weight: bold;
}
.rank-flag.pink .name {
	color: rgba(179, 91, 158, 1);
	font-weight: bold;
}

.score {
	font-size: 40rpx;
	font-weight: bold;
}

.unit {
	font-size: 24rpx;
	color: rgba(0, 0, 0, 0.4);
	margin: 8rpx 0 16rpx;
}
/* 背景色 */
.yellow {
	background: linear-gradient(to bottom, #ffe27d 0%, #ffffff 75%, #ffffff 100%);
}

.orange {
	background: linear-gradient(to bottom, #ffd7b5 0%, #ffffff 75%, #ffffff 100%);
}

.pink {
	background: linear-gradient(to bottom, #ffe0ed 0%, #ffffff 75%, #ffffff 100%);
}

/* 第一名特殊处理 */
.rank-flag:nth-child(2) {
	transform: translateY(-32rpx);
}

.rank-flag:nth-child(2) .avatar {
	width: 140rpx;
	height: 140rpx;
}

.name {
	font-size: 28rpx;
	margin: 8rpx 0;
}

.distance {
	font-size: 24rpx;
	color: #666;
	margin-bottom: 8rpx;
}

.btn-follow {
	margin-top: 16rpx;
	padding: 12rpx 32rpx;
	background: #ffd100;
	border-radius: 4rpx;
	font-size: 24rpx;

	&.followed {
		background-color: #f0f0f0;
		color: #666;
	}
}

.followed {
	color: rgba(255, 195, 0, 1);
	background: rgba(255, 250, 224, 1);
}

.rank-list {
	padding: 0 32rpx;
	padding-top: 0;
}

.rank-list .rank-item {
	display: flex;
	align-items: center;
	margin-bottom: 32rpx;
}

.rank-list .rank-num {
	font-size: 40rpx;
	color: #999;
	width: 60rpx;
	margin-right: 30rpx;
}

.current-user .rank-num {
	font-size: 40rpx;
	color: rgba(255, 195, 0, 1);
	width: 60rpx;
	margin-right: 30rpx;
	background: transparent;
}

.current-user .avatar,
.rank-list .avatar {
	width: 100rpx;
	height: 100rpx;
	border-radius: 50%;
	margin: 0 24rpx;
}

.current-user .info,
.rank-list .info {
	display: flex;
	flex-direction: column;
}

.rank-list .name {
	font-size: 32rpx;
	color: #333;
}

.distance {
	font-size: 28rpx;
	color: #999;
}

.current-user {
	position: fixed;
	bottom: 0rpx;
	left: 0;
	right: 0;
	background: linear-gradient(
		180deg,
		rgba(255, 248, 212, 1) 0%,
		rgba(255, 255, 255, 1) 100%
	);
	padding: 24rpx 32rpx;
	display: flex;
	align-items: center;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.current-user .avatar {
	width: 100rpx;
	height: 100rpx;
}

.trend {
	display: flex;
	align-items: center;
}

.trend-num {
	color: #ff5252;
	margin-right: 4rpx;
}

.trend-icon {
	color: #ff5252;
}

.city-selector {
	width: 600rpx;
	max-height: 800rpx;
	background-color: #fff;
	border-radius: 20rpx;

	.city-header {
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1rpx solid #eee;

		.title {
			font-size: 32rpx;
			font-weight: bold;
		}

		.close {
			font-size: 40rpx;
			color: #999;
			padding: 10rpx;
		}
	}

	.city-list {
		max-height: 700rpx;
		background: white;

		.city-item {
			padding: 30rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1rpx solid #eee;

			.city-name {
				font-size: 28rpx;
			}

			.user-count {
				font-size: 24rpx;
				color: #999;
			}

			&:active {
				background-color: #f5f5f5;
			}
		}
	}
}
</style>
