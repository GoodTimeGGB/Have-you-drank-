// pages/terms/index.js
Page({
  onShareAppMessage() {
    return {
      title: '服务条款',
      path: '/pages/terms/index'
    }
  },

  onShareTimeline() {
    return {
      title: '服务条款',
      query: '',
      imageUrl: '/images/share-cover.png'
    }
  }
})