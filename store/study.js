import { defineStore } from 'pinia'
import { callCloud } from '@/common/utils/request.js'

export const useStudyStore = defineStore('study', {
  state: () => ({
    isTimerRunning: false,
    timerSeconds: 0,
    currentSubject: '',
    todayRecords: [],
    weekStats: [],
    totalDays: 0,
    totalMinutes: 0,
    streakDays: 0,
    points: 0,
    badges: []
  }),

  getters: {
    timerDisplay: (state) => {
      const h = Math.floor(state.timerSeconds / 3600)
      const m = Math.floor((state.timerSeconds % 3600) / 60)
      const s = state.timerSeconds % 60
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    },
    todayTotalMinutes: (state) => {
      return state.todayRecords.reduce((sum, r) => sum + r.duration_min, 0)
    }
  },

  actions: {
    startTimer(subject) {
      this.currentSubject = subject
      this.isTimerRunning = true
      this.timerSeconds = 0
    },

    tick() {
      if (this.isTimerRunning) {
        this.timerSeconds++
      }
    },

    stopTimer() {
      this.isTimerRunning = false
      return Math.ceil(this.timerSeconds / 60)
    },

    resetTimer() {
      this.isTimerRunning = false
      this.timerSeconds = 0
      this.currentSubject = ''
    },

    async fetchStudyData() {
      try {
        const res = await callCloud('get-study-stats', {})
        this.totalDays = res.totalDays || 0
        this.totalMinutes = res.totalMinutes || 0
        this.streakDays = res.streakDays || 0
        this.points = res.points || 0
        this.badges = res.badges || []
        this.weekStats = res.weekStats || []
      } catch (e) {
        console.error('获取学习数据失败', e)
      }
    },

    async submitCheckin(data) {
      const res = await callCloud('study-checkin', data)
      return res
    }
  }
})
