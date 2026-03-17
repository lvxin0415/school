<template>
  <view class="checkin-page">
    <!-- 计时器区域 -->
    <view class="timer-section">
      <view class="timer-outer" :class="{ running: studyStore.isTimerRunning }">
        <view class="timer-ring" :class="{ running: studyStore.isTimerRunning }">
          <view class="timer-inner">
            <text class="timer-text">{{ studyStore.timerDisplay }}</text>
            <text class="timer-label">{{ studyStore.isTimerRunning ? '专注学习中' : '准备开始' }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 科目选择 -->
    <view class="subject-section">
      <view class="sec-title-row">
        <view class="sec-title-bar"></view>
        <text class="sec-title">选择科目</text>
      </view>
      <view class="subject-list">
        <text
          v-for="s in subjects"
          :key="s"
          class="sub-tag"
          :class="{ active: selectedSubject === s }"
          @click="selectedSubject = s"
        >{{ s }}</text>
        <view class="sub-input-wrap">
          <input
            v-model="customSubject"
            class="sub-input"
            placeholder="+ 自定义"
            maxlength="8"
            @confirm="addSubject"
          />
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="btn-section">
      <button v-if="!studyStore.isTimerRunning && !showResult" class="btn-start" @click="startStudy">
        开始学习
      </button>
      <button v-if="studyStore.isTimerRunning" class="btn-stop" @click="stopStudy">
        结束学习
      </button>
    </view>

    <!-- 手动录入 -->
    <view v-if="!studyStore.isTimerRunning && !showResult" class="manual-section">
      <text class="manual-title">手动输入学习时长</text>
      <view class="manual-row">
        <view class="manual-input-wrap">
          <input v-model="manualMinutes" class="manual-input" type="number" placeholder="分钟数" />
          <text class="manual-unit">min</text>
        </view>
        <button class="btn-manual" @click="manualCheckin">提交打卡</button>
      </view>
    </view>

    <!-- 打卡结果弹窗 -->
    <view v-if="showResult" class="result-overlay">
      <view class="result-card">
        <view class="result-icon-wrap">
          <text class="ri-checkbox-circle-fill result-check-ico"></text>
        </view>
        <text class="result-title">打卡成功</text>
        <view class="result-info-row">
          <view class="result-info-item">
            <text class="result-info-num">{{ formatDuration(resultMinutes) }}</text>
            <text class="result-info-label">学习时长</text>
          </view>
          <view v-if="earnedPoints > 0" class="result-info-item">
            <text class="result-info-num result-points">+{{ earnedPoints }}</text>
            <text class="result-info-label">获得积分</text>
          </view>
        </view>
        <view class="result-note">
          <textarea
            v-model="note"
            class="note-input"
            placeholder="写一句打卡感言吧（选填）"
            maxlength="100"
          />
        </view>
        <button class="btn-done" @click="confirmCheckin">完成</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useStudyStore } from '@/store/study.js'
import { formatDuration } from '@/common/utils/helper.js'

const studyStore = useStudyStore()
const selectedSubject = ref('数学')
const customSubject = ref('')
const manualMinutes = ref('')
const showResult = ref(false)
const resultMinutes = ref(0)
const earnedPoints = ref(0)
const note = ref('')
let timerInterval = null

const subjects = ref(['数学', '英语', '语文', '物理', '化学', '编程', '考研', '阅读'])

function addSubject() {
  const s = customSubject.value.trim()
  if (s && !subjects.value.includes(s)) {
    subjects.value.push(s)
    selectedSubject.value = s
  }
  customSubject.value = ''
}

function startStudy() {
  if (!selectedSubject.value) {
    return uni.showToast({ title: '请选择科目', icon: 'none' })
  }
  studyStore.startTimer(selectedSubject.value)
  timerInterval = setInterval(() => studyStore.tick(), 1000)
}

function stopStudy() {
  const minutes = studyStore.stopTimer()
  clearInterval(timerInterval)
  timerInterval = null
  if (minutes < 1) {
    uni.showToast({ title: '学习时间太短啦', icon: 'none' })
    studyStore.resetTimer()
    return
  }
  resultMinutes.value = minutes
  earnedPoints.value = minutes >= 60 ? 15 : 10
  showResult.value = true
}

async function manualCheckin() {
  const m = parseInt(manualMinutes.value)
  if (!m || m < 1) return uni.showToast({ title: '请输入有效时长', icon: 'none' })
  if (!selectedSubject.value) return uni.showToast({ title: '请选择科目', icon: 'none' })
  resultMinutes.value = m
  earnedPoints.value = m >= 60 ? 15 : 10
  showResult.value = true
}

