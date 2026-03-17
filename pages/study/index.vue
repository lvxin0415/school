<template>
  <view class="study-page">
    <!-- 顶部统计 -->
    <view class="stats-header">
      <text class="header-title">学习中心</text>
      <text class="header-sub">坚持每天进步一点点</text>
      <view class="stats-grid">
        <view class="s-item">
          <view class="s-icon-ring">
            <text class="ri-calendar-check-line s-icon"></text>
          </view>
          <text class="s-num">{{ studyStore.totalDays }}</text>
          <text class="s-label">总打卡天数</text>
        </view>
        <view class="s-divider"></view>
        <view class="s-item">
          <view class="s-icon-ring">
            <text class="ri-time-line s-icon"></text>
          </view>
          <text class="s-num">{{ formatDuration(studyStore.totalMinutes) }}</text>
          <text class="s-label">总学习时长</text>
        </view>
        <view class="s-divider"></view>
        <view class="s-item">
          <view class="s-icon-ring">
            <text class="ri-fire-line s-icon"></text>
          </view>
          <text class="s-num">{{ studyStore.streakDays }}</text>
          <text class="s-label">连续打卡</text>
        </view>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="action-section">
      <view class="action-card" @click="goCheckin">
        <view class="ac-icon-wrap ac-icon-blue">
          <text class="ri-time-line ac-ico"></text>
        </view>
        <view class="ac-info">
          <text class="ac-title">开始学习</text>
          <text class="ac-desc">计时打卡，记录学习时光</text>
        </view>
        <text class="ri-arrow-right-s-line ac-arrow"></text>
      </view>
      <view class="action-card" @click="goStats">
        <view class="ac-icon-wrap ac-icon-purple">
          <text class="ri-bar-chart-2-line ac-ico"></text>
        </view>
        <view class="ac-info">
          <text class="ac-title">学习统计</text>
          <text class="ac-desc">日历、图表、科目分布</text>
        </view>
        <text class="ri-arrow-right-s-line ac-arrow"></text>
      </view>
      <view class="action-card" @click="goRank">
        <view class="ac-icon-wrap ac-icon-pink">
          <text class="ri-trophy-line ac-ico"></text>
        </view>
        <view class="ac-info">
          <text class="ac-title">排行榜</text>
          <text class="ac-desc">全校周学习时长排名</text>
        </view>
        <text class="ri-arrow-right-s-line ac-arrow"></text>
      </view>
      <view class="action-card" @click="goBadges">
        <view class="ac-icon-wrap ac-icon-gold">
          <text class="ri-award-line ac-ico"></text>
        </view>
        <view class="ac-info">
          <text class="ac-title">积分与勋章</text>
          <text class="ac-desc">{{ studyStore.points }} 积分 · {{ studyStore.badges.length }} 枚勋章</text>
        </view>
        <text class="ri-arrow-right-s-line ac-arrow"></text>
      </view>
    </view>

    <!-- 今日记录 -->
    <view class="today-section">
      <view class="sec-title-row">
        <view class="sec-title-bar"></view>
        <text class="sec-title">今日学习记录</text>
      </view>
      <view v-if="todayRecords.length" class="record-list">
        <view v-for="(r, idx) in todayRecords" :key="r._id" class="record-item">
          <view class="r-index">{{ idx + 1 }}</view>
          <view class="r-left">
            <text class="r-subject">{{ r.subject || '未分类' }}</text>
            <text class="r-time">{{ r.time_str }}</text>
          </view>
          <text class="r-dur">{{ formatDuration(r.duration_min) }}</text>
        </view>
      </view>
      <view v-else class="empty-today">
        <text class="ri-edit-box-line empty-ico"></text>
        <text class="empty-t">今天还没有学习记录</text>
        <text class="empty-sub">快去打卡开启今天的学习吧</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStudyStore } from '@/store/study.js'
import { callCloud } from '@/common/utils/request.js'
import { formatDuration, formatDate } from '@/common/utils/helper.js'

const studyStore = useStudyStore()
const todayRecords = ref([])

onMounted(() => {
  studyStore.fetchStudyData()
  loadTodayRecords()
})

