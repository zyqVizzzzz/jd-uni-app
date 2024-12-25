<template>
	<view class="share-page">
		<!-- Main Content Card -->
		<view id="capture" class="share-card">
			<!-- Swimming Image -->
			<view class="share-banner" style="position: relative;">
				<image class="swimming-image" :src="selectedImage" mode="aspectFill" />
				<text class="image-text">{{ selectedText }}</text>
			</view>

			<!-- Swimming Data Section -->
			<view class="data-section">
				<text class="section-title">游泳数据</text>

				<view class="data-grid">
					<!-- Distance -->
					<view class="data-item" v-show="getOptionChecked('distance')">
						<text class="label">距离</text>
						<view class="value-container">
							<text class="value">{{distance}}</text>
							<text class="unit">M</text>
						</view>
					</view>

					<!-- Time -->
					<view class="data-item" v-show="getOptionChecked('duration')">
						<text class="label">时间</text>
						<view class="value-container">
							<text class="value">{{duration}}</text>
						</view>
					</view>

					<!-- Average Pace -->
					<view class="data-item" v-show="getOptionChecked('pace')">
						<text class="label">平均配速</text>
						<view class="value-container">
							<text class="value">{{pace}}</text>
							<text class="unit">/100m</text>
						</view>
					</view>

					<!-- Calories -->
					<view class="data-item" v-show="getOptionChecked('calories')">
						<text class="label">消耗热量</text>
						<view class="value-container">
							<text class="value">{{calories}}</text>
							<text class="unit">KCAL</text>
						</view>
					</view>

					<!-- Pool Length -->
					<view class="data-item" v-show="getOptionChecked('poolLength')">
						<text class="label">泳池长度</text>
						<view class="value-container">
							<text class="value">{{poolLength}}</text>
							<text class="unit">M</text>
						</view>
					</view>

					<!-- Laps -->
					<view class="data-item" v-show="getOptionChecked('laps')">
						<text class="label">趟数</text>
						<view class="value-container">
							<text class="value">{{laps}}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- Footer with QR Code -->
			<view class="card-footer">
				<view class="footer-left">
					<!-- <image class="logo" src="/static/logo.png" mode="heightFit" /> -->
					<view class="footer-text">
						<text class="primary-text">长按屏幕识别二维码</text>
						<text class="sub-text">加入焦动和我一起游泳</text>
					</view>
				</view>
				<image class="qr-code" src="/static/qr-code.jpg" mode="aspectFit" />
			</view>
		</view>

		<view class="edit-button">
			<text></text>
			<button class="edit-btn" @tap="toggleEdit">
				编辑卡片
			</button>
		</view>

		<view class="edit-actions" v-if="isEditing">
			<!-- Tab 切换区域 -->
			<view class="tabs">
				<view v-for="(tab, index) in tabs" :key="index" class="tab-item" :class="{ active: currentTab === index }"
					@tap="switchTab(index)">
					{{ tab }}
				</view>
			</view>

			<!-- 选项内容区域 -->
			<view class="options-container">
				<!-- 数据选项 -->
				<view class="data-options-list" v-if="currentTab === 0">
					<view class="option-item" v-for="(item, index) in dataOptions" :key="index" @tap="toggleDataOption(index)">
						<text>{{ item.label }}</text>
						<view class="checkbox">
							<view class="circle" :class="{ checked: item.checked }"></view>
						</view>
					</view>
				</view>

				<!-- 文案选项 -->
				<view class="text-options-list" v-if="currentTab === 1">
					<view v-for="(text, index) in textOptions" :key="index" class="text-item"
						:class="{ 'text-selected': text.selected }" @tap="toggleTextSelection(index)">
						{{ text.content }}
					</view>
				</view>

				<!-- 图片选项 -->
				<view class="image-options-list" v-if="currentTab === 2">
					<scroll-view scroll-x class="image-scroll">
						<view class="image-container">
							<!-- 相册选择按钮 -->
							<view class="image-item album-select" @tap="chooseImage">
								<view class="add-icon">
									<image src="/static/icons/camera.png" mode="aspectFit" />
								</view>
							</view>

							<!-- 预设图片选项 -->
							<view v-for="(img, index) in imageOptions" :key="index" class="image-item"
								:class="{ 'image-selected': img.selected }" @tap="selectImage(index)">
								<image :src="img.url" mode="aspectFill" />
								<view class="select-mask" v-if="img.selected">
									<view class="check-icon">✓</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>

			<!-- 底部提示 -->
			<view class="tip-text" v-if="currentTab === 0">
				可选择1-3项数据不显示
			</view>
		</view>

		<!-- Share Actions -->
		<view class="share-actions">
			<view class="action-buttons">
				<button class="action-btn save" @tap="handleSaveWithPermission">
					<image src="/static/icons/share-save@3x.png" mode="aspectFit" />
					<text>保存到本地</text>
				</button>
				<button class="action-btn wechat" open-type="share">
					<image src="/static/icons/share-wechat@3x.png" mode="aspectFit" />
					<text>微信好友</text>
				</button>
				<button class="action-btn wechat" open-type="share">
					<image src="/static/icons/share-swimmer@3x.png" mode="aspectFit" />
					<text>泳者圈</text>
				</button>
				<button class="action-btn moments" @tap="handleShareMoments">
					<image src="/static/icons/share-moments@3x.png" mode="aspectFit" />
					<text>朋友圈</text>
				</button>
				<button class="action-btn qq" @tap="handleShareQQ">
					<image src="/static/icons/share-qq@3x.png" mode="aspectFit" />
					<text>QQ好友</text>
				</button>
			</view>
		</view>
		<!-- Painter 组件放在最外层，使用固定定位隐藏 -->
		<canvas type="2d" id="shareCanvas" :style="canvasStyle" class="share-canvas" />


	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted
	} from 'vue'

	const props = defineProps({
		distance: {
			type: Number,
			default: 275
		},
		duration: {
			type: String,
			default: '1:13:41'
		},
		pace: {
			type: String,
			default: "26'47"
		},
		calories: {
			type: Number,
			default: 99
		},
		poolLength: {
			type: Number,
			default: 25
		},
		laps: {
			type: Number,
			default: 11
		}
	})

	const dataOptions = ref([{
			label: '总距离',
			key: 'distance',
			checked: true
		},
		{
			label: '总时间',
			key: 'duration',
			checked: true
		},
		{
			label: '配速',
			key: 'pace',
			checked: true
		},
		{
			label: '消耗热量',
			key: 'calories',
			checked: true
		},
		{
			label: '趟数',
			key: 'laps',
			checked: true
		},
		{
			label: '泳池长度',
			key: 'poolLength',
			checked: true
		},
	])

	// 文案选项数据
	const textOptions = ref([{
			content: '在水里，才自由',
			selected: true
		},
		{
			content: '享受失重 掌控自由',
			selected: false
		},
		{
			content: '聚焦于动',
			selected: false
		},
		{
			content: '水中的每一道阻力 都是你不竭的动力',
			selected: false
		},
		{
			content: '相信自己的能力 你可以克服任何困难',
			selected: false
		},
		{
			content: '你的坚持和毅力让我感到惊讶 是个令人敬佩的游泳高手',
			selected: false
		}
	])

	const imageOptions = ref([{
			url: '/static/swimming.jpg',
			selected: true
		},
		{
			url: '/static/swimming.jpg',
			selected: false
		},
		{
			url: '/static/swimming.jpg',
			selected: false
		},
	])
	// 自定义图片
	const customImage = ref(null)

	const isEditing = ref(false)
	const currentTab = ref(0)
	const tabs = ['数据', '文案', '图片']

	// 数据项配置
	const dataItems = computed(() => [{
			label: '距离',
			value: props.distance,
			unit: 'M'
		},
		{
			label: '时间',
			value: props.duration
		},
		{
			label: '平均配速',
			value: props.pace,
			unit: '/100m'
		},
		{
			label: '消耗热量',
			value: props.calories,
			unit: 'KCAL'
		},
		{
			label: '泳池长度',
			value: props.poolLength,
			unit: 'M'
		},
		{
			label: '趟数',
			value: props.laps
		}
	])

	const canvasStyle = ref('position: fixed; left: -9999rpx;')
	const canvasWidth = 654
	const canvasHeight = 1000
	const pixelRatio = uni.getSystemInfoSync().pixelRatio || 2

	// 检查保存图片到相册的权限
	const checkPhotoPermission = () => {
		return new Promise((resolve, reject) => {
			uni.authorize({
				scope: 'scope.writePhotosAlbum',
				success: resolve,
				fail: () => {
					uni.showModal({
						title: '提示',
						content: '需要您授权保存图片到相册',
						success: (res) => {
							if (res.confirm) {
								uni.openSetting({
									success: (settingRes) => {
										if (settingRes.authSetting['scope.writePhotosAlbum']) {
											resolve()
										} else {
											reject(new Error('未获得权限'))
										}
									}
								})
							} else {
								reject(new Error('用户拒绝授权'))
							}
						}
					})
				}
			})
		})
	}

	// 切换标签
	const switchTab = (index) => {
		currentTab.value = index
	}

	// 切换编辑状态
	const toggleEdit = () => {
		isEditing.value = !isEditing.value
	}

	// 切换数据选项的方法
	const toggleDataOption = (index) => {
		// 计算当前选中和未选中的数量
		const checkedCount = dataOptions.value.filter(item => item.checked).length;
		const maxHidden = 3; // 最多可以隐藏3项

		// 如果当前要取消选中，且已选中数量将少于3项，则阻止操作
		if (dataOptions.value[index].checked && checkedCount <= 3) {
			uni.showToast({
				title: '至少需要显示3项数据',
				icon: 'none'
			})
			return;
		}

		// 如果当前要选中，且未选中数量将超过3项，则阻止操作
		if (dataOptions.value[index].checked) {
			// 如果取消选中后，选中数量会小于3项，则阻止操作
			if (checkedCount - 1 < 3) {
				uni.showToast({
					title: '至少需要显示3项数据',
					icon: 'none'
				})
				return;
			}
		}

		// 切换选中状态
		dataOptions.value[index].checked = !dataOptions.value[index].checked;
	}

	// 获取选项选中状态的方法
	const getOptionChecked = (key) => {
		const option = dataOptions.value.find(item => item.key === key);
		return option ? option.checked : true;
	}

	const selectedText = computed(() => {
		const selectedOption = textOptions.value.find(item => item.selected);
		return selectedOption ? selectedOption.content : '在水里，才自由！'; // 提供一个默认值
	});

	// 切换文本选中状态
	const toggleTextSelection = (index) => {
		// 1. 先将所有选项设置为未选中
		textOptions.value.forEach((item, i) => {
			item.selected = i === index; // 只有点击的项为选中状态
		});
	}

	// 添加计算属性获取当前选中的图片
	const selectedImage = computed(() => {
		// 如果有自定义图片且被选中，优先使用自定义图片
		if (customImage.value?.selected) {
			return customImage.value.url;
		}
		// 否则返回预设图片中被选中的图片
		const selectedOption = imageOptions.value.find(img => img.selected);
		return selectedOption ? selectedOption.url : imageOptions.value[0].url; // 默认使用第一张预设图片
	});

	// 选择图片
	const selectImage = (index) => {
		// 取消所有选中状态
		imageOptions.value.forEach(img => img.selected = false);
		// 取消自定义图片的选中状态
		if (customImage.value) {
			customImage.value.selected = false;
		}
		// 设置选中状态
		imageOptions.value[index].selected = true;
	}

	// 从相册选择图片
	const chooseImage = () => {
		uni.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album'],
			success: (res) => {
				// 取消所有预设图片的选中状态
				imageOptions.value.forEach(img => img.selected = false);

				// 设置新选择的图片
				customImage.value = {
					url: res.tempFilePaths[0],
					selected: true
				}
			},
			fail: (err) => {
				console.error('选择图片失败:', err);
				uni.showToast({
					title: '选择图片失败',
					icon: 'none'
				});
			}
		});
	}

	// 加载图片并返回信息
	const loadImage = (src) => {
		return new Promise((resolve, reject) => {
			const img = uni.createOffscreenCanvas({
				type: '2d'
			}).createImage()
			img.onload = () => resolve(img)
			img.onerror = () => reject(new Error('图片加载失败'))
			img.src = src
		})
	}

	// 绘制圆角矩形
	const drawRoundRect = (ctx, x, y, width, height, radius) => {
		ctx.beginPath()
		ctx.moveTo(x + radius, y)
		ctx.lineTo(x + width - radius, y)
		ctx.arcTo(x + width, y, x + width, y + radius, radius)
		ctx.lineTo(x + width, y + height - radius)
		ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
		ctx.lineTo(x + radius, y + height)
		ctx.arcTo(x, y + height, x, y + height - radius, radius)
		ctx.lineTo(x, y + radius)
		ctx.arcTo(x, y, x + radius, y, radius)
		ctx.closePath()
	}

	// 绘制分享图
	const startDraw = async () => {
		try {
			const query = uni.createSelectorQuery()
			const canvas = await new Promise(resolve => {
				query.select('#shareCanvas')
					.fields({
						node: true,
						size: true
					})
					.exec((res) => {
						if (res[0]?.node) {
							resolve(res[0].node)
						} else {
							throw new Error('获取画布节点失败')
						}
					})
			})
			const ctx = canvas.getContext('2d')

			// 设置画布尺寸和缩放
			canvas.width = canvasWidth * pixelRatio
			canvas.height = canvasHeight * pixelRatio
			ctx.scale(pixelRatio, pixelRatio)

			// 预加载所需图片
			const [selectedImg, qrCodeImg] = await Promise.all([
				loadImage(selectedImage.value), // 使用选中的图片
				loadImage('/static/qr-code.jpg')
			])

			// 绘制背景
			ctx.fillStyle = '#ffffff'
			ctx.fillRect(0, 0, canvasWidth, canvasHeight)

			// 绘制顶部图片和文字
			ctx.drawImage(selectedImg, 0, 0, canvasWidth, 400)
			ctx.fillStyle = '#ffffff'
			ctx.font = 'bold 36px sans-serif'
			ctx.fillText(selectedText.value, 40, 360) // 使用选中的文案

			// 绘制数据区域
			ctx.fillStyle = '#333333'
			ctx.font = '32px sans-serif'
			ctx.fillText('游泳数据', 30, 460)

			// 绘制选中显示的数据项
			let visibleIndex = 0;
			dataItems.value.forEach((item, index) => {
				// 检查该数据项是否被选中显示
				const key = dataOptions.value[index].key;
				if (getOptionChecked(key)) {
					const x = 30 + (visibleIndex % 2) * 220
					const y = 530 + Math.floor(visibleIndex / 2) * 100

					ctx.font = 'bold 40px sans-serif'
					ctx.fillStyle = '#333333'
					ctx.fillText(item.value.toString(), x, y)

					if (item.unit) {
						const valueWidth = ctx.measureText(item.value.toString()).width
						ctx.font = '24px sans-serif'
						ctx.fillStyle = '#666666'
						ctx.fillText(item.unit, x + valueWidth + 10, y) // 只间隔10像素
					}

					// 只对显示的数据项增加计数
					visibleIndex++;
				}
			})

			// 绘制底部区域
			ctx.fillStyle = '#000000'
			ctx.fillRect(0, canvasHeight - 180, canvasWidth, 180)

			// 绘制底部文字
			ctx.fillStyle = '#ffffff'
			ctx.font = '28px sans-serif'
			ctx.fillText('长按屏幕识别二维码', 30, canvasHeight - 100)
			ctx.fillStyle = 'rgba(255,255,255,0.7)'
			ctx.font = '24px sans-serif'
			ctx.fillText('加入焦动和我一起游泳', 30, canvasHeight - 60)

			// 绘制二维码
			drawRoundRect(ctx, canvasWidth - 150, canvasHeight - 150, 120, 120, 12)
			ctx.clip()
			ctx.drawImage(qrCodeImg, canvasWidth - 150, canvasHeight - 150, 120, 120)

			// 导出图片
			return await new Promise((resolve, reject) => {
				uni.canvasToTempFilePath({
					canvas,
					success: res => resolve(res.tempFilePath),
					fail: reject
				})
			})
		} catch (error) {
			console.error('绘制失败:', error)
			throw error
		}
	}
	// 保存图片处理（带权限检查）
	const handleSaveWithPermission = async () => {
		try {
			uni.showLoading({
				title: '生成图片中...',
				mask: true
			})

			// 检查权限
			await checkPhotoPermission()

			// 生成图片
			const filePath = await startDraw()

			// 保存到相册
			await uni.saveImageToPhotosAlbum({
				filePath
			})

			uni.showToast({
				title: '保存成功',
				icon: 'success'
			})
		} catch (error) {
			console.error('保存失败:', error)
			uni.showToast({
				title: error.message || '保存失败',
				icon: 'error'
			})
		} finally {
			uni.hideLoading()
		}
	}

	// 分享到朋友圈处理
	const handleShareMoments = async () => {
		try {
			const filePath = await startDraw()
			// 实现朋友圈分享逻辑
		} catch (error) {
			console.error('分享失败:', error)
			uni.showToast({
				title: '分享失败',
				icon: 'error'
			})
		}
	}

	// QQ分享处理
	const handleShareQQ = () => {
		uni.showToast({
			title: '暂不支持QQ分享',
			icon: 'none'
		})
	}

	onMounted(() => {
		// 初始化画布尺寸
		const systemInfo = uni.getSystemInfoSync()
		canvasStyle.value =
			`position: fixed; left: -9999rpx; width: ${systemInfo.screenWidth}px; height: ${systemInfo.screenWidth * 1.8}px;`
	})
