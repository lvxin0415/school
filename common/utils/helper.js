/**
 * 工具函数集合
 */

// 匿名昵称词库
const ANIMAL_NAMES = [
  '小熊', '小兔', '小鹿', '小狐', '小猫', '小狗', '企鹅', '考拉',
  '海豚', '松鼠', '刺猬', '水獭', '熊猫', '仓鼠', '柴犬', '猫头鹰',
  '独角兽', '小龙', '凤凰', '麒麟', '小鲸', '海星', '萤火虫', '蝴蝶'
]

const ADJECTIVES = [
  '匿名', '神秘', '低调', '温柔', '开心', '可爱', '勇敢', '安静',
  '活泼', '善良', '聪明', '阳光', '淡定', '佛系', '元气', '暴躁'
]

// 生成随机匿名昵称
export function randomAnonymousName() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
  const animal = ANIMAL_NAMES[Math.floor(Math.random() * ANIMAL_NAMES.length)]
  return `${adj}${animal}`
}

// 生成随机头像颜色
export function randomAvatarColor() {
  const colors = [
    '#94C1D6', '#747CBB', '#B8A2CA', '#E8A87C', '#85C88A',
    '#F7C59F', '#D4A5A5', '#9ED2C6', '#C9B1FF', '#FFB7B2'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// 格式化时间
export function formatTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`

  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const h = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')

  if (y === now.getFullYear()) return `${m}-${d} ${h}:${min}`
  return `${y}-${m}-${d} ${h}:${min}`
}

// 格式化日期 YYYY-MM-DD
export function formatDate(date) {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// 格式化学习时长
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}分钟`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}小时${m}分钟` : `${h}小时`
}

// 数字千分位
export function formatNumber(num) {
  if (num >= 10000) return `${(num / 10000).toFixed(1)}万`
  return String(num)
}

// 检查登录状态
export function checkLogin() {
  const token = uni.getStorageSync('uni_id_token')
  if (!token) {
    uni.navigateTo({ url: '/pages/login/login' })
    return false
  }
  return true
}

// 防抖
export function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

// 节流
export function throttle(fn, interval = 300) {
  let last = 0
  return function (...args) {
    const now = Date.now()
    if (now - last >= interval) {
      last = now
      fn.apply(this, args)
    }
  }
}