async function loadTodayRecords() {
  try {
    const res = await callCloud('get-study-records', { date: formatDate(new Date()) })
    todayRecords.value = res.data || []
  } catch (e) { console.error(e) }
}

function goCheckin() { uni.navigateTo({ url: '/pages/study/checkin' }) }
function goStats() { uni.navigateTo({ url: '/pages/study/stats' }) }
function goRank() { uni.navigateTo({ url: '/pages/study/rank' }) }
function goBadges() { uni.navigateTo({ url: '/pages/study/badges' }) }
</script>

<style scoped>
.study-page {
  min-height: 100vh;
  background: #F7F6FA;
}

.stats-header {
  padding: 48rpx 24rpx 32rpx;
  background: linear-gradient(180deg, #F0ECF8, #F7F6FA);
}

.header-title {
  font-size: 40rpx;
  font-weight: 800;
  color: #3A3030;
  display: block;
  text-align: center;
  letter-spacing: 2rpx;
}

.header-sub {
  font-size: 24rpx;
  color: #747288;
  display: block;
  text-align: center;
  margin-top: 8rpx;
  margin-bottom: 36rpx;
}

.stats-grid {
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 36rpx 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.s-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.s-icon-ring {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  background: rgba(140, 97, 214, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.s-icon {
  font-size: 30rpx;
  color: #8C61D6;
}

.s-num {
  font-size: 42rpx;
  font-weight: 800;
  color: #6B47B8;
}

.s-label {
  font-size: 22rpx;
  color: #A09CAE;
  margin-top: 6rpx;
}

.s-divider {
  width: 1rpx;
  height: 56rpx;
  background: #ECEAF0;
}

.action-section {
  padding: 8rpx 24rpx 0;
}

.action-card {
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 30rpx 28rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  transition: opacity 0.15s;
}

.action-card:active {
  opacity: 0.7;
}

.ac-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.ac-ico {
  font-size: 36rpx;
  color: #FFFFFF;
}

.ac-arrow {
  font-size: 28rpx;
  color: #A09CAE;
  flex-shrink: 0;
}

.ac-icon-blue {
  background: #7BA8C8;
}

.ac-icon-purple {
  background: #8C61D6;
}

.ac-icon-pink {
  background: #C490AD;
}

.ac-icon-gold {
  background: #D99B3F;
}

.ac-info {
  flex: 1;
}

.ac-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #3A3030;
  display: block;
}

.ac-desc {
  font-size: 24rpx;
  color: #A09CAE;
  margin-top: 6rpx;
  display: block;
}

.today-section {
  padding: 24rpx 24rpx 100rpx;
}

.sec-title-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.sec-title-bar {
  width: 6rpx;
  height: 30rpx;
  border-radius: 3rpx;
  background: #8C61D6;
  margin-right: 12rpx;
}

.sec-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #3A3030;
}

.record-list {
  background: #FFFFFF;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.record-item {
  display: flex;
  align-items: center;
  padding: 26rpx 28rpx;
  border-bottom: 1rpx solid #ECEAF0;
}

.record-item:last-child {
  border-bottom: none;
}

.r-index {
  width: 44rpx;
  height: 44rpx;
  border-radius: 12rpx;
  background: rgba(140, 97, 214, 0.08);
  color: #8C61D6;
  font-size: 24rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.r-left {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.r-subject {
  font-size: 28rpx;
  font-weight: 600;
  color: #3A3030;
}

.r-time {
  font-size: 22rpx;
  color: #A09CAE;
  margin-top: 4rpx;
}

.r-dur {
  font-size: 28rpx;
  font-weight: 700;
  color: #8C61D6;
  flex-shrink: 0;
}

.empty-today {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 80rpx 40rpx;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.empty-ico {
  font-size: 56rpx;
  color: #A09CAE;
}

.empty-t {
  font-size: 28rpx;
  color: #3A3030;
  font-weight: 600;
  display: block;
  margin-top: 20rpx;
}

.empty-sub {
  font-size: 24rpx;
  color: #A09CAE;
  display: block;
  margin-top: 8rpx;
}
</style>
