<template>
  <view class="admin-page">
    <view class="hd" :style="{ paddingTop: barH + 'px' }">
      <text class="hd-title">发布管理</text>
    </view>

    <!-- Quick Actions -->
    <view class="qa-row">
      <view class="qa-card qa-primary" @click="goPublishActivity">
        <view class="qa-ico-wrap">
          <text class="ri-flag-2-line qa-ico"></text>
        </view>
        <view class="qa-body">
          <text class="qa-name">发布活动 / 公告</text>
          <text class="qa-desc">创建校园活动与通知</text>
        </view>
        <text class="ri-arrow-right-s-line qa-arrow"></text>
      </view>
      <view class="qa-card qa-secondary" @click="goSendNotice">
        <view class="qa-ico-wrap qa-ico-teal">
          <text class="ri-mail-send-line qa-ico"></text>
        </view>
        <view class="qa-body">
          <text class="qa-name">发送系统通知</text>
          <text class="qa-desc">全站推送消息</text>
        </view>
        <text class="ri-arrow-right-s-line qa-arrow"></text>
      </view>
    </view>

    <!-- Activity List -->
    <view class="section">
      <view class="sec-head">
        <view class="sec-bar"></view>
        <text class="sec-title">已发布活动</text>
        <text class="sec-count">{{ activityList.length }} 条</text>
      </view>

      <view v-for="a in activityList" :key="a._id" class="act-card">
        <view class="act-thumb-wrap">
          <image :src="a.cover_url || '/static/act-default.png'" mode="aspectFill" class="act-thumb" />
          <view v-if="a.is_top" class="act-pin">
            <text class="ri-pushpin-2-fill pin-ico"></text>
            <text>置顶</text>
          </view>
        </view>
        <view class="act-body">
          <text class="act-title text-ellipsis">{{ a.title }}</text>
          <text class="act-meta">{{ a.start_time }} · {{ a.location }}</text>
        </view>
        <view class="act-ops">
          <view class="op-pill op-edit" @click="editActivity(a._id)">
            <text class="ri-edit-2-line op-ico"></text>
          </view>
          <view class="op-pill op-del" @click="deleteActivity(a._id, a.title)">
            <text class="ri-delete-bin-6-line op-ico"></text>
          </view>
        </view>
      </view>

      <view v-if="!activityList.length" class="empty-box">
        <text class="ri-megaphone-line empty-ico"></text>
        <text class="empty-text">暂无已发布的活动</text>
      </view>
    </view>

    <!-- Tabbar -->
    <view class="admin-tabbar safe-area-bottom">
      <view class="atb-item" @click="switchPage('/pages/admin/index')">
        <view class="atb-ico-wrap"><text class="ri-dashboard-3-line atb-ico"></text></view>
        <text class="atb-label">概览</text>
      </view>
      <view class="atb-item" @click="switchPage('/pages/admin/content')">
        <view class="atb-ico-wrap"><text class="ri-file-list-3-line atb-ico"></text></view>
        <text class="atb-label">内容</text>
      </view>
      <view class="atb-item" @click="switchPage('/pages/admin/models')">
        <view class="atb-ico-wrap"><text class="ri-box-3-line atb-ico"></text></view>
        <text class="atb-label">模型</text>
      </view>
      <view class="atb-item" @click="switchPage('/pages/admin/users')">
        <view class="atb-ico-wrap"><text class="ri-team-line atb-ico"></text></view>
        <text class="atb-label">用户</text>
      </view>
      <view class="atb-item atb-active">
        <view class="atb-ico-wrap atb-ico-on"><text class="ri-megaphone-line atb-ico"></text></view>
        <text class="atb-label atb-label-on">发布</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const barH = ref(0)
uni.getSystemInfo({ success: r => { barH.value = r.statusBarHeight || 44 } })

const activityList = ref([])

onMounted(() => { loadActivities() })

async function loadActivities() {
  try {
    const res = await callCloud('admin-get-activities', {})
    activityList.value = res.data || []
  } catch (e) { console.error(e) }
}

