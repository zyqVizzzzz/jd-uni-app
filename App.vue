<script>
export default {
	onLaunch: function () {
		// checkLoginStatus();
		// const checkLoginStatus = () => {
		//   const token = uni.getStorageSync('token')
		//   if (token) {
		//     // 验证 token 是否有效
		//     validateToken()
		//   }
		// }
	},
	onShow: function () {
		console.log("App Show");
	},
	onHide: function () {
		console.log("App Hide");
	},
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "@/uni_modules/uni-scss/index.scss";
/* #ifndef APP-NVUE */
@import "@/static/customicons.css";
// 设置整个项目的背景色
page {
	background-color: #f5f5f5;
}

.uni-calendar-item--isDay-text {
	color: #ffb800 !important;
}
.uni-calendar-item--isDay {
	background-color: #ffb800 !important;
	color: #ffffff !important;
}
/* 修改选中日期的背景颜色为黄色 */
:deep(.uni-calendar-item--checked) {
	background-color: #ffb800 !important; /* 使用黄色替换默认的蓝色 */
}

/* 修改日期选中时的文字颜色 */
:deep(.uni-calendar-item--checked .uni-calendar-item__weeks-box-item) {
	color: #ffffff !important;
}

/* 修改指示点的颜色为黄色 */
:deep(.uni-calendar-item__weeks-box-circle) {
	background-color: #ffb800 !important;
}

/* 确保选中状态的指示点也是黄色 */
:deep(.uni-calendar-item--checked .uni-calendar-item__weeks-box-circle) {
	background-color: #ffffff !important; /* 选中状态下点的颜色改为白色，以提高对比度 */
}

.uni-swiper-dots {
	bottom: 0;
}

.uni-swiper-dot {
	width: 16rpx;
	height: 16rpx;
	border-radius: 50%;
	margin: 0 8rpx;
	background-color: #ddd;
}

.uni-swiper-dot-active {
	background-color: #ffc107;
}

/* #endif */
.example-info {
	font-size: 14px;
	color: #333;
	padding: 10px;
}
</style>
