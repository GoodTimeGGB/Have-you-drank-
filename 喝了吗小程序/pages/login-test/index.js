// pages/login-test/index.js
Page({
  data: {
    clickCount: 0,
    userInfo: null
  },

  onLoad() {
    console.log('测试登录页面加载')
  },

  onShow() {
    console.log('测试登录页面显示')
  },

  onReady() {
    console.log('测试登录页面首次渲染完成')
  },

  onTestClick() {
    console.log('=== 测试按钮被点击 ===')
    
    this.setData({
      clickCount: this.data.clickCount + 1
    })
    
    console.log('点击次数:', this.data.clickCount)
    
    wx.showToast({
      title: '测试按钮点击了',
      icon: 'success'
    })
  },

  onLoginTap() {
    console.log('=== 登录按钮被点击 ===')
    
    this.setData({
      clickCount: this.data.clickCount + 1
    })
    
    console.log('点击次数:', this.data.clickCount)
    

    
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        console.log('获取用户信息成功:', res)
          
        if (res.userInfo) {
          this.setData({
            userInfo: res.userInfo
          })
          
          wx.setStorageSync('userInfo', res.userInfo)
          
          const app = getApp()
          app.globalData.userInfo = res.userInfo
          
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          })
          
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/home/index'
            })
          }, 1500)
        }
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err)
        wx.showToast({
          title: '授权失败',
          icon: 'error'
        })
      }
    })
  }
})