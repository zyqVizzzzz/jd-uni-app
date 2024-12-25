<template>
	<view class="finding-device-page">
		<view class="device-status">
			<view class="device-image-container">
				<image src="/static/magnifying-glass@3x.png" mode="aspectFit" class="status-image" />
			</view>
			<text class="status-text">正在查找</text>
			<view class="dots">
				<text>.</text>
				<text>.</text>
				<text>.</text>
			</view>
		</view>

		<!-- 可滚动的已搜索到的蓝牙设备列表 -->
		<view class="bluetooth-list-box">
			<scroll-view class="bluetooth-list-container" scroll-y>
				<view v-for="(device, index) in foundDevices" :key="index" class="bluetooth-device-item"
					@tap="handleBind(device)">
					<text class="device-name">{{ device.name }}</text>
				</view>
			</scroll-view>
		</view>
		<view class="action" v-if="status ==='pending' || status ==='failed'">
		  <button @tap="handleRetry" class="find-device-button">
		    再次查找
		  </button>
		</view>
		<view class="action contact" v-if="isRetry && (status === 'pending' || status === 'failed')">
		  <button @tap="contactSupport" class="find-device-button ">
		    联系客服
		  </button>
		</view>
		
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted,
		onUnmounted
	} from 'vue'

	const foundDevices = ref([]) // 模拟已发现的蓝牙设备列表
	let intervalId = null
	const status = ref('')
	const isRetry = ref(false)

	onMounted(() => {
		simulateBluetoothScan()
	})

	onUnmounted(() => {
		if (intervalId) clearInterval(intervalId)
	})
	
	// 点击“再次查找”处理逻辑
	function handleRetry() {
		isRetry.value = true
		foundDevices.value = []
		simulateBluetoothScan()
	}

	function simulateBluetoothScan() {
		let count = 0
		intervalId = setInterval(() => {
			count++
			foundDevices.value.push({
				name: `已发现设备_${count}`
			})

			// 模拟找到 10 个设备后停止扫描
			if (count === 10) {
				status.value = 'pending';
				clearInterval(intervalId)
			}
		}, 100) // 每隔1秒添加一个设备
	}
	
	// 点击“联系客服”处理逻辑（这里仅模拟console输出，可根据需求调整）
	function contactSupport() {
		console.log('联系客服')
		uni.navigateTo({
		  url: "/pages/contactCostumer/contactCostumer",
		});
	}

	const handleBind = (device) => {
		simulateBindDevice(device)
			.then(() => {
				console.log(`绑定成功: ${device.name}`)
				status.value = 'success'
				uni.navigateTo({
				  url: "/pages/deviceBindSuccess/deviceBindSuccess",
				});
			})
			.catch(() => {
				console.log(`绑定失败: ${device.name}`)
				status.value = 'failed'
			})
	}

	const simulateBindDevice = (device) => {
		return new Promise((resolve, reject) => {
			// 模拟异步操作，比如请求后端接口，耗时1秒
			setTimeout(() => {
				const isSuccess = true
				if (isSuccess) {
					resolve()
				} else {
					reject()
				}
			}, 1000)
		})
	}
</script>

<style lang="scss">
	.finding-device-page {
		background-color: #ffffff;
		min-height: 100vh;

		.device-status {
			padding-top: 40rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		.device-image-container {
			width: 320rpx;
			height: 320rpx;
			border-radius: 16px;
			display: flex;
			justify-content: center;
			align-items: center;
			margin-bottom: 20px;
		}

		.status-image {
			width: 320rpx;
			height: 320rpx;
		}

		.status-text {
			font-size: 32rpx;
			color: #333;
			margin-bottom: 10px;
			font-weight: bold;
		}

		.dots {
			font-size: 36rpx;
			color: #999;
			display: flex;
			gap: 5px;
		}

		.bluetooth-list-box {
			padding: 15px;
			box-sizing: border-box;
		}

		/* 蓝牙列表容器样式 */
		.bluetooth-list-container {
			height: 500rpx;
			background-color: #ffffff;
			border-radius: 16rpx;
			overflow-y: scroll;
			border: 1px solid #e0e0e0;
			padding: 10px 20px;
			box-sizing: border-box;

			/* 隐藏滚动条，仅在web环境有效 */
			&::-webkit-scrollbar {
				width: 0px;
				height: 0px;
				display: none;
			}
		}

		.bluetooth-device-item {
			padding: 30rpx 0;
			border-bottom: 1rpx solid #e0e0e0;

			&:last-child {
				border-bottom: none;
			}
		}

		.device-name {
			font-size: 28rpx;
			color: #333;
		}
		
		
		.action.contact{
			margin-top: 10px;
			.find-device-button {
			  background-color: #C0C4CC;
			  color: #606266;
			  padding: 20rpx 20px;
			  margin: 0 20px;
			  border: none;
			  border-radius: 108rpx;
			  font-size: 32rpx;
			}
			button::after {
			  border: none;
			}
		}
		
		.action {
		  margin-top: 30px;
		  text-align: center;
		  .find-device-button {
		    background-color: #ffcc00;
		    color: #000;
		    padding: 20rpx 20px;
		    margin: 0 20px;
		    border: none;
		    border-radius: 108rpx;
		    font-size: 32rpx;
		  }
		  button::after {
		    border: none;
		  }
		}
	}
</style>