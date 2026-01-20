// pages/medals/index.js
Page({
  data: {
    totalMedals: 12,
    unlockedCount: 3,
    progressPercentage: 25,
    featuredMedal: {
      name: '水滴石穿',
      description: '连续打卡7天',
      image: '/images/medal-7days.png',
      date: '2024年1月15日'
    },
    medals: [
      {
        id: 1,
        name: '初尝甘露',
        description: '完成第一天打卡',
        image: '/images/medal-first.png',
        unlocked: true,
        date: '2024年1月1日'
      },
      {
        id: 2,
        name: '水滴石穿',
        description: '连续打卡7天',
        image: '/images/medal-7days.png',
        unlocked: true,
        date: '2024年1月15日'
      },
      {
        id: 3,
        name: '饮水达人',
        description: '累计喝水100杯',
        image: '/images/medal-100cups.png',
        unlocked: true,
        date: '2024年1月20日'
      },
      {
        id: 4,
        name: '早起第一杯',
        description: '08:00前喝水',
        image: '/images/medal-morning.png',
        unlocked: false,
        progress: 3
      },
      {
        id: 5,
        name: '夜猫子饮水',
        description: '22:00后喝水',
        image: '/images/medal-night.png',
        unlocked: false,
        progress: 0
      },
      {
        id: 6,
        name: '完美一天',
        description: '完成每日目标',
        image: '/images/medal-perfect.png',
        unlocked: false,
        progress: 5
      },
      {
        id: 7,
        name: '坚持就是胜利',
        description: '连续打卡14天',
        image: '/images/medal-14days.png',
        unlocked: false,
        progress: 2
      },
      {
        id: 8,
        name: '健康守护者',
        description: '连续打卡30天',
        image: '/images/medal-30days.png',
        unlocked: false,
        progress: 1
      },
      {
        id: 9,
        name: '水杯收藏家',
        description: '累计喝水500杯',
        image: '/images/medal-500cups.png',
        unlocked: false,
        progress: 20
      },
      {
        id: 10,
        name: '超级饮水王',
        description: '单日喝水超过15杯',
        image: '/images/medal-super.png',
        unlocked: false,
        progress: 0
      },
      {
        id: 11,
        name: '习惯养成',
        description: '连续打卡90天',
        image: '/images/medal-90days.png',
        unlocked: false,
        progress: 0
      },
      {
        id: 12,
        name: '饮水大师',
        description: '累计喝水1000杯',
        image: '/images/medal-master.png',
        unlocked: false,
        progress: 0
      }
    ]
  },

  onLoad() {
    // 检查本地存储的勋章解锁状态
    this.checkUnlockedMedals()
  },

  checkUnlockedMedals() {
    const unlockedMedals = wx.getStorageSync('unlockedMedals') || []
    const updatedMedals = this.data.medals.map(medal => {
      const isUnlocked = unlockedMedals.includes(medal.id)
      return { ...medal, unlocked: isUnlocked }
    })
    
    const unlockedCount = updatedMedals.filter(medal => medal.unlocked).length
    const progressPercentage = Math.round((unlockedCount / this.data.totalMedals) * 100)
    
    this.setData({
      medals: updatedMedals,
      unlockedCount,
      progressPercentage
    })
  },

  showMedalDetail(e) {
    const medalId = e.currentTarget.dataset.id
    const medal = this.data.medals.find(m => m.id === medalId)
    
    if (medal.unlocked) {
      wx.showModal({
        title: medal.name,
        content: `获得时间: ${medal.date}\n${medal.description}`,
        showCancel: false,
        confirmText: '确定'
      })
    } else {
      // 显示解锁条件
      let condition = ''
      if (medal.id === 4) { // 早起第一杯
        condition = '解锁条件: 连续3天在08:00前喝水'
      } else if (medal.id === 5) { // 夜猫子饮水
        condition = '解锁条件: 在22:00后喝水'
      } else if (medal.id === 6) { // 完美一天
        condition = '解锁条件: 每日完成目标杯数'
      } else {
        condition = '解锁条件: 持续喝水，加油!'
      }
      
      wx.showModal({
        title: medal.name,
        content: condition,
        showCancel: false,
        confirmText: '确定'
      })
    }
  },

  showMoreOptions() {
    wx.showActionSheet({
      itemList: ['分享成就', '查看说明', '帮助'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.shareAchievements()
            break
          case 1:
            this.showInstructions()
            break
          case 2:
            this.showHelp()
            break
        }
      }
    })
  },

  shareMedal() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  shareAchievements() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  showInstructions() {
    wx.showModal({
      title: '成就说明',
      content: '通过每日打卡可以解锁各种勋章，连续打卡可以获得更多成就！',
      showCancel: false,
      confirmText: '知道了'
    })
  },

  showHelp() {
    wx.showModal({
      title: '帮助',
      content: '如果您有任何问题或建议，请通过设置页面的反馈功能与我们联系。',
      showCancel: false,
      confirmText: '确定'
    })
  },

  onShareAppMessage() {
    return {
      title: `我已经获得了${this.data.unlockedCount}个饮水勋章!`,
      path: '/pages/medals/index',
      imageUrl: '/images/share-medals.png'
    }
  },

  onShareTimeline() {
    return {
      title: `我已经获得了${this.data.unlockedCount}个饮水勋章!`,
      query: '',
      imageUrl: '/images/share-medals.png'
    }
  }
})