<template>
	<view class="data-page">
		<view class="data-grid mt-2" @tap="handleNavigate">
			<!-- 第一行 -->
			<view class="data-row">
				<view class="data-item">
					<text class="text-base">距离</text>
					<text class="value blue">{{latestRecord.distance || 0}}M</text>
				</view>
				<view class="data-item">
					<text class="text-base">时间</text>
					<text class="value orange">{{formatDuration(latestRecord.duration)}}</text>
				</view>
			</view>

			<!-- 第二行 -->
			<view class="data-row">
				<view class="data-item">
					<text class="text-base">平均配速</text>
					<text class="value blue">{{formatPace(latestRecord.averagePace)}}</text>
				</view>
				<view class="data-item">
					<text class="text-base">消耗热量</text>
					<text class="value red">{{latestRecord.calories || 0}} KCAL</text>
				</view>
			</view>

			<!-- 第三行 -->
			<view class="data-row">
				<view class="data-item">
					<text class="text-base">泳池长度</text>
					<text class="value purple">{{latestRecord.poolLength || 0}}M</text>
				</view>
				<view class="data-item">
					<text class="text-base">趟数</text>
					<text class="value purple">{{latestRecord.strokes || 0}}</text>
				</view>
			</view>
		</view>

		<view class="flex gap-4 mt-4">
			<!-- 左侧卡片：上次游泳 -->
			<view class="flex-1 bg-white rounded-2xl p-4">
				<text class="block text-base text-gray-700">上次游泳</text>
				<text class="block text-base mt-2">{{formatDate(latestRecord.date)}}</text>
				<text class="block text-2xl font-bold mt-8">{{getDaysAgo(latestRecord.date)}} 天前</text>
			</view>

			<!-- 右侧卡片：总距离和训练时长 -->
			<view class="flex-1 bg-white rounded-2xl p-4">
				<view class="mb-6">
					<text class="block text-base text-gray-700">总距离</text>
					<text class="block text-2xl font-bold text-blue-400">{{totalStats.totalDistance || 0}}M</text>
				</view>
				<view>
					<text class="block text-base text-gray-700">总训练时长</text>
					<text class="block text-2xl font-bold text-yellow-400">{{formatDuration(totalStats.totalDuration)}}</text>
				</view>
			</view>
		</view>

		<view class="bg-white rounded-2xl p-4 mt-4">
			<view class="flex justify-between mb-4">
				<view>
					<text class="block text-base text-gray-700">{{currentMonth}}月游了</text>
					<text class="block text-2xl font-bold text-yellow-400">{{monthlyTarget.currentDistance}}M</text>
				</view>
				<view class="text-right">
					<text class="block text-base text-gray-700">{{currentMonth}}月目标</text>
					<text
						class="block text-2xl font-bold text-yellow-400">{{(monthlyTarget.completionRate * 100).toFixed(0)}}%</text>
				</view>
			</view>

			<!-- 进度条 -->
			<view class="relative h-8 bg-gray-100 rounded-full mt-4 progress-container">
				<view class="progress-fill" :style="{ width: `${monthlyTarget.completionRate * 100}%` }"></view>
				<view class="progress-text">
					<text class="text-sm text-gray-600">{{monthlyTarget.currentDistance}}/{{monthlyTarget.targetDistance}}</text>
				</view>
			</view>
		</view>

		<view @tap="handleMockData">
			新增记录
		</view>

		<login-popup ref="loginPopupRef" @success="handleLoginSuccess" @close="handleLoginClose" />
	</view>
</template>

