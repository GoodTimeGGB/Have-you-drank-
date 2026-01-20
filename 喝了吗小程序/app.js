// app.js
App({
  onLaunch() {
    // 检查用户是否已登录
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.globalData.userInfo = userInfo
    }

    // 检查今日是否已初始化饮水记录
    this.checkTodayRecord()
  },

  checkTodayRecord() {
    const today = new Date().toDateString()
    const lastRecordDate = wx.getStorageSync('lastRecordDate')
    
    if (lastRecordDate !== today) {
      // 新的一天，重置今日记录
      wx.setStorageSync('lastRecordDate', today)
      wx.setStorageSync('todayRecords', [])
    }
  },

  globalData: {
    userInfo: null,
    dailyGoal: 8,
    reminderInterval: 60,
    quietHours: {
      start: '23:00',
      end: '07:00'
    },
    notificationsEnabled: true
  }
})