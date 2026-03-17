<template>
  <view class="admin-page">
    <!-- Header -->
    <view class="hd" :style="{ paddingTop: barH + 'px' }">
      <view class="hd-row">
        <view class="hd-left">
          <text class="hd-greeting">管理后台</text>
          <text class="hd-sub">数据概览 · 今日</text>
        </view>
        <view class="hd-avatar">
          <text class="ri-shield-keyhole-fill hd-avatar-ico"></text>
        </view>
      </view>

      <!-- Stats Row -->
      <view class="stats-row">
        <view class="stat-card stat-primary">
          <view class="stat-icon-wrap stat-icon-purple">
            <text class="ri-user-add-line stat-ico"></text>
          </view>
          <text class="stat-num">{{ stats.todayUsers }}</text>
          <text class="stat-label">新增用户</text>
        </view>
        <view class="stat-card">
          <view class="stat-icon-wrap stat-icon-blue">
            <text class="ri-chat-smile-2-line stat-ico"></text>
          </view>
          <text class="stat-num">{{ stats.todayPosts }}</text>
          <text class="stat-label">新增帖子</text>
        </view>
        <view class="stat-card" :class="{ 'stat-warn': stats.pendingPosts > 0 }">
          <view class="stat-icon-wrap stat-icon-red">
            <text class="ri-alarm-warning-line stat-ico"></text>
          </view>
          <text class="stat-num">{{ stats.pendingPosts }}</text>
          <text class="stat-label">待审核</text>
          <view v-if="stats.pendingPosts > 0" class="stat-dot"></view>
        </view>
        <view class="stat-card">
          <view class="stat-icon-wrap stat-icon-green">
            <text class="ri-time-line stat-ico"></text>
          </view>
          <text class="stat-num">{{ stats.todayStudyHours }}h</text>
          <text class="stat-label">学习时长</text>
        </view>
      </view>
    </view>

    <!-- Quick Actions -->
    <view class="section">
      <view class="sec-head">
        <view class="sec-bar"></view>
        <text class="sec-title">快捷入口</text>
      </view>
      <view class="quick-row">
        <view class="quick-card" @click="goTo('/pages/admin/postReview')">
          <view class="qc-icon qc-icon-red">
            <text class="ri-file-search-line qc-ico"></text>
          </view>
          <view class="qc-body">
            <text class="qc-name">帖子审核</text>
            <text class="qc-desc">内容审核管理</text>
          </view>
          <text class="ri-arrow-right-s-line qc-arrow"></text>
        </view>
        <view class="quick-card" @click="goTo('/pages/admin/modelUpload')">
          <view class="qc-icon qc-icon-purple">
            <text class="ri-upload-cloud-2-line qc-ico"></text>
          </view>
          <view class="qc-body">
            <text class="qc-name">上传模型</text>
            <text class="qc-desc">3D 校园模型</text>
          </view>
          <text class="ri-arrow-right-s-line qc-arrow"></text>
        </view>
        <view class="quick-card" @click="goTo('/pages/admin/publishActivity')">
          <view class="qc-icon qc-icon-amber">
            <text class="ri-flag-2-line qc-ico"></text>
          </view>
          <view class="qc-body">
            <text class="qc-name">发布活动</text>
            <text class="qc-desc">校园活动公告</text>
          </view>
          <text class="ri-arrow-right-s-line qc-arrow"></text>
        </view>
        <view class="quick-card" @click="goTo('/pages/admin/sendNotice')">
          <view class="qc-icon qc-icon-teal">
            <text class="ri-mail-send-line qc-ico"></text>
          </view>
          <view class="qc-body">
            <text class="qc-name">发送通知</text>
            <text class="qc-desc">全站系统推送</text>
          </view>
          <text class="ri-arrow-right-s-line qc-arrow"></text>
        </view>
      </view>
    </view>

    <!-- Chart -->
    <view class="section">
      <view class="sec-head">
        <view class="sec-bar"></view>
        <text class="sec-title">近 7 日用户活跃</text>
      </view>
      <view class="chart-card">
        <view class="chart-body">
          <view v-for="(v, i) in trendData" :key="i" class="bar-col">
            <view class="bar-track">
              <view class="bar-fill" :style="{ height: (v / maxTrend * 100) + '%' }"></view>
            </view>
            <text class="bar-val">{{ v }}</text>
            <text class="bar-day">{{ trendLabels[i] }}</text>
          </view>
        </view>
      </view>
    </view>

    <view style="height:160rpx"></view>

    <!-- Tabbar -->
    <view class="admin-tabbar safe-area-bottom">
      <view class="atb-item atb-active">
        <view class="atb-ico-wrap atb-ico-active">
          <text class="ri-dashboard-3-line atb-ico"></text>
        </view>
        <text class="atb-label atb-label-active">概览</text>
      </view>
      <view class="atb-item" @click="switchTab('/pages/admin/content')">
        <view class="atb-ico-wrap"><text class="ri-file-list-3-line atb-ico"></text></view>
        <text class="atb-label">内容</text>
      </view>
      <view class="atb-item" @click="switchTab('/pages/admin/models')">
        <view class="atb-ico-wrap"><text class="ri-box-3-line atb-ico"></text></view>
        <text class="atb-label">模型</text>
      </view>
      <view class="atb-item" @click="switchTab('/pages/admin/users')">
        <view class="atb-ico-wrap"><text class="ri-team-line atb-ico"></text></view>
        <text class="atb-label">用户</text>
      </view>
      <view class="atb-item" @click="switchTab('/pages/admin/publish')">
        <view class="atb-ico-wrap"><text class="ri-megaphone-line atb-ico"></text></view>
        <text class="atb-label">发布</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const barH = ref(0)