async function confirmCheckin() {
  try {
    await studyStore.submitCheckin({
      duration_min: resultMinutes.value,
      subject: selectedSubject.value || studyStore.currentSubject,
      note: note.value
    })
    uni.showToast({ title: '打卡记录已保存', icon: 'success' })
    setTimeout(() => {
      studyStore.resetTimer()
      uni.navigateBack()
    }, 1000)
  } catch (e) { console.error(e) }
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
.checkin-page {
  min-height: 100vh;
  background: #F7F6FA;
  padding: 32rpx 24rpx;
}

.timer-section {
  display: flex;
  justify-content: center;
  padding: 40rpx 0 60rpx;
}

.timer-outer {
  width: 420rpx;
  height: 420rpx;
  border-radius: 50%;
  padding: 10rpx;
  background: rgba(140, 97, 214, 0.06);
  transition: background 0.3s;
}

.timer-outer.running {
  background: rgba(140, 97, 214, 0.12);
}

.timer-ring {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  border: 4rpx solid #ECEAF0;
  transition: border-color 0.3s;
}

.timer-ring.running {
  border-color: #8C61D6;
}

.timer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timer-text {
  font-size: 72rpx;
  font-weight: 800;
  color: #6B47B8;
  font-family: 'Courier New', monospace;
  letter-spacing: 4rpx;
}

.timer-label {
  font-size: 24rpx;
  color: #A09CAE;
  margin-top: 10rpx;
  letter-spacing: 2rpx;
}

.subject-section {
  margin-bottom: 32rpx;
}

.sec-title-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.sec-title-bar {
  width: 6rpx;
  height: 28rpx;
  border-radius: 3rpx;
  background: #8C61D6;
  margin-right: 12rpx;
}

.sec-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #3A3030;
}

.subject-list {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;
}

.sub-tag {
  font-size: 26rpx;
  color: #6B47B8;
  background: #FFFFFF;
  padding: 14rpx 30rpx;
  border-radius: 40rpx;
  border: 2rpx solid #ECEAF0;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  transition: all 0.15s;
}

.sub-tag.active {
  background: #8C61D6;
  color: #FFFFFF;
  border-color: #8C61D6;
}

.sub-input-wrap {
  flex-shrink: 0;
}

.sub-input {
  font-size: 26rpx;
  width: 150rpx;
  height: 58rpx;
  padding: 0 18rpx;
  border: 2rpx dashed #A882E0;
  border-radius: 40rpx;
  color: #8C61D6;
  background: rgba(140, 97, 214, 0.04);
}

.btn-section {
  padding: 20rpx 0;
}

.btn-start {
  height: 100rpx;
  line-height: 100rpx;
  background: #8C61D6;
  color: #FFFFFF;
  font-size: 34rpx;
  font-weight: 700;
  border-radius: 50rpx;
  border: none;
  letter-spacing: 4rpx;
}

.btn-start::after {
  border: none;
}

.btn-stop {
  height: 100rpx;
  line-height: 100rpx;
  background: #E06B6B;
  color: #FFFFFF;
  font-size: 34rpx;
  font-weight: 700;
  border-radius: 50rpx;
  border: none;
  letter-spacing: 4rpx;
}

.btn-stop::after {
  border: none;
}

.manual-section {
  margin-top: 40rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.manual-title {
  font-size: 26rpx;
  color: #A09CAE;
  display: block;
  margin-bottom: 20rpx;
  text-align: center;
}

.manual-row {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.manual-input-wrap {
  flex: 1;
  position: relative;
}

.manual-input {
  width: 100%;
  height: 84rpx;
  background: #F7F6FA;
  border-radius: 16rpx;
  padding: 0 80rpx 0 24rpx;
  font-size: 30rpx;
  color: #3A3030;
  border: 2rpx solid #ECEAF0;
}

.manual-unit {
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24rpx;
  color: #A09CAE;
}

.btn-manual {
  width: 200rpx;
  height: 84rpx;
  line-height: 84rpx;
  background: #8C61D6;
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: 600;
  border-radius: 16rpx;
  border: none;
  padding: 0;
}

.btn-manual::after {
  border: none;
}

.result-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(58, 48, 48, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 48rpx;
}

.result-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 60rpx 40rpx 48rpx;
  width: 100%;
  text-align: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.result-icon-wrap {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: rgba(107, 174, 138, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20rpx;
}

.result-check-ico {
  font-size: 52rpx;
  color: #6BAE8A;
}

.result-title {
  font-size: 38rpx;
  font-weight: 800;
  color: #3A3030;
  display: block;
}

.result-info-row {
  display: flex;
  justify-content: center;
  gap: 60rpx;
  margin-top: 28rpx;
  padding: 24rpx 0;
  background: #F7F6FA;
  border-radius: 16rpx;
}

.result-info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-info-num {
  font-size: 36rpx;
  font-weight: 800;
  color: #8C61D6;
}

.result-points {
  color: #D99B3F;
}

.result-info-label {
  font-size: 22rpx;
  color: #A09CAE;
  margin-top: 4rpx;
}

.result-note {
  margin-top: 28rpx;
}

.note-input {
  width: 100%;
  height: 130rpx;
  background: #F7F6FA;
  border-radius: 16rpx;
  padding: 18rpx;
  font-size: 26rpx;
  color: #3A3030;
  border: 2rpx solid #ECEAF0;
}

.btn-done {
  margin-top: 28rpx;
  height: 92rpx;
  line-height: 92rpx;
  background: #8C61D6;
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 700;
  border-radius: 46rpx;
  border: none;
}

.btn-done::after {
  border: none;
}
</style>
