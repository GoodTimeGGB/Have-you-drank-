// pages/stats/index.js
Page({
  data: {
    weeklyAverage: 6.5,
    completionRate: 81,
    activePeriod: 'week',
    weeklyData: [6, 8, 5, 7, 9, 6, 8],
    monthlyData: [210, 230, 180, 250],
    todayTimeline: [
      { time: '08:30' },
      { time: '10:15' },
      { time: '12:45' },
      { time: '15:20' }
    ]
  },

  onLoad() {
    // 初始化图表
    this.initBarChart()
  },

  switchPeriod(e) {
    const period = e.currentTarget.dataset.period
    this.setData({ activePeriod: period })
    
    // 重新初始化图表
    this.initBarChart()
  },

  initBarChart() {
    const ctx = wx.createCanvasContext('barChart', this)
    const width = 600
    const height = 300
    const padding = 40

    // 清空画布
    ctx.clearRect(0, 0, width, height)

    if (this.data.activePeriod === 'week') {
      this.drawWeeklyChart(ctx, width, height, padding)
    } else {
      this.drawMonthlyChart(ctx, width, height, padding)
    }

    ctx.draw()
  },

  drawWeeklyChart(ctx, width, height, padding) {
    const data = this.data.weeklyData
    const maxValue = Math.max(...data)
    const barWidth = (width - padding * 2 - 60) / 7
    
    // 绘制坐标轴
    ctx.setStrokeStyle('#e5e7eb')
    ctx.setLineWidth(2)
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // 绘制柱状图
    data.forEach((value, index) => {
      const x = padding + index * (barWidth + 10)
      const y = height - padding
      const barHeight = (value / maxValue) * (height - padding * 2)
      
      // 柱体填充色
      const isGoalReached = value >= 8
      ctx.setFillStyle(isGoalReached ? '#2b8cee' : '#e5e7eb')
      ctx.fillRect(x, y - barHeight, barWidth, barHeight)
      
      // 顶部数值
      ctx.setFillStyle('#1a1a1a')
      ctx.setFontSize(24)
      ctx.setTextAlign('center')
      ctx.fillText(value, x + barWidth / 2, y - barHeight - 20)
    })

    // 绘制x轴标签
    const days = ['一', '二', '三', '四', '五', '六', '日']
    ctx.setFillStyle('#666666')
    ctx.setFontSize(24)
    ctx.setTextAlign('center')
    days.forEach((day, index) => {
      const x = padding + index * (barWidth + 10) + barWidth / 2
      ctx.fillText(`周${day}`, x, height - padding + 40)
    })
  },

  drawMonthlyChart(ctx, width, height, padding) {
    const data = this.data.monthlyData
    const maxValue = Math.max(...data)
    const barWidth = (width - padding * 2 - 30) / 4
    
    // 绘制坐标轴
    ctx.setStrokeStyle('#e5e7eb')
    ctx.setLineWidth(2)
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height - padding)
    ctx.lineTo(width - padding, height - padding)
    ctx.stroke()

    // 绘制柱状图
    data.forEach((value, index) => {
      const x = padding + index * (barWidth + 10)
      const y = height - padding
      const barHeight = (value / maxValue) * (height - padding * 2)
      
      ctx.setFillStyle('#2b8cee')
      ctx.fillRect(x, y - barHeight, barWidth, barHeight)
      
      // 顶部数值
      ctx.setFillStyle('#1a1a1a')
      ctx.setFontSize(24)
      ctx.setTextAlign('center')
      ctx.fillText(value, x + barWidth / 2, y - barHeight - 20)
    })

    // 绘制x轴标签
    const months = ['1月', '2月', '3月', '4月']
    ctx.setFillStyle('#666666')
    ctx.setFontSize(24)
    ctx.setTextAlign('center')
    months.forEach((month, index) => {
      const x = padding + index * (barWidth + 10) + barWidth / 2
      ctx.fillText(month, x, height - padding + 40)
    })
  },

  shareStats() {
    // 分享功能
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  onShareAppMessage() {
    return {
      title: `我本周平均每天喝${this.data.weeklyAverage}杯水，完成率${this.data.completionRate}%`,
      path: '/pages/home/index',
      imageUrl: '/images/share-cover.png'
    }
  },

  onShareTimeline() {
    return {
      title: `我本周平均每天喝${this.data.weeklyAverage}杯水，完成率${this.data.completionRate}%`,
      query: '',
      imageUrl: '/images/share-cover.png'
    }
  }
})