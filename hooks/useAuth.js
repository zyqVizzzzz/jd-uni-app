import { ref } from 'vue'

export const useAuth = () => {
  const isLoggedIn = ref(!!uni.getStorageSync('token'))

  const checkAuth = () => {
    if (!isLoggedIn.value) {
      // 显示登录弹窗
      const loginPopup = uni.createPopup()
      loginPopup.open()
      return false
    }
    return true
  }
  
  return {
    isLoggedIn,
    checkAuth
  }
}