function goPublishActivity() { uni.navigateTo({ url: '/pages/admin/publishActivity' }) }
function goSendNotice() { uni.navigateTo({ url: '/pages/admin/sendNotice' }) }
function editActivity(id) { uni.navigateTo({ url: `/pages/admin/publishActivity?id=${id}` }) }

function deleteActivity(id, title) {
  uni.showModal({
    title: '确认删除', content: `确定删除活动「${title}」？`,
    success: async (r) => {
      if (r.confirm) {
        await callCloud('admin-delete-activity', { id })
        uni.showToast({ title: '已删除', icon: 'success' })
        loadActivities()
      }
    }
  })
}

function switchPage(url) { uni.redirectTo({ url }) }
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #F4F2F9;
  padding-bottom: 160rpx;
}

/* ── Header ── */
.hd {
  background: linear-gradient(145deg, #7B52C1 0%, #9B6FE0 100%);
  padding: 0 32rpx 28rpx;
}
.hd-title {
  display: block;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 36rpx;
  font-weight: 800;
  color: #FFF;
  letter-spacing: 1rpx;
}

/* ── Quick Actions ── */
.qa-row {
  padding: 24rpx 32rpx 0;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}
.qa-card {
  display: flex;
  align-items: center;
  background: #FFF;
  border-radius: 20rpx;
  padding: 28rpx;
  gap: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,.03);
}
.qa-ico-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  background: #F0E8FA;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.qa-ico-teal { background: #E3F5ED; }
.qa-ico { font-size: 32rpx; }
.qa-primary .qa-ico { color: #8C61D6; }
.qa-secondary .qa-ico { color: #4EA07A; }
.qa-body { flex: 1; min-width: 0; }
.qa-name {
  font-size: 28rpx;
  font-weight: 700;
  color: #3A3030;
  display: block;
}
.qa-desc {
  font-size: 22rpx;
  color: #A09CAE;
  margin-top: 2rpx;
  display: block;
}
.qa-arrow { font-size: 28rpx; color: #CDCAD4; }

/* ── Section ── */
.section { padding: 28rpx 32rpx 0; }
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
  flex: 1;
}
.sec-count {
  font-size: 22rpx;
  color: #A09CAE;
}

/* ── Activity Card ── */
.act-card {
  display: flex;
  align-items: center;
  background: #FFF;
  border-radius: 20rpx;
  padding: 18rpx 20rpx;
  margin-bottom: 14rpx;
  gap: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,.03);
}
.act-thumb-wrap {
  width: 150rpx;
  height: 108rpx;
  border-radius: 14rpx;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  background: #EDEAF4;
}
.act-thumb { width: 100%; height: 100%; }
.act-pin {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 4rpx;
  background: rgba(217,85,85,.88);
  color: #FFF;
  font-size: 18rpx;
  font-weight: 700;
  padding: 4rpx 10rpx;
  border-radius: 0 14rpx 0 10rpx;
}
.pin-ico { font-size: 18rpx; color: #FFF; }
.act-body { flex: 1; min-width: 0; }
.act-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #3A3030;
  display: block;
}
.act-meta {
  font-size: 22rpx;
  color: #A09CAE;
  margin-top: 6rpx;
  display: block;
}

/* ── Ops ── */
.act-ops {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  flex-shrink: 0;
}
.op-pill {
  width: 56rpx;
  height: 56rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.op-ico { font-size: 26rpx; }
.op-edit { background: #F0E8FA; }
.op-edit .op-ico { color: #8C61D6; }
.op-del { background: #FDEAEA; }
.op-del .op-ico { color: #D95555; }

/* ── Empty ── */
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 140rpx 0 100rpx;
}
.empty-ico { font-size: 72rpx; color: #D2CEE0; }
.empty-text { font-size: 28rpx; color: #A09CAE; margin-top: 16rpx; }

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
.atb-ico-on { background: rgba(140,97,214,.10); }
.atb-ico { font-size: 34rpx; color: #B0ABBC; }
.atb-ico-on .atb-ico { color: #8C61D6; }
.atb-label { font-size: 20rpx; color: #B0ABBC; }
.atb-label-on { color: #8C61D6; font-weight: 700; }
</style>
