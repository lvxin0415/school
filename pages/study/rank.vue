<template>
  <view class="rank-page">
    <view class="rank-header">
      <view class="rank-title-row">
        <text class="ri-trophy-fill rank-title-ico"></text>
        <text class="rank-title">全校周学习排行榜</text>
      </view>
      <text class="rank-desc">每周一 00:00 自动重置</text>
    </view>

    <!-- 前三名 -->
    <view v-if="rankList.length >= 3" class="top3-section">
      <view class="top-item second">
        <view class="top-avatar" style="background:#7BA8C8">
          <text class="top-char">{{ rankList[1].name[0] }}</text>
        </view>
        <text class="top-medal">2</text>
        <text class="top-name">{{ rankList[1].name }}</text>
        <text class="top-dur">{{ rankList[1].duration }}分钟</text>
      </view>
      <view class="top-item first">
        <view class="top-avatar" style="background:#8C61D6">
          <text class="top-char">{{ rankList[0].name[0] }}</text>
        </view>
        <text class="top-medal">1</text>
        <text class="top-name">{{ rankList[0].name }}</text>
        <text class="top-dur">{{ rankList[0].duration }}分钟</text>
      </view>
      <view class="top-item third">
        <view class="top-avatar" style="background:#BBA2CA">
          <text class="top-char">{{ rankList[2].name[0] }}</text>
        </view>
        <text class="top-medal">3</text>
        <text class="top-name">{{ rankList[2].name }}</text>
        <text class="top-dur">{{ rankList[2].duration }}分钟</text>
      </view>
    </view>

    <!-- 排行列表 -->
    <view class="rank-list">
      <view v-for="(item, idx) in rankList.slice(3)" :key="idx" class="rank-row">
        <text class="rank-num">{{ idx + 4 }}</text>
        <view class="rank-av" :style="{ background: item.color || '#A09CAE' }">
          <text class="rank-ac">{{ item.name[0] }}</text>
        </view>
        <view class="rank-info">
          <text class="rank-name">{{ item.name }}</text>
          <text class="rank-streak">连续{{ item.streak }}天</text>
        </view>
        <text class="rank-dur">{{ item.duration }}分钟</text>
      </view>
    </view>

    <view v-if="!rankList.length" class="empty-box">
      <text class="ri-bar-chart-2-line empty-ico"></text>
      <text class="empty-t">本周还没有排行数据</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const rankList = ref([])

onMounted(async () => {
  try {
    const res = await callCloud('get-rank', { type: 'week' })
    rankList.value = res.data || []
  } catch (e) { console.error(e) }
})
</script>

<style scoped>
.rank-page {
  min-height: 100vh;
  background: #F7F6FA;
}

.rank-header {
  background: linear-gradient(180deg, #F0ECF8, #F7F6FA);
  padding: 48rpx 32rpx 32rpx;
  text-align: center;
}

.rank-title-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10rpx;
}

.rank-title-ico {
  font-size: 36rpx;
  color: #8C61D6;
}

.rank-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #3A3030;
}

.rank-desc {
  font-size: 24rpx;
  color: #A09CAE;
  margin-top: 8rpx;
  display: block;
}

.top3-section {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 24rpx 24rpx 20rpx;
  gap: 16rpx;
}

.top-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 24rpx 16rpx;
  width: 200rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.top-item.first {
  transform: translateY(-20rpx);
}

.top-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.top-char {
  color: #FFFFFF;
  font-size: 30rpx;
  font-weight: 700;
}

.top-medal {
  font-size: 36rpx;
  font-weight: 800;
  color: #3A3030;
  margin: 8rpx 0;
}

.top-name {
  font-size: 24rpx;
  font-weight: 600;
  color: #3A3030;
}

.top-dur {
  font-size: 22rpx;
  color: #8C61D6;
  margin-top: 4rpx;
}

.rank-list {
  padding: 0 24rpx 60rpx;
}

.rank-row {
  display: flex;
  align-items: center;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 24rpx 28rpx;
  margin-bottom: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.rank-num {
  font-size: 30rpx;
  font-weight: 700;
  color: #A09CAE;
  width: 60rpx;
  text-align: center;
}

.rank-av {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
}

.rank-ac {
  color: #FFFFFF;
  font-size: 26rpx;
  font-weight: 700;
}

.rank-info {
  flex: 1;
}

.rank-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #3A3030;
  display: block;
}

.rank-streak {
  font-size: 22rpx;
  color: #A09CAE;
  display: block;
  margin-top: 4rpx;
}

.rank-dur {
  font-size: 28rpx;
  font-weight: 700;
  color: #8C61D6;
}

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0;
}

.empty-ico {
  font-size: 64rpx;
  color: #A09CAE;
}

.empty-t {
  font-size: 28rpx;
  color: #A09CAE;
  margin-top: 20rpx;
}
</style>
