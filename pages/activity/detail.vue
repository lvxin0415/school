<template>
  <view class="detail-page">
    <view class="cover-section">
      <image :src="activity.cover_url || '/static/act-default.png'" mode="aspectFill" class="cover-img" />
    </view>

    <view class="detail-card">
      <text class="detail-title">{{ activity.title }}</text>

      <view class="info-grid">
        <view class="info-block">
          <text class="ri-map-pin-2-line info-ico"></text>
          <view class="info-text-col">
            <text class="info-label">活动地点</text>
            <text class="info-value">{{ activity.location || '线上' }}</text>
          </view>
        </view>
        <view class="info-block">
          <text class="ri-calendar-line info-ico"></text>
          <view class="info-text-col">
            <text class="info-label">活动时间</text>
            <text class="info-value">{{ activity.start_time }} ~ {{ activity.end_time }}</text>
          </view>
        </view>
      </view>

      <view class="content-divider">
        <view class="divider-line"></view>
        <text class="divider-text">活动详情</text>
        <view class="divider-line"></view>
      </view>

      <text class="content-text">{{ activity.content }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const activity = ref({})

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const id = currentPage.$page?.options?.id || currentPage.options?.id
  if (id) loadDetail(id)
})

async function loadDetail(id) {
  try {
    const res = await callCloud('get-activity-detail', { id })
    activity.value = res.data || {}
  } catch (e) { console.error(e) }
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #F7F6FA;
}

.cover-section {
  position: relative;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 440rpx;
  display: block;
}

.detail-card {
  position: relative;
  margin: -60rpx 24rpx 40rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 40rpx 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.detail-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #3A3030;
  display: block;
  margin-bottom: 32rpx;
  line-height: 1.4;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 32rpx;
}

.info-block {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 24rpx;
  background: #F7F6FA;
  border-radius: 16rpx;
}

.info-text-col {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.info-label {
  font-size: 22rpx;
  color: #A09CAE;
}

.info-value {
  font-size: 26rpx;
  color: #3A3030;
  font-weight: 500;
}

.content-divider {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 28rpx;
}

.divider-line {
  flex: 1;
  height: 1rpx;
  background: #ECEAF0;
}

.divider-text {
  font-size: 24rpx;
  color: #A09CAE;
  font-weight: 600;
  white-space: nowrap;
}

.info-ico {
  font-size: 32rpx;
  color: #8C61D6;
}

.content-text {
  font-size: 28rpx;
  color: #3A3030;
  line-height: 2;
  display: block;
}
</style>
