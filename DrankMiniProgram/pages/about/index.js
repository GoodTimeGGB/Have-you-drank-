// pages/about/index.js
Page({
  data: {
    version: '1.0.0',
    copyright: '© 2024 喝了吗. 保留所有权利。'
  },

  onShareAppMessage() {
    return {
      title: '关于我们',
      path: '/pages/about/index'
    }
  },

  onShareTimeline() {
    return {
      title: '关于我们',
      query: '',
      imageUrl: '/images/share-cover.png'
    }
  }
})