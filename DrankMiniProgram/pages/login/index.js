// pages/login/index.js
Page({
  data: {
    userInfo: null
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
    console.log('=== 微信一键登录 ===')
    
    // 使用最新的微信一键登录API
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