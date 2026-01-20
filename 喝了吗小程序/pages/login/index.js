// pages/login/index.js
Page({
  data: {
    userInfo: null,
    clickCount: 0
  },

  onLoad() {
    console.log('登录页面加载完成')
  },

  onShow() {
    console.log('登录页面显示')
  },

  onReady() {
    console.log('登录页面首次渲染完成')
  },

  onLoginTap() {
    console.log('=== 登录按钮被点击 ===')
    
    // 增加点击计数
    this.setData({
      clickCount: this.data.clickCount + 1
    })
    
    console.log('点击次数:', this.data.clickCount)
    
    // 显示简单提示
    wx.showToast({
      title: '按钮被点击了',
      icon: 'success',
      duration: 1000
    })
    
    // 延迟执行授权
    setTimeout(() => {
      this.requestUserProfile()
    }, 1000)
  },

  requestUserProfile() {
    console.log('开始请求用户信息授权')
    
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        console.log('获取用户信息成功:', res)
          
        if (res.userInfo) {
          this.setData({
            userInfo: res.userInfo
          })
          
          // 保存用户信息到本地存储
          wx.setStorageSync('userInfo', res.userInfo)
          
          // 保存到全局变量
          const app = getApp()
          app.globalData.userInfo = res.userInfo
          
          // 同时调用 wx.login 获取 code
          wx.login({
            success: loginRes => {
              console.log('wx.login成功，code:', loginRes.code)
            },
            fail: loginErr => {
              console.error('wx.login失败:', loginErr)
            }
          })
          
          // 检查是否是首次登录
          const hasInitialized = wx.getStorageSync('hasInitialized')
          if (!hasInitialized) {
            // 首次登录，跳转到设置页面
            wx.showToast({
              title: '登录成功！正在跳转...',
              icon: 'success'
            })
            
            setTimeout(() => {
              wx.redirectTo({
                url: '/pages/settings/index?firstLogin=true'
              })
            }, 1500)
          } else {
            // 非首次登录，跳转到首页
            wx.showToast({
              title: '登录成功！',
              icon: 'success'
            })
            
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/home/index'
              })
            }, 1500)
          }
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