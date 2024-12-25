<template>
  <view class="ranking-page">
    <!-- 顶部选项区 -->
    <view class="header">
      <text class="rules">评选规则</text>
      <view class="location-toggle">
        <view
          class="toggle-item"
          :class="{ active: selectedLocation === 'national' }"
          @tap="selectLocation('national')"
        >
          全国
        </view>
        <view
          class="toggle-item"
          :class="{ active: selectedLocation === 'local' }"
          @tap="selectLocation('local')"
        >
          温州
          <text class="arrow">▼</text>
        </view>
      </view>
    </view>

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
      <view class="rank-flag orange">
        <view class="circle-outer">
          <view class="circle-wrapper">
            <image src="/static/avatar.jpg" class="avatar" mode="aspectFill" />
          </view>
        </view>
        <view class="rank-num">2</view>
        <text class="name">永凯987</text>
        <text class="score">32800</text>
        <text class="unit">总距离 (千米)</text>
        <text class="btn-follow followed">已关注</text>
      </view>

      <view class="rank-flag yellow">
        <view class="circle-outer">
          <view class="circle-wrapper">
            <image src="/static/avatar.jpg" class="avatar" mode="aspectFill" />
          </view>
        </view>
        <view class="rank-num">1</view>
        <text class="name">huaxhi阿龙</text>
        <text class="score">36800</text>
        <text class="unit">总距离 (千米)</text>
        <text class="btn-follow followed">已关注</text>
      </view>

      <view class="rank-flag pink">
        <view class="circle-outer">
          <view class="circle-wrapper">
            <image src="/static/avatar.jpg" class="avatar" mode="aspectFill" />
          </view>
        </view>
        <view class="rank-num">3</view>
        <text class="name">李天宣</text>
        <text class="score">30600</text>
        <text class="unit">总距离 (千米)</text>
        <text class="btn-follow">关注</text>
      </view>
    </view>

    <!-- 其他排名列表 -->
    <view class="rank-list">
      <view class="rank-item" v-for="i in 4" :key="i">
        <text class="rank-num">{{ i + 3 }}</text>
        <image src="/static/avatar.jpg" class="avatar" mode="aspectFill" />
        <view class="info">
          <text class="name">用户名称</text>
          <text class="distance">总距离 {{ 30000 - i * 1000 }} 千米</text>
        </view>
      </view>
    </view>

    <!-- 固定在底部的当前用户排名 -->
    <view class="current-user">
      <text class="rank-num">10</text>
      <image src="/static/avatar.jpg" class="avatar" mode="aspectFill" />
      <view class="info">
        <text class="name">萧哲</text>
        <text class="distance">总距离 18000千米</text>
      </view>
      <view class="trend">
        <text class="trend-num">6</text>
        <text class="trend-icon">↑</text>
      </view>
    </view>
  </view>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const selectedLocation = ref("national");
    const activeTab = ref("year");

    const selectLocation = (type) => {
      selectedLocation.value = type;
    };

    const selectTab = (tab) => {
      activeTab.value = tab;
    };

    return {
      selectedLocation,
      activeTab,
      selectLocation,
      selectTab,
    };
  },
};
</script>

<style>
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
</style>