uni.getSystemInfo({ success: r => { barH.value = r.statusBarHeight || 44 } })

const stats = reactive({ todayUsers: 0, todayPosts: 0, pendingPosts: 0, todayStudyHours: 0 })
const trendData = ref([12, 18, 25, 20, 30, 28, 35])
const trendLabels = ['一', '二', '三', '四', '五', '六', '日']
const maxTrend = computed(() => Math.max(...trendData.value, 1))

onMounted(async () => {
  try {
    const res = await callCloud('admin-overview', {})
    Object.assign(stats, res.data || {})
    if (res.trend) trendData.value = res.trend
  } catch (e) { console.error(e) }
})

function goTo(url) { uni.navigateTo({ url }) }
function switchTab(url) { uni.redirectTo({ url }) }
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #F4F2F9;
}

/* ── Header ── */
.hd {
  background: linear-gradient(145deg, #7B52C1 0%, #9B6FE0 60%, #B494EA 100%);
  padding: 0 32rpx 40rpx;
  border-radius: 0 0 48rpx 48rpx;
}
.hd-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 0 24rpx;
}
.hd-greeting {
  font-size: 40rpx;
  font-weight: 800;
  color: #FFF;
  display: block;
  letter-spacing: 2rpx;
}
.hd-sub {
  font-size: 24rpx;
  color: rgba(255,255,255,.65);
  display: block;
  margin-top: 4rpx;
}
.hd-avatar {
  width: 76rpx;
  height: 76rpx;
  border-radius: 50%;
  background: rgba(255,255,255,.18);
  display: flex;
  align-items: center;
  justify-content: center;
}
.hd-avatar-ico { font-size: 38rpx; color: #FFF; }

/* ── Stat Cards ── */
.stats-row {
  display: flex;
  gap: 14rpx;
  margin-top: 8rpx;
}
.stat-card {
  flex: 1;
  background: rgba(255,255,255,.92);
  backdrop-filter: blur(12px);
  border-radius: 20rpx;
  padding: 20rpx 10rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  box-shadow: 0 4rpx 16rpx rgba(100,60,180,.10);
}
.stat-warn {
  border: 2rpx solid rgba(224,107,107,.4);
}
.stat-dot {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  width: 14rpx;
  height: 14rpx;
  background: #E06B6B;
  border-radius: 50%;
}
.stat-icon-wrap {
  width: 52rpx;
  height: 52rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10rpx;
}
.stat-icon-purple { background: rgba(140,97,214,.15); }
.stat-icon-blue   { background: rgba(148,184,214,.20); }
.stat-icon-red    { background: rgba(224,107,107,.15); }
.stat-icon-green  { background: rgba(107,174,138,.15); }
.stat-ico { font-size: 26rpx; }
.stat-icon-purple .stat-ico { color: #8C61D6; }
.stat-icon-blue   .stat-ico { color: #5B8DB8; }
.stat-icon-red    .stat-ico { color: #E06B6B; }
.stat-icon-green  .stat-ico { color: #6BAE8A; }
.stat-num {
  font-size: 38rpx;
  font-weight: 800;
  color: #3A3030;
  display: block;
  line-height: 1.1;
}
.stat-label {
  font-size: 20rpx;
  color: #8A849A;
  margin-top: 4rpx;
  display: block;
}

/* ── Section ── */
.section {
  padding: 28rpx 32rpx 0;
}
.sec-head {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}
.sec-bar {
  width: 6rpx;
  height: 28rpx;
  border-radius: 3rpx;
  background: #8C61D6;
}
.sec-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #3A3030;
}

/* ── Quick Actions ── */
.quick-row {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.quick-card {
  display: flex;
  align-items: center;
  background: #FFF;
  border-radius: 20rpx;
  padding: 26rpx 28rpx;
  gap: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,.03);
}
.qc-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.qc-icon-red    { background: #FDEAEA; }
.qc-icon-purple { background: #F0E8FA; }
.qc-icon-amber  { background: #FFF3DE; }
.qc-icon-teal   { background: #E3F5ED; }
.qc-ico { font-size: 32rpx; }
.qc-icon-red    .qc-ico { color: #D95555; }
.qc-icon-purple .qc-ico { color: #8C61D6; }
.qc-icon-amber  .qc-ico { color: #D09530; }
.qc-icon-teal   .qc-ico { color: #4EA07A; }
.qc-body {
  flex: 1;
  min-width: 0;
}
.qc-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #3A3030;
  display: block;
}
.qc-desc {
  font-size: 22rpx;
  color: #A09CAE;
  margin-top: 2rpx;
  display: block;
}
.qc-arrow { font-size: 28rpx; color: #CDCAD4; }

/* ── Chart ── */
.chart-card {
  background: #FFF;
  border-radius: 20rpx;
  padding: 28rpx 24rpx 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,.03);
}
.chart-body {
  display: flex;
  align-items: flex-end;
  height: 260rpx;
  gap: 10rpx;
}
.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: flex-end;
}
.bar-track {
  width: 100%;
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.bar-fill {
  width: 32rpx;
  border-radius: 8rpx 8rpx 4rpx 4rpx;
  background: linear-gradient(180deg, #9B6FE0 0%, #7B52C1 100%);
  min-height: 6rpx;
  transition: height .3s ease;
}
.bar-val {
  font-size: 20rpx;
  font-weight: 600;
  color: #8C61D6;
  margin-top: 8rpx;
}
.bar-day {
  font-size: 22rpx;
  color: #A09CAE;
  margin-top: 2rpx;
}

/* ── Tabbar ── */
.admin-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: #FFF;
  padding: 10rpx 0 6rpx;
  box-shadow: 0 -2rpx 16rpx rgba(0,0,0,.05);
  z-index: 99;
}
.atb-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}
.atb-ico-wrap {
  width: 52rpx;
  height: 52rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.atb-ico-active {
  background: rgba(140,97,214,.10);
}
.atb-ico {
  font-size: 34rpx;
  color: #B0ABBC;
}
.atb-ico-active .atb-ico {
  color: #8C61D6;
}
.atb-label {
  font-size: 20rpx;
  color: #B0ABBC;
}
.atb-label-active {
  color: #8C61D6;
  font-weight: 700;
}
</style>
