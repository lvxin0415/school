<template>
  <view class="stats-page">
    <!-- 学习日历 -->
    <view class="card">
      <text class="card-title">学习日历</text>
      <view class="calendar-header">
        <text class="cal-arrow" @click="prevMonth">‹</text>
        <text class="cal-month">{{ currentYear }}年{{ currentMonth }}月</text>
        <text class="cal-arrow" @click="nextMonth">›</text>
      </view>
      <view class="cal-weekdays">
        <text v-for="w in weekdays" :key="w" class="cal-wd">{{ w }}</text>
      </view>
      <view class="cal-days">
        <view v-for="(d, i) in calendarDays" :key="i" class="cal-day" :class="{ empty: !d.day, today: d.isToday, checked: d.checked }" :style="d.checked ? { opacity: 0.4 + d.level * 0.2 } : {}">
          <text v-if="d.day" class="day-num">{{ d.day }}</text>
        </view>
      </view>
    </view>

    <!-- 本周统计 -->
    <view class="card">
      <text class="card-title">本周学习时长</text>
      <view class="bar-chart">
        <view v-for="(bar, i) in weekBars" :key="i" class="bar-col">
          <view class="bar-fill" :style="{ height: bar.height + '%' }"></view>
          <text class="bar-val">{{ bar.value }}m</text>
          <text class="bar-label">{{ bar.label }}</text>
        </view>
      </view>
    </view>

    <!-- 科目占比 -->
    <view class="card">
      <text class="card-title">科目分布</text>
      <view v-if="subjectList.length" class="subject-bars">
        <view v-for="s in subjectList" :key="s.name" class="sb-row">
          <text class="sb-name">{{ s.name }}</text>
          <view class="sb-bar-bg">
            <view class="sb-bar-fill" :style="{ width: s.percent + '%' }"></view>
          </view>
          <text class="sb-pct">{{ s.percent }}%</text>
        </view>
      </view>
      <view v-else class="empty-t"><text>暂无数据</text></view>
    </view>

    <!-- 累计数据 -->
    <view class="card">
      <text class="card-title">累计数据</text>
      <view class="summary-grid">
        <view class="sum-item">
          <text class="sum-num">{{ formatDuration(totalMinutes) }}</text>
          <text class="sum-label">总学习时长</text>
        </view>
        <view class="sum-item">
          <text class="sum-num">{{ totalDays }}天</text>
          <text class="sum-label">总打卡天数</text>
        </view>
        <view class="sum-item">
          <text class="sum-num">{{ maxStreak }}天</text>
          <text class="sum-label">最长连续打卡</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'
import { formatDuration } from '@/common/utils/helper.js'

const weekdays = ['日', '一', '二', '三', '四', '五', '六']
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth() + 1)
const checkedDates = ref({})
const weekData = ref([0, 0, 0, 0, 0, 0, 0])
const subjectList = ref([])
const totalMinutes = ref(0)
const totalDays = ref(0)
const maxStreak = ref(0)

const calendarDays = computed(() => {
  const y = currentYear.value, m = currentMonth.value
  const firstDay = new Date(y, m - 1, 1).getDay()
  const daysInMonth = new Date(y, m, 0).getDate()
  const today = new Date()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push({ day: 0 })
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    const isToday = y === today.getFullYear() && m === today.getMonth() + 1 && d === today.getDate()
    const info = checkedDates.value[key]
    days.push({ day: d, isToday, checked: !!info, level: info ? Math.min(3, Math.ceil(info / 60)) : 0 })
  }
  return days
})

const weekBars = computed(() => {
  const labels = ['一', '二', '三', '四', '五', '六', '日']
  const max = Math.max(...weekData.value, 1)
  return weekData.value.map((v, i) => ({
    label: labels[i], value: v, height: (v / max) * 100
  }))
})

function prevMonth() {
  if (currentMonth.value === 1) { currentYear.value--; currentMonth.value = 12 }
  else currentMonth.value--
  loadMonthData()
}

