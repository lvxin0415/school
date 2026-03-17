<template>
  <view class="badges-page">
    <!-- 积分卡片 -->
    <view class="points-card">
      <text class="points-num">{{ studyStore.points }}</text>
      <text class="points-label">我的积分</text>
    </view>

    <!-- 勋章展示 -->
    <view class="badge-section">
      <text class="sec-title">我的勋章</text>
      <view class="badge-grid">
        <view v-for="b in allBadges" :key="b.type" class="badge-item" :class="{ locked: !b.earned }">
          <view class="badge-icon-wrap" :class="{ earned: b.earned }">
            <text :class="b.iconClass" class="badge-ico" :style="{ color: b.earned ? b.iconColor : '#A09CAE' }"></text>
          </view>
          <text class="badge-name">{{ b.name }}</text>
          <text class="badge-cond">{{ b.earned ? '已获得' : b.condition }}</text>
        </view>
      </view>
    </view>

    <!-- 积分规则 -->
    <view class="rules-section">
      <text class="sec-title">积分获取规则</text>
      <view class="rules-card">
        <view v-for="r in pointRules" :key="r.action" class="rule-row">
          <text class="rule-action">{{ r.action }}</text>
          <text class="rule-points">+{{ r.points }}</text>
          <text class="rule-note">{{ r.note }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useStudyStore } from '@/store/study.js'

const studyStore = useStudyStore()

onMounted(() => { studyStore.fetchStudyData() })

const allBadges = computed(() => {
  const earned = studyStore.badges.map(b => b.badge_type)
  return [
    { type: 'newbie', iconClass: 'ri-seedling-line', iconColor: '#6BAE8A', name: '萌新', condition: '完成首次打卡', earned: earned.includes('newbie') },
    { type: 'master', iconClass: 'ri-fire-fill', iconColor: '#E06B6B', name: '学习达人', condition: '累计打卡30天', earned: earned.includes('master') },
    { type: 'persist', iconClass: 'ri-star-fill', iconColor: '#E6A84E', name: '坚持不懈', condition: '连续打卡7天', earned: earned.includes('persist') },
    { type: 'king', iconClass: 'ri-vip-crown-fill', iconColor: '#8C61D6', name: '卷王', condition: '周榜第1名', earned: earned.includes('king') },
    { type: 'talker', iconClass: 'ri-chat-smile-2-fill', iconColor: '#94B8D6', name: '话痨', condition: '发帖累计20条', earned: earned.includes('talker') }
  ]
})

const pointRules = [
  { action: '每日首次打卡', points: 10, note: '每天限一次' },
  { action: '打卡时长≥1小时', points: 5, note: '可叠加' },
  { action: '连续打卡7天', points: 30, note: '达成即发放' },
  { action: '连续打卡30天', points: 100, note: '达成即发放' },
  { action: '发布留言墙帖子', points: 5, note: '每天最多3次' }
]
</script>

<style scoped>
.badges-page {
  min-height: 100vh;
  background: #F7F6FA;
  padding-bottom: 60rpx;
}

.points-card {
  margin: 20rpx 24rpx;
  height: 200rpx;
  border-radius: 24rpx;
  background: #FFFFFF;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.points-num {
  font-size: 72rpx;
  font-weight: 800;
  color: #8C61D6;
}

.points-label {
  font-size: 26rpx;
  color: #A09CAE;
  margin-top: 4rpx;
}

.badge-section {
  padding: 0 24rpx;
  margin-top: 20rpx;
}

.sec-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #3A3030;
  display: block;
  margin-bottom: 20rpx;
}

.badge-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.badge-item {
  width: calc(33.33% - 12rpx);
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 28rpx 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.badge-item.locked {
  opacity: 0.5;
}

.badge-icon-wrap {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: #F7F6FA;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.badge-icon-wrap.earned {
  background: rgba(140, 97, 214, 0.08);
}

.badge-ico {
  font-size: 40rpx;
}

.badge-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #3A3030;
}

.badge-cond {
  font-size: 20rpx;
  color: #A09CAE;
  margin-top: 6rpx;
  text-align: center;
}

.rules-section {
  padding: 32rpx 24rpx;
}

.rules-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.rule-row {
  display: flex;
  align-items: center;
  padding: 24rpx 28rpx;
  border-bottom: 1rpx solid #ECEAF0;
}

.rule-row:last-child {
  border-bottom: none;
}

.rule-action {
  flex: 1;
  font-size: 28rpx;
  color: #3A3030;
}

.rule-points {
  font-size: 28rpx;
  font-weight: 700;
  color: #8C61D6;
  margin: 0 20rpx;
}

.rule-note {
  font-size: 22rpx;
  color: #A09CAE;
}
</style>
