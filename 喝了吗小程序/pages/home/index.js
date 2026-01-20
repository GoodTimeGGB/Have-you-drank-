// pages/home/index.js
Page({
  data: {
    userInfo: null,
    currentCups: 0,
    dailyGoal: 8,
    nextReminder: '45分钟',
    greeting: '早上好',
    recentHistory: [
      { date: '周一', cups: 6, status: 'ok', statusText: '良好', statusIcon: '/images/ok-icon.png' },
      { date: '周二', cups: 8, status: 'goal', statusText: '达标', statusIcon: '/images/goal-icon.png' },
      { date: '周三', cups: 5, status: 'low', statusText: '不足', statusIcon: '/images/low-icon.png' }
    ]
  },

  onLoad() {
    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }

    // 获取每日目标
    const dailyGoal = wx.getStorageSync('dailyGoal') || 8
    this.setData({ dailyGoal })

    // 获取今日记录
    const todayRecords = wx.getStorageSync('todayRecords') || []
    this.setData({ currentCups: todayRecords.length })

    // 设置问候语
    const hour = new Date().getHours()
    let greeting = '晚上好'
    if (hour < 12) {
      greeting = '早上好'
    } else if (hour < 18) {
      greeting = '下午好'
    }
    this.setData({ greeting })

    // 初始化画布
    this.initCanvas()
  },

  onShow() {
    // 页面显示时更新数据
    const dailyGoal = wx.getStorageSync('dailyGoal') || 8
    const todayRecords = wx.getStorageSync('todayRecords') || []
    this.setData({ 
      dailyGoal,
      currentCups: todayRecords.length
    })
    this.updateProgress()
  },

  initCanvas() {
    const ctx = wx.createCanvasContext('progressCircle', this)
    const radius = 160
    const centerX = 200
    const centerY = 200
    const strokeWidth = 20

    // 绘制背景圆
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.setStrokeStyle('#e5e7eb')
    ctx.setLineWidth(strokeWidth)
    ctx.stroke()

    // 绘制进度圆
    const progress = this.data.currentCups / this.data.dailyGoal
    const endAngle = -Math.PI / 2 + 2 * Math.PI * progress
    
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle)
    ctx.setStrokeStyle('#2b8cee')
    ctx.setLineWidth(strokeWidth)
    ctx.setLineCap('round')
    ctx.stroke()

    ctx.draw()
  },

  updateProgress() {
    this.initCanvas()
  },

  addCup() {
    // 震动反馈
    wx.vibrateShort()

    // 添加记录
    const todayRecords = wx.getStorageSync('todayRecords') || []
    const newRecord = {
      time: new Date().toLocaleTimeString('zh-CN', { hour12: false }),
      volume: 1
    }
    todayRecords.push(newRecord)
    wx.setStorageSync('todayRecords', todayRecords)

    // 更新UI
    this.setData({ currentCups: todayRecords.length })
    this.updateProgress()

    // 检查是否解锁勋章
    this.checkBadges()

    // 显示成功提示
    wx.showToast({
      title: '打卡成功!',
      icon: 'success',
      duration: 1500
    })

    // 重新计算下一次提醒时间
    this.calculateNextReminder()
  },

  undoCup() {
    const todayRecords = wx.getStorageSync('todayRecords') || []
    if (todayRecords.length > 0) {
      todayRecords.pop()
      wx.setStorageSync('todayRecords', todayRecords)
      this.setData({ currentCups: todayRecords.length })
      this.updateProgress()
      
      wx.showToast({
        title: '已撤销',
        icon: 'none',
        duration: 1000
      })
    }
  },

  checkBadges() {
    // 简单的勋章检查逻辑
    const todayRecords = wx.getStorageSync('todayRecords') || []
    const totalCups = wx.getStorageSync('totalCups') || 0
    
    // 检查是否解锁"饮水达人"勋章 (累计100杯)
    if (totalCups + todayRecords.length >= 100) {
      wx.showToast({
        title: '解锁饮水达人勋章!',
        icon: 'none',
        duration: 2000
      })
    }
  },

  calculateNextReminder() {
    // 简单的提醒时间计算
    const interval = wx.getStorageSync('reminderInterval') || 60
    this.setData({ nextReminder: `${interval}分钟` })
  }
})