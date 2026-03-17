<template>
  <view class="course-page">
    <view class="week-bar">
      <view class="time-corner">
        <text class="corner-text">节次</text>
      </view>
      <view v-for="(d, i) in weekDays" :key="i" class="week-cell" :class="{ active: i === todayIndex }">
        <text class="week-label">周{{ d }}</text>
        <view v-if="i === todayIndex" class="today-dot"></view>
      </view>
    </view>

    <scroll-view scroll-y class="course-scroll">
      <view class="time-grid">
        <view v-for="slot in timeSlots" :key="slot.label" class="time-row">
          <view class="time-label-cell">
            <text class="slot-num">{{ slot.label }}</text>
            <text class="slot-time">{{ slot.time }}</text>
          </view>
          <view v-for="(d, i) in weekDays" :key="i" class="grid-cell" :class="{ 'today-col': i === todayIndex }">
            <view
              v-if="getCourse(i, slot.index)"
              class="course-block"
              :style="{ background: getCourse(i, slot.index).color }"
            >
              <text class="cb-name">{{ getCourse(i, slot.index).name }}</text>
              <text class="cb-room">{{ getCourse(i, slot.index).room }}</text>
            </view>
          </view>
        </view>
      </view>

      <view v-if="!courses.length" class="empty-box">
        <text class="ri-calendar-line empty-ico"></text>
        <text class="empty-t">暂无课程数据</text>
        <text class="empty-d">请在设置中导入课程表</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const weekDays = ['一', '二', '三', '四', '五', '六', '日']
const todayIndex = (new Date().getDay() || 7) - 1
const timeSlots = [
  { label: '第1节', time: '08:00', index: 1 },
  { label: '第2节', time: '08:50', index: 2 },
  { label: '第3节', time: '10:00', index: 3 },
  { label: '第4节', time: '10:50', index: 4 },
  { label: '第5节', time: '14:00', index: 5 },
  { label: '第6节', time: '14:50', index: 6 },
  { label: '第7节', time: '16:00', index: 7 },
  { label: '第8节', time: '16:50', index: 8 }
]

const courses = ref([])
const colors = ['rgba(148,193,214,0.3)', 'rgba(116,124,187,0.3)', 'rgba(184,162,202,0.3)', 'rgba(232,168,124,0.3)', 'rgba(92,184,92,0.3)', 'rgba(240,173,78,0.3)']

function getCourse(dayIndex, slotIndex) {
  return courses.value.find(c => c.day === dayIndex && c.slot === slotIndex)
}
</script>

<style scoped>
.course-page {
  min-height: 100vh;
  background: #F7F6FA;
}

.week-bar {
  display: flex;
  background: #FFFFFF;
  border-bottom: 1rpx solid #ECEAF0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 10;
}

.time-corner {
  width: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: #8C61D6;
}

.corner-text {
  font-size: 22rpx;
  color: #FFFFFF;
  font-weight: 600;
}

.week-cell {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
  position: relative;
}

.week-cell.active {
  background: rgba(140, 97, 214, 0.05);
}

.week-label {
  font-size: 24rpx;
  color: #747288;
  font-weight: 500;
}

.week-cell.active .week-label {
  color: #8C61D6;
  font-weight: 700;
}

.today-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: #8C61D6;
  margin-top: 6rpx;
}

.course-scroll {
  height: calc(100vh - 90rpx);
}

.time-grid {
  padding-bottom: 40rpx;
}

.time-row {
  display: flex;
  min-height: 130rpx;
  border-bottom: 1rpx solid #ECEAF0;
}

.time-label-cell {
  width: 100rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(140, 97, 214, 0.02);
  border-right: 1rpx solid #ECEAF0;
}

.slot-num {
  font-size: 22rpx;
  color: #6B47B8;
  font-weight: 600;
}

.slot-time {
  font-size: 18rpx;
  color: #A09CAE;
  margin-top: 4rpx;
}

.grid-cell {
  flex: 1;
  padding: 4rpx;
  min-height: 130rpx;
  border-right: 1rpx solid rgba(236, 234, 240, 0.6);
}

.grid-cell.today-col {
  background: rgba(140, 97, 214, 0.03);
}

.course-block {
  border-radius: 12rpx;
  padding: 10rpx 6rpx;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-left: 4rpx solid rgba(140, 97, 214, 0.3);
}

.cb-name {
  font-size: 20rpx;
  color: #3A3030;
  font-weight: 700;
  text-align: center;
  line-height: 1.3;
}

.cb-room {
  font-size: 18rpx;
  color: #8C61D6;
  text-align: center;
  margin-top: 6rpx;
}

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-t {
  font-size: 30rpx;
  color: #747288;
  font-weight: 600;
  margin-top: 24rpx;
}

.empty-d {
  font-size: 24rpx;
  color: #A09CAE;
  margin-top: 8rpx;
}

.empty-ico {
  font-size: 64rpx;
  color: #A09CAE;
}
</style>