<script setup>
	import {
		ref,
		onMounted
	} from 'vue'
	import LoginPopup from '@/components/LoginPopup.vue'
	import {
		request
	} from '@/utils/require';

	const loginPopupRef = ref(null)
	const latestRecord = ref({})
	const monthlyStats = ref({})
	const monthlyTarget = ref({
		currentDistance: 0,
		targetDistance: 2000,
		completionRate: 0
	})
	const currentMonth = ref(new Date().getMonth() + 1)

	// 格式化持续时间
	const formatDuration = (seconds) => {
		if (!seconds) return '0'
		const minutes = Math.floor(seconds / 60)
		const remainingSeconds = seconds % 60
		return `${minutes}'${remainingSeconds.toString().padStart(2, '0')}"`
	}

	// 格式化配速
	const formatPace = (pace) => {
		if (!pace) return '0'
		const minutes = Math.floor(pace / 60)
		const seconds = Math.floor(pace % 60)
		return `${minutes}'${seconds.toString().padStart(2, '0')}″/100m`
	}

	// 格式化日期
	const formatDate = (date) => {
		if (!date) return ''
		const d = new Date(date)
		return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
	}

	// 计算天数差
	const getDaysAgo = (date) => {
		if (!date) return 0
		const diffTime = Math.abs(new Date() - new Date(date))
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
	}

	// 获取最新游泳记录
	const fetchLatestRecord = async () => {
		try {
			const res = await request({
				url: '/swimming/latest'
			})
			if (res.data.code === 200) {
				latestRecord.value = res.data.data
			}
		} catch (err) {
			console.error('获取最新记录失败', err)
		}
	}

	// 获取月度统计
	const fetchMonthlyStats = async () => {
		const now = new Date()
		try {
			const res = await request({
				url: '/swimming/monthly-stats',
				params: {
					year: now.getFullYear(),
					month: now.getMonth() + 1
				}
			})
			if (res.data.code === 200) {
				console.log(res.data.data)
				monthlyStats.value = res.data.data[0] || {}
			}
		} catch (err) {
			console.error('获取月度统计失败', err)
		}
	}

	// 获取月度目标
	const fetchMonthlyTarget = async () => {
		const now = new Date()
		try {
			const res = await request({
				url: '/swimming/monthly-target',
				params: {
					year: now.getFullYear(),
					month: now.getMonth() + 1
				}
			})
			if (res.data.code === 200) {
				monthlyTarget.value = res.data.data
			}
		} catch (err) {
			console.error('获取月度目标失败', err)
		}
	}

	// 添加总计统计数据
	const totalStats = ref({
		totalDistance: 0,
		totalDuration: 0,
		totalCalories: 0,
		recordCount: 0
	})

	// 获取总计统计数据
	const fetchTotalStats = async () => {
		try {
			const res = await request({
				url: '/swimming/total-stats'
			})
			if (res.data.code === 200) {
				totalStats.value = res.data.data
			}
		} catch (err) {
			console.error('获取总计统计失败', err)
		}
	}

	// 页面跳转
	const handleNavigate = () => {
		uni.navigateTo({
			url: "/pages/dataCenter/dataCenter"
		})
	}

	// 检查登录状态
	const checkLoginStatus = (cb) => {
		const token = uni.getStorageSync('token')
		if (!token) {
			handleNeedLogin()
			return false
		}
		cb()
	}

	// 需要登录时调用
	const handleNeedLogin = () => {
		loginPopupRef.value.open()
	}

	// 登录成功回调
	const handleLoginSuccess = async () => {
		await Promise.all([
			fetchLatestRecord(),
			fetchMonthlyStats(),
			fetchMonthlyTarget(),
			fetchTotalStats()
		])
	}

	// 登录弹窗关闭回调
	const handleLoginClose = () => {
		// 处理弹窗关闭后的逻辑
	}


	const fetchSwimmingLatest = async () => {
		try {
			const res = await request({
				url: '/swimming/latest',
			})
			if (res.data.code === 200) {
				console.log(res.data.data)
				swimmingData.value = res.data.data
			}
		} catch (err) {

		}
	}

	const handleMockData = async () => {
		try {
			const res = await request({
				url: '/swimming/generate-mock',
				method: 'POST'
			})
			if (res.data.code === 201) {
				handleLoginSuccess();
			}
		} catch (error) {
			console.error('生成游泳记录失败', error)
			return null
		}
	}

	onMounted(() => {
		checkLoginStatus(async () => {
			await Promise.all([
				fetchLatestRecord(),
				fetchMonthlyStats(),
				fetchMonthlyTarget(),
				fetchTotalStats()
			])
		})
	})
</script>

<style lang="scss" scoped>
	.data-page {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding: 10px;

		.data-grid {
			background: #fff;
			border-radius: 16px;
			padding: 20px 15px;

			.data-row {
				display: flex;
				justify-content: space-between;
				margin-bottom: 15px;

				.data-item {
					flex: 1;
					display: flex;
					flex-direction: column;

					.label {
						font-size: 16px;
						color: #333;
					}

					.value {
						font-size: 24px;
						font-weight: bold;

						&.blue {
							color: #00bcd4;
						}

						&.orange {
							color: #ffc107;
						}

						&.red {
							color: #ff5252;
						}

						&.purple {
							color: #9c27b0;
						}
					}
				}

				.data-item:last-child {
					padding-left: 30px;
				}
			}

			.data-row:last-child {
				margin-bottom: 0;
			}
		}

		.progress-container {
			position: relative;

			.progress-fill {
				position: absolute;
				left: 0;
				top: 0;
				height: 100%;
				background-color: #ffc107;
				border-radius: 4px;
			}

			.progress-text {
				position: absolute;
				width: 100%;
				text-align: center;
				line-height: 32px;
				/* 与 h-8 一致 */
				font-size: 14px;
				/* 与 text-sm 一致 */
				color: #4b5563;
				/* 与 text-gray-600 一致 */
			}
		}
	}

	/* 以下为原 Tailwind 类替换为普通 CSS 的部分 */
	.mt-2 {
		margin-top: 8px;
	}

	.mt-4 {
		margin-top: 16px;
	}

	.mt-8 {
		margin-top: 32px;
	}

	.mb-4 {
		margin-bottom: 16px;
	}

	.mb-6 {
		margin-bottom: 24px;
	}

	.flex {
		display: flex;
	}

	.gap-4 {
		gap: 16px;
	}

	.flex-1 {
		flex: 1;
	}

	.bg-white {
		background-color: #fff;
	}

	.bg-gray-100 {
		background-color: #f3f4f6;
	}

	.rounded-2xl {
		border-radius: 16px;
	}

	.rounded-full {
		border-radius: 9999px;
	}

	.p-4 {
		padding: 16px;
	}

	.block {
		display: block;
	}

	.text-base {
		font-size: 16px;
	}

	.text-sm {
		font-size: 14px;
	}

	.text-2xl {
		font-size: 24px;
	}

	.font-bold {
		font-weight: bold;
	}

	.text-gray-700 {
		color: #4a5568;
	}

	.text-gray-600 {
		color: #4b5563;
	}

	.text-blue-400 {
		color: #60a5fa;
	}

	.text-yellow-400 {
		color: #fbbf24;
	}

	.justify-between {
		justify-content: space-between;
	}

	.text-right {
		text-align: right;
	}

	.relative {
		position: relative;
	}

	.h-8 {
		height: 32px;
	}

	.progress-container {
		position: relative;
		overflow: hidden;
	}

	.progress-fill {
		position: absolute;
		height: 100%;
		background-color: #FAD161;
		transition: width 0.3s ease;
		border-radius: 9999px;
	}

	.progress-text {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>