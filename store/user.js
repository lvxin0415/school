import { defineStore } from 'pinia'
import { callCloud } from '@/common/utils/request.js'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: uni.getStorageSync('uni_id_token') || '',
    userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
    isAdmin: false,
    unreadCount: 0
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userId: (state) => state.userInfo._id || '',
    nickname: (state) => state.userInfo.nickname || '未设置昵称',
    avatar: (state) => state.userInfo.avatar || '',
    role: (state) => state.userInfo.role || 'user'
  },

  actions: {
    // 登录
    async login(username, password) {
      const res = await callCloud('user-login', { username, password })
      const d = res.data || res
      this.token = d.token
      this.userInfo = d.userInfo || {}
      this.isAdmin = (d.userInfo && d.userInfo.role) === 'admin'
      uni.setStorageSync('uni_id_token', d.token)
      uni.setStorageSync('userInfo', JSON.stringify(this.userInfo))
      return d
    },

    // 注册（注册成功后自动调用登录）
    async register(username, password, nickname) {
      await callCloud('user-register', { username, password, nickname })
      const loginRes = await this.login(username, password)
      return loginRes
    },

    // 退出登录
    logout() {
      this.token = ''
      this.userInfo = {}
      this.isAdmin = false
      this.unreadCount = 0
      uni.removeStorageSync('uni_id_token')
      uni.removeStorageSync('uni_id_token_expired')
      uni.removeStorageSync('userInfo')
      uni.reLaunch({ url: '/pages/login/login' })
    },

    // 更新用户信息
    setUserInfo(info) {
      this.userInfo = { ...this.userInfo, ...info }
      uni.setStorageSync('userInfo', JSON.stringify(this.userInfo))
    },

    // 获取未读消息数
    async fetchUnreadCount() {
      try {
        const res = await callCloud('get-unread-count', {})
        this.unreadCount = res.count || 0
      } catch (e) {
        console.error('获取未读数失败', e)
      }
    },

    // 检查Token有效性
    async checkToken() {
      if (!this.token) return false
      try {
        const res = await callCloud('check-token', {})
        if (res.code === 0) {
          this.userInfo = res.userInfo
          this.isAdmin = res.userInfo.role === 'admin'
          return true
        }
        return false
      } catch (e) {
        return false
      }
    }
  }
})
