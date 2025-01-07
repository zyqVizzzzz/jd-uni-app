<template>
	<view class="finding-device-page">
		<view class="device-status">
			<view class="device-image-container">
				<image
					src="/static/magnifying-glass@3x.png"
					mode="aspectFit"
					class="status-image"
				/>
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
				<view
					v-for="(device, index) in foundDevices"
					:key="index"
					class="bluetooth-device-item"
					@tap="handleBind(device)"
				>
					<text class="device-name">{{ device.name }}</text>
				</view>
			</scroll-view>
		</view>
		<view class="action" v-if="status === 'pending' || status === 'failed'">
			<button @tap="handleRetry" class="find-device-button">再次查找</button>
		</view>
		<view
			class="action contact"
			v-if="isRetry && (status === 'pending' || status === 'failed')"
		>
			<button @tap="contactSupport" class="find-device-button">联系客服</button>
		</view>
	</view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { request } from "@/utils/require";

let intervalId = null;
const foundDevices = ref([]);
const status = ref("searching"); // 'searching' | 'pending' | 'failed' | 'success'
const isRetry = ref(false);

// 蓝牙初始化
const initBluetooth = () => {
	uni.openBluetoothAdapter({
		success: (res) => {
			console.log("蓝牙初始化成功", res);
			startBluetoothDevicesDiscovery();
		},
		fail: (err) => {
			console.error("蓝牙初始化失败", err);
			status.value = "failed";
			uni.showToast({
				title: "请开启蓝牙",
				icon: "none",
			});
		},
	});
};

// 开始搜索蓝牙设备
const startBluetoothDevicesDiscovery = () => {
	uni.startBluetoothDevicesDiscovery({
		allowDuplicatesKey: false,
		success: (res) => {
			console.log("开始搜索蓝牙设备", res);
			onBluetoothDeviceFound();
		},
		fail: (err) => {
			console.error("搜索蓝牙设备失败", err);
			status.value = "failed";
		},
	});
};

// 监听发现新设备事件
const onBluetoothDeviceFound = () => {
	uni.onBluetoothDeviceFound((res) => {
		res.devices.forEach((device) => {
			// 这里可以根据设备名称或特定服务来过滤设备
			if (
				device.name &&
				!foundDevices.value.some((d) => d.deviceId === device.deviceId)
			) {
				foundDevices.value.push({
					name: device.name,
					deviceId: device.deviceId,
					RSSI: device.RSSI,
					advertisData: device.advertisData,
				});
			}
		});
	});
};

// 停止搜索蓝牙设备
const stopBluetoothDevicesDiscovery = () => {
	uni.stopBluetoothDevicesDiscovery({
		success: (res) => {
			console.log("停止搜索蓝牙设备", res);
		},
	});
};

// 处理设备绑定
const handleBind = async (device) => {
	try {
		stopBluetoothDevicesDiscovery();

		// 连接设备
		await connectBluetoothDevice(device);
		// 保存设备信息到服务器
		await saveDeviceToServer(device);

		status.value = "success";
		uni.showToast({
			title: "绑定成功",
			icon: "success",
		});

		// 跳转到成功页面
		uni.navigateTo({
			url: "/pages/deviceBindSuccess/deviceBindSuccess",
		});
	} catch (error) {
		console.error("绑定失败", error);
		status.value = "failed";
		uni.showToast({
			title: "绑定失败",
			icon: "error",
		});
	}
};

// 连接蓝牙设备
const connectBluetoothDevice = (device) => {
	return new Promise((resolve, reject) => {
		uni.createBLEConnection({
			deviceId: device.deviceId,
			timeout: 10000, // 超时时间10秒
			success: (res) => {
				console.log("连接蓝牙设备成功", res);
				resolve(res);
			},
			fail: (err) => {
				console.error("连接蓝牙设备失败", err);
				reject(err);
			},
		});
	});
};

// 将设备信息保存到服务器
const saveDeviceToServer = async (device) => {
	try {
		const res = await request({
			url: "/devices",
			method: "POST",
			data: {
				device_model: device.deviceId,
				device_name: device.name,
			},
		});
		return res.data.code === 200 || res.data.code === 201;
	} catch (error) {
		console.error("保存设备信息到服务器失败", error);
		throw error;
	}
};

// 从服务器获取已绑定的设备信息
const getBoundDeviceFromServer = async () => {
	try {
		const res = await request({
			url: "/device/bound",
			method: "GET",
		});
		return res.statusCode === 200 ? res.data : null;
	} catch (error) {
		console.error("从服务器获取绑定设备信息失败", error);
		return null;
	}
};

// 重试处理
const handleRetry = () => {
	isRetry.value = true;
	foundDevices.value = [];
	status.value = "searching";
	initBluetooth();
};

// 联系客服
const contactSupport = () => {
	uni.navigateTo({
		url: "/pages/contactCostumer/contactCostumer",
	});
};

onMounted(() => {
	initBluetooth();
});

onUnmounted(() => {
	// 清理蓝牙相关资源
	stopBluetoothDevicesDiscovery();
	uni.closeBluetoothAdapter();
});
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

	.action.contact {
		margin-top: 10px;
		.find-device-button {
			background-color: #c0c4cc;
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