</script>

<style lang="scss" scoped>
	.share-page {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding: 0 30rpx 40rpx;
	}

	.nav-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 88rpx;
		padding: 0 20rpx;

		.title {
			font-size: 34rpx;
			font-weight: 500;
		}

		.back-icon,
		.more-icon {
			font-size: 40rpx;
			padding: 20rpx;
		}
	}

	.share-card {
		background: #ffffff;
		border-radius: 20rpx;
		overflow: hidden;
		margin: 20rpx 0;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
		position: relative;

		.swimming-image {
			width: 100%;
			height: 400rpx;
			position: relative;
		}

		.image-text {
			position: absolute;
			bottom: 40rpx;
			left: 40rpx;
			color: #ffffff;
			font-size: 36rpx;
			font-weight: bold;
			text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.5);
		}
	}

	.data-section {
		padding: 30rpx;

		.section-title {
			font-size: 32rpx;
			font-weight: 500;
		}

		.data-grid {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 30rpx;
			margin-top: 30rpx;
			margin-bottom: 20rpx;
		}

		.data-item {
			.label {
				font-size: 28rpx;
				color: #666;
				margin-bottom: 10rpx;
			}

			.value-container {
				display: flex;
				align-items: baseline;

				.value {
					font-size: 40rpx;
					font-weight: bold;
				}

				.unit {
					font-size: 24rpx;
					color: #666;
					margin-left: 8rpx;
				}
			}
		}
	}

	.card-footer {
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #000;

		.footer-left {
			display: flex;
			align-items: center;

			.logo {
				height: 40rpx;
				width: auto;
				margin-right: 20rpx;
			}

			.footer-text {
				display: flex;
				flex-direction: column;

				.primary-text {
					font-size: 28rpx;
					color: #fff;
					margin-bottom: 8rpx;
				}

				.sub-text {
					font-size: 24rpx;
					color: rgba(255, 255, 255, 0.7);
				}
			}
		}

		.qr-code {
			width: 120rpx;
			height: 120rpx;
			background: #fff;
			border-radius: 12rpx;
		}
	}

	.share-actions {
		padding: 30rpx 0;

		.action-buttons {
			display: grid;
			grid-template-columns: repeat(5, 1fr);
			gap: 20rpx;
		}

		.action-btn {
			display: flex;
			flex-direction: column;
			align-items: center;
			background: none;
			padding: 0;

			&::after {
				border: none;
			}

			image {
				width: 80rpx;
				height: 80rpx;
				margin-bottom: 10rpx;
			}

			text {
				font-size: 24rpx;
				color: #333;
			}
		}
	}

	.debug-info {
		position: fixed;
		top: 20rpx;
		left: 20rpx;
		background: rgba(0, 0, 0, 0.7);
		color: #fff;
		padding: 20rpx;
		border-radius: 10rpx;
		font-size: 24rpx;
		z-index: 9999;

		text {
			display: block;
			margin: 10rpx 0;
		}
	}

	.edit-button {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.edit-btn {
		margin: 0;
		background: #EBEEF5; // 浅灰色背景
		color: #18191D; // 深色文字
		font-size: 28rpx; // 适中字体大小
		padding: 12rpx 40rpx;
		border-radius: 30rpx;
		line-height: 1.5;
		font-weight: normal;
		width: auto; // 自适应宽度
		min-width: 160rpx; // 最小宽度

		// 移除按钮默认样式
		&::after {
			border: none;
		}
	}

	.edit-actions {
		background-color: #fff;
		padding: 30rpx;
		border-radius: 20rpx;
		margin: 20rpx auto 40rpx;
	}

	.tabs {
		display: flex;
		border-bottom: 1px solid #eee;
		margin-bottom: 30rpx;
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 20rpx 0;
		font-size: 28rpx;
		color: #666;
		position: relative;

		&.active {
			color: #333;
			font-weight: 500;

			&::after {
				content: '';
				position: absolute;
				bottom: -2rpx;
				left: 50%;
				transform: translateX(-50%);
				width: 40rpx;
				height: 4rpx;
				background: #333;
				border-radius: 2rpx;
			}
		}
	}

	.data-options-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr); // 两列布局
		gap: 30rpx; // 行列间距
		padding: 20rpx 0;

		.option-item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 20rpx 0;
			border-bottom: 1px solid #f5f5f5;

			text {
				font-size: 28rpx;
				color: #333;
			}
		}
	}

	.checkbox {
		width: 40rpx;
		height: 40rpx;
		border: 2rpx solid #ddd;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.circle {
		width: 24rpx;
		height: 24rpx;
		border-radius: 50%;

		&.checked {
			background: #07c160;
		}
	}

	.tip-text {
		color: #ff525d;
		font-size: 24rpx;
		margin-top: 20rpx;
		padding: 0 20rpx;
	}

	.text-options-list {
		padding: 10rpx 20rpx;

		.text-item {
			width: 100%;
			font-size: 28rpx;
			color: #333;
			padding: 24rpx 0;
			line-height: 1.5;
			border-bottom: 1px solid #f5f5f5;

			&.text-selected {
				font-weight: bold;
				color: #000;
			}

			&:last-child {
				border-bottom: none;
			}

			// 点击效果
			&:active {
				background-color: #f9f9f9;
			}
		}
	}

	.image-options-list {
		padding: 30rpx;
	}

	.image-scroll {
		width: 100%;
	}

	.image-container {
		display: flex; // 使用flex布局
		padding-bottom: 10rpx; // 为了显示滚动条预留空间
	}

	.image-item {
		flex-shrink: 0; // 防止图片被压缩
		width: 200rpx;
		height: 200rpx;
		margin-right: 20rpx;
		border-radius: 12rpx;
		overflow: hidden;
		position: relative;

		&:last-child {
			margin-right: 30rpx; // 最后一个图片右侧预留间距
		}

		image {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

		// 相册选择按钮样式
		&.album-select {
			background: #f5f5f5;
			border: 2rpx dashed #ddd;
			display: flex;
			align-items: center;
			justify-content: center;

			.add-icon {
				width: 60rpx;
				height: 60rpx;

				image {
					width: 100%;
					height: 100%;
					opacity: 0.5;
				}
			}
		}
	}

	.select-mask {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;

		.check-icon {
			width: 40rpx;
			height: 40rpx;
			border-radius: 50%;
			background: #07c160;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24rpx;
		}
	}
</style>