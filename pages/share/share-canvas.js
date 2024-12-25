// share-canvas.js
export const drawShareImage = (data, canvasId) => {
  const { distance, duration, pace, calories, poolLength, laps, images } = data
  
  return new Promise(async (resolve, reject) => {
    try {
      const ctx = uni.createCanvasContext(canvasId)
      const systemInfo = uni.getSystemInfoSync()
      
      const canvasWidth = systemInfo.screenWidth
      const canvasHeight = systemInfo.screenWidth * 1.8
      const padding = 30
      
      // 绘制白色背景
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvasWidth, canvasHeight)
      
      // 绘制游泳图片
      await drawImage(ctx, images.swimming, {
        x: 0,
        y: 0,
        width: canvasWidth,
        height: canvasWidth * 0.8
      })
      
      // 绘制图片上的文字
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 20px sans-serif'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 4
      ctx.fillText('在水里，才自由！', padding, canvasWidth * 0.7)
      ctx.shadowBlur = 0
      
      // 绘制"游泳数据"标题
      const dataStartY = canvasWidth * 0.8 + 40
      ctx.fillStyle = '#333333'
      ctx.font = 'bold 16px sans-serif'
      ctx.fillText('游泳数据', padding, dataStartY)
      
      // 绘制数据网格
      const gridStartY = dataStartY + 30
      const gridItemHeight = 80
      const halfWidth = (canvasWidth - padding * 2) / 2
      
      // 绘制数据项
      const dataItems = [
        { label: '距离', value: distance + 'M' },
        { label: '时间', value: duration },
        { label: '平均配速', value: pace + '/100m' },
        { label: '消耗热量', value: calories + ' KCAL' },
        { label: '泳池长度', value: poolLength + 'M' },
        { label: '趟数', value: laps.toString() }
      ]
      
      dataItems.forEach((item, index) => {
        const row = Math.floor(index / 2)
        const col = index % 2
        const x = padding + col * halfWidth
        const y = gridStartY + row * gridItemHeight
        
        // 绘制标签
        ctx.fillStyle = '#666666'
        ctx.font = '14px sans-serif'
        ctx.fillText(item.label, x, y)
        
        // 绘制数值
        ctx.fillStyle = '#333333'
        ctx.font = 'bold 20px sans-serif'
        ctx.fillText(item.value, x, y + 30)
      })
      
      // 底部部分
      const footerStartY = gridStartY + gridItemHeight * 3 + 40
      
      // 绘制黑色背景
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, footerStartY, canvasWidth, 180)
      
      // 绘制 logo
      await drawImage(ctx, images.logo, {
        x: padding,
        y: footerStartY + 30,
        width: 80,
        height: 20
      })
      
      // 绘制文字
      ctx.fillStyle = '#ffffff'
      ctx.font = '14px sans-serif'
      ctx.fillText('长按屏幕识别二维码', padding + 100, footerStartY + 35)
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.font = '12px sans-serif'
      ctx.fillText('加入焦动和我一起游泳', padding + 100, footerStartY + 55)
      
      // 绘制二维码
      await drawImage(ctx, images.qrCode, {
        x: canvasWidth - padding - 60,
        y: footerStartY + 15,
        width: 60,
        height: 60
      })
      
      // 执行绘制
      ctx.draw(false, () => {
        setTimeout(() => {
          uni.canvasToTempFilePath({
            canvasId,
            success: (res) => {
              resolve(res.tempFilePath)
            },
            fail: reject
          })
        }, 300)
      })
    } catch (error) {
      console.error('绘制失败:', error)
      reject(error)
    }
  })
}

// 绘制图片的辅助方法
const drawImage = (ctx, src, options) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      console.error('图片源为空:', options)
      reject(new Error('图片源为空'))
      return
    }
    try {
      ctx.drawImage(src, options.x, options.y, options.width, options.height)
      resolve()
    } catch (error) {
      console.error('绘制图片失败:', error)
      reject(error)
    }
  })
}