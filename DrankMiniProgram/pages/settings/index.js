// pages/settings/index.js
Page({
  data: {
    firstLogin: false,
    userInfo: null,
    dailyGoal: 8,
    reminderInterval: 60,
    quietModeEnabled: true,
    quietStartTime: '23:00',
    quietEndTime: '07:00',
    notificationsEnabled: true,
    hapticEnabled: true,
    soundName: '水滴声',
    intervalOptions: ['45分钟', '60分钟', '90分钟'],
    selectedIntervalIndex: 1,
    soundOptions: ['水滴声', '鸟鸣声', '钢琴声', '振动'],
    selectedSoundIndex: 0
  },

  onLoad(options) {
    // 检查是否是首次登录
    if (options.firstLogin === 'true') {
      this.setData({ firstLogin: true })
    }

    // 获取用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    }

    // 获取存储的设置
    const dailyGoal = wx.getStorageSync('dailyGoal') || 8
    const reminderInterval = wx.getStorageSync('reminderInterval') || 60
    const quietModeEnabled = wx.getStorageSync('quietModeEnabled') !== false
    const quietStartTime = wx.getStorageSync('quietStartTime') || '23:00'
    const quietEndTime = wx.getStorageSync('quietEndTime') || '07:00'
    const notificationsEnabled = wx.getStorageSync('notificationsEnabled') !== false
    const hapticEnabled = wx.getStorageSync('hapticEnabled') !== false
    
    // 计算间隔选项索引
    const intervalOptions = ['45分钟', '60分钟', '90分钟']
    const selectedIntervalIndex = intervalOptions.findIndex(opt => 
      parseInt(opt) === reminderInterval
    )

    this.setData({
      dailyGoal,
      reminderInterval,
      quietModeEnabled,
      quietStartTime,
      quietEndTime,
      notificationsEnabled,
      hapticEnabled,
      selectedIntervalIndex
    })

    // 获取全局数据
    const app = getApp()
    app.globalData.dailyGoal = dailyGoal
    app.globalData.reminderInterval = reminderInterval
    app.globalData.quietHours = {
      start: quietStartTime,
      end: quietEndTime
    }
    app.globalData.notificationsEnabled = notificationsEnabled
  },

  onDailyGoalChange(e) {
    const value = parseInt(e.detail.value)
    this.setData({ dailyGoal: value })
  },

  onIntervalChange(e) {
    const index = e.detail.value
    const interval = parseInt(this.data.intervalOptions[index])
    
    this.setData({
      selectedIntervalIndex: index,
      reminderInterval: interval
    })
  },

  onQuietModeChange(e) {
    this.setData({ quietModeEnabled: e.detail.value })
  },

  onStartTimeChange(e) {
    this.setData({ quietStartTime: e.detail.value })
  },

  onEndTimeChange(e) {
    this.setData({ quietEndTime: e.detail.value })
  },

  onNotificationsChange(e) {
    const enabled = e.detail.value
    this.setData({ notificationsEnabled: enabled })
    
    if (enabled) {
      // 请求通知权限
      this.requestNotificationPermission()
    }
  },

  onHapticChange(e) {
    this.setData({ hapticEnabled: e.detail.value })
  },

  onSoundChange(e) {
    const index = e.detail.value
    const soundName = this.data.soundOptions[index]
    this.setData({
      selectedSoundIndex: index,
      soundName
    })
  },

  requestNotificationPermission() {
    wx.requestSubscribeMessage({
      tmplIds: ['YOUR_TEMPLATE_ID'],
      success: (res) => {
        console.log('通知订阅成功:', res)
      },
      fail: (err) => {
        console.error('通知订阅失败:', err)
      }
    })
  },

  // 选择头像
  chooseAvatar() {
    const that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('选择头像成功:', res)
        const tempFilePath = res.tempFiles[0].tempFilePath
        
        // 更新用户信息
        let userInfo = this.data.userInfo || {}
        userInfo.avatarUrl = tempFilePath
        
        this.setData({
          userInfo: userInfo
        })
        
        // 保存到本地存储
        wx.setStorageSync('userInfo', userInfo)
        
        // 更新全局数据
        const app = getApp()
        app.globalData.userInfo = userInfo
        
        wx.showToast({
          title: '头像更新成功',
          icon: 'success'
        })
      },
      fail: (err) => {
        console.error('选择头像失败:', err)
        wx.showToast({
          title: '选择头像失败',
          icon: 'error'
        })
      }
    })
  },

  // 更新昵称
  updateNickname() {
    const that = this
    wx.showModal({
      title: '修改昵称',
      editable: true,
      placeholderText: '请输入新昵称',
      success: (res) => {
        if (res.confirm && res.content.trim()) {
          // 更新用户信息
          let userInfo = that.data.userInfo || {}
          userInfo.nickName = res.content.trim()
          
          that.setData({
            userInfo: userInfo
          })
          
          // 保存到本地存储
          wx.setStorageSync('userInfo', userInfo)
          
          // 更新全局数据
          const app = getApp()
          app.globalData.userInfo = userInfo
          
          wx.showToast({
            title: '昵称更新成功',
            icon: 'success'
          })
        }
      }
    })
  },

  saveSettings() {
    // 保存设置到本地存储
    const { dailyGoal, reminderInterval, quietModeEnabled, quietStartTime, quietEndTime, notificationsEnabled, hapticEnabled, soundName } = this.data
    
    wx.setStorageSync('dailyGoal', dailyGoal)
    wx.setStorageSync('reminderInterval', reminderInterval)
    wx.setStorageSync('quietModeEnabled', quietModeEnabled)
    wx.setStorageSync('quietStartTime', quietStartTime)
    wx.setStorageSync('quietEndTime', quietEndTime)
    wx.setStorageSync('notificationsEnabled', notificationsEnabled)
    wx.setStorageSync('hapticEnabled', hapticEnabled)
    wx.setStorageSync('notificationSound', soundName)
    wx.setStorageSync('hasInitialized', true)

    // 更新全局数据
    const app = getApp()
    app.globalData.dailyGoal = dailyGoal
    app.globalData.reminderInterval = reminderInterval
    app.globalData.quietHours = {
      start: quietStartTime,
      end: quietEndTime
    }
    app.globalData.notificationsEnabled = notificationsEnabled

    // 显示保存成功提示
    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 1500
    })

    // 如果是首次登录，跳转到首页
    if (this.data.firstLogin) {
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/home/index'
        })
      }, 1500)
    }
  },

  resetData() {
    wx.showModal({
      title: '确认重置',
      content: '确定要重置所有数据吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储
          wx.removeStorageSync('userInfo')
          wx.removeStorageSync('dailyGoal')
          wx.removeStorageSync('reminderInterval')
          wx.removeStorageSync('quietModeEnabled')
          wx.removeStorageSync('quietStartTime')
          wx.removeStorageSync('quietEndTime')
          wx.removeStorageSync('notificationsEnabled')
          wx.removeStorageSync('hapticEnabled')
          wx.removeStorageSync('notificationSound')
          wx.removeStorageSync('todayRecords')
          wx.removeStorageSync('lastRecordDate')
          wx.removeStorageSync('unlockedMedals')
          wx.removeStorageSync('hasInitialized')

          // 重置页面数据
          this.setData({
            dailyGoal: 8,
            reminderInterval: 60,
            quietModeEnabled: true,
            quietStartTime: '23:00',
            quietEndTime: '07:00',
            notificationsEnabled: true,
            hapticEnabled: true,
            soundName: '水滴声',
            selectedIntervalIndex: 1,
            selectedSoundIndex: 0
          })

          // 更新全局数据
          const app = getApp()
          app.globalData.dailyGoal = 8
          app.globalData.reminderInterval = 60
          app.globalData.quietHours = {
            start: '23:00',
            end: '07:00'
          }
          app.globalData.notificationsEnabled = true

          wx.showToast({
            title: '数据已重置',
            icon: 'success'
          })
        }
      }
    })
  }
})