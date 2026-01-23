// pages/privacy/index.js
Page({
  onShareAppMessage() {
    return {
      title: '隐私政策',
      path: '/pages/privacy/index'
    }
  },

  onShareTimeline() {
    return {
      title: '隐私政策',
      query: '',
      imageUrl: '/images/share-cover.png'
    }
  }
})