function nextMonth() {
  if (currentMonth.value === 12) { currentYear.value++; currentMonth.value = 1 }
  else currentMonth.value++
  loadMonthData()
}

async function loadMonthData() {
  try {
    const res = await callCloud('get-study-calendar', { year: currentYear.value, month: currentMonth.value })
    checkedDates.value = res.dates || {}
  } catch (e) { console.error(e) }
}

async function loadStats() {
  try {
    const res = await callCloud('get-study-stats', {})
    weekData.value = res.weekData || [0,0,0,0,0,0,0]
    subjectList.value = res.subjects || []
    totalMinutes.value = res.totalMinutes || 0
    totalDays.value = res.totalDays || 0
    maxStreak.value = res.maxStreak || 0
  } catch (e) { console.error(e) }
}

onMounted(() => { loadMonthData(); loadStats() })
</script>

<style scoped>
.stats-page {
  min-height: 100vh;
  background: #F7F6FA;
  padding: 20rpx 24rpx 60rpx;
}

.card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.card-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #3A3030;
  display: block;
  margin-bottom: 24rpx;
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40rpx;
  margin-bottom: 20rpx;
}

.cal-arrow {
  font-size: 40rpx;
  color: #8C61D6;
  padding: 10rpx 20rpx;
}

.cal-month {
  font-size: 28rpx;
  font-weight: 600;
  color: #3A3030;
}

.cal-weekdays {
  display: flex;
}

.cal-wd {
  flex: 1;
  text-align: center;
  font-size: 22rpx;
  color: #A09CAE;
  padding: 8rpx 0;
}

.cal-days {
  display: flex;
  flex-wrap: wrap;
}

.cal-day {
  width: calc(100% / 7);
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cal-day.empty {
  visibility: hidden;
}

.day-num {
  font-size: 26rpx;
  color: #3A3030;
  width: 56rpx;
  height: 56rpx;
  line-height: 56rpx;
  text-align: center;
  border-radius: 50%;
}

.cal-day.today .day-num {
  border: 2rpx solid #8C61D6;
  color: #8C61D6;
  font-weight: 700;
}

.cal-day.checked .day-num {
  background: #8C61D6;
  color: #FFFFFF;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  height: 300rpx;
  gap: 16rpx;
  padding-top: 20rpx;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}

.bar-fill {
  width: 48rpx;
  background: #8C61D6;
  border-radius: 8rpx 8rpx 0 0;
  min-height: 4rpx;
  transition: height 0.4s;
}

.bar-val {
  font-size: 20rpx;
  color: #8C61D6;
  margin-top: 6rpx;
}

.bar-label {
  font-size: 22rpx;
  color: #A09CAE;
  margin-top: 4rpx;
}

.subject-bars {}

.sb-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.sb-name {
  font-size: 26rpx;
  color: #3A3030;
  width: 100rpx;
  flex-shrink: 0;
}

.sb-bar-bg {
  flex: 1;
  height: 24rpx;
  background: #F7F6FA;
  border-radius: 12rpx;
  overflow: hidden;
  margin: 0 16rpx;
}

.sb-bar-fill {
  height: 100%;
  background: #8C61D6;
  border-radius: 12rpx;
  transition: width 0.4s;
}

.sb-pct {
  font-size: 24rpx;
  color: #8C61D6;
  width: 80rpx;
  text-align: right;
}

.summary-grid {
  display: flex;
}

.sum-item {
  flex: 1;
  text-align: center;
}

.sum-num {
  font-size: 36rpx;
  font-weight: 700;
  color: #8C61D6;
  display: block;
}

.sum-label {
  font-size: 22rpx;
  color: #A09CAE;
  margin-top: 8rpx;
  display: block;
}

.empty-t {
  text-align: center;
  padding: 40rpx;
  font-size: 26rpx;
  color: #A09CAE;
}
</style>
