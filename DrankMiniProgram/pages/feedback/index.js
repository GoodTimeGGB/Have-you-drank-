// pages/feedback/index.js
Page({
  data: {
    selectedType: 'bug',
    feedbackContent: '',
    contactInfo: '',
    submitting: false,
    canSubmit: false
  },

  onInputChange(e) {
    this.setData({
      feedbackContent: e.detail.value,
      canSubmit: e.detail.value.trim().length > 0
    })
  },

  onContactChange(e) {
    this.setData({
      contactInfo: e.detail.value
    })
  },

  submitFeedback() {
    if (!this.data.canSubmit) return

    this.setData({ submitting: true })

    // 显示加载提示
    wx.showLoading({
      title: '提交中...'
    })

    // 模拟提交请求
    setTimeout(() => {
      // 保存反馈到本地存储
      const feedbacks = wx.getStorageSync('feedbacks') || []
      feedbacks.push({
        id: Date.now(),
        type: this.data.selectedType,
        content: this.data.feedbackContent,
        contact: this.data.contactInfo,
        date: new Date().toLocaleString('zh-CN')
      })
      wx.setStorageSync('feedbacks', feedbacks)

      // 显示成功提示
      wx.showToast({
        title: '反馈提交成功',
        icon: 'success',
        duration: 2000
      })

      // 重置表单
      this.setData({
        selectedType: 'bug',
        feedbackContent: '',
        contactInfo: '',
        submitting: false,
        canSubmit: false
      })

      // 延迟返回
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    }, 1500)
  },

  onShareAppMessage() {
    return {
      title: '意见反馈',
      path: '/pages/feedback/index'
    }
  },

  onShareTimeline() {
    return {
      title: '意见反馈',
      query: '',
      imageUrl: '/images/share-cover.png'
    }
  }
})