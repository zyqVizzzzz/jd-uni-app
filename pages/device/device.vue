<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <view class="add-device-page">
    <view class="device-step">
      <text class="step-title">1.设备添加说明</text>
      <view class="device-image-placeholder">
        <!-- <image
          src="/path/to/placeholder.png"
          mode="aspectFit"
          class="placeholder-image"
        /> -->
      </view>
    </view>

    <view class="device-step">
      <text class="step-title">2.设备添加说明</text>
      <view class="device-image-placeholder">
        <!-- <image
          src="/path/to/placeholder.png"
          mode="aspectFit"
          class="placeholder-image"
        /> -->
      </view>
    </view>

    <view class="action">
      <button @tap="navigateToSearch" class="find-device-button">
        查找设备
      </button>
    </view>
  </view>
</template>

<script setup>
const navigateToSearch = () => {
  uni.navigateTo({
    url: "/pages/deviceSearch/deviceSearch",
  });
};
</script>

<style lang="scss">
.add-device-page {
  background-color: #ffffff;
  min-height: 100vh;
  padding: 30rpx;

  .step-title {
    font-size: 32rpx;
    margin-bottom: 20rpx;
    color: #333;
  }

  .device-image-placeholder {
    background-color: #e7f0ff;
    height: 416rpx;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20rpx 0;
  }

  .placeholder-image {
    width: 50px;
    height: 50px;
  }

  .action {
    margin-top: 30px;
    text-align: center;
  }

  .find-device-button {
    background-color: #ffcc00;
    color: #000;
    padding: 20rpx 20px;
    border: none;
    border-radius: 108rpx;
    font-size: 32rpx;
    margin-top: 100rpx;
  }
  button::after {
    border: none;
  }
}
</style>
