<template>
  <view class="mental-page">
    <view class="hero-card">
      <view class="hero-inner">
        <view class="hero-icon-wrap">
          <text class="ri-heart-3-fill hero-ico"></text>
        </view>
        <text class="hero-title">心理健康小站</text>
        <text class="hero-desc">关注自我，拥抱阳光</text>
      </view>
    </view>

    <view class="section">
      <text class="sec-title">自助工具</text>
      <view class="tool-grid">
        <view class="tool-card" v-for="tool in tools" :key="tool.name">
          <view class="tool-icon-circle" :style="{ background: tool.color + '14' }">
            <text :class="'tool-ico ' + ({compose:'ri-edit-box-line',loop:'ri-loop-left-line',eye:'ri-eye-line',bars:'ri-bar-chart-2-line'}[tool.icon] || '')" :style="{ color: tool.color }"></text>
          </view>
          <text class="tool-name">{{ tool.name }}</text>
          <text class="ri-arrow-right-s-line tool-arrow-ico"></text>
        </view>
      </view>
    </view>

    <view class="section">
      <text class="sec-title">心理科普</text>
      <view v-for="(a, idx) in articles" :key="a.title" class="article-card">
        <view class="art-index">{{ String(idx + 1).padStart(2, '0') }}</view>
        <view class="art-content">
          <text class="art-title">{{ a.title }}</text>
          <text class="art-desc">{{ a.desc }}</text>
        </view>
      </view>
      <view v-if="!articles.length" class="empty-box">
        <text class="ri-information-line empty-ico"></text>
        <text class="empty-t">暂无科普内容</text>
      </view>
    </view>

    <view class="section hotline-section">
      <text class="sec-title">求助热线</text>
      <view class="hotline-card">
        <view class="hotline-icon-wrap urgent">
          <text class="ri-phone-line hotline-ico hotline-ico--urgent"></text>
        </view>
        <view class="hotline-info">
          <text class="hotline-name">心理援助热线</text>
          <text class="hotline-num">400-161-9995</text>
        </view>
        <view class="hotline-badge">24h</view>
      </view>
      <view class="hotline-card">
        <view class="hotline-icon-wrap school">
          <text class="ri-phone-line hotline-ico hotline-ico--school"></text>
        </view>
        <view class="hotline-info">
          <text class="hotline-name">校心理咨询中心</text>
          <text class="hotline-num">010-12345678</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const tools = ref([
  { name: '情绪日记', icon: 'compose', color: '#94B8D6' },
  { name: '呼吸练习', icon: 'loop', color: '#A882E0' },
  { name: '正念冥想', icon: 'eye', color: '#8C61D6' },
  { name: '压力测评', icon: 'bars', color: '#D4A5C0' }
])

const articles = ref([
  { title: '如何应对考试焦虑？', desc: '考试焦虑是很多同学面临的问题，学会正确认知和调节很重要...' },
  { title: '社交恐惧不是你的错', desc: '社交焦虑是一种常见的心理现象，了解它才能更好地克服它...' },
  { title: '睡眠质量提升指南', desc: '良好的睡眠习惯是心理健康的基石，试试这些方法...' }
])
</script>

<style scoped>
.mental-page {
  min-height: 100vh;
  background: #F7F6FA;
  padding-bottom: 60rpx;
}

.hero-card {
  margin: 24rpx 24rpx 0;
  border-radius: 24rpx;
  background: #8C61D6;
  overflow: hidden;
}

.hero-inner {
  padding: 56rpx 40rpx 52rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}

.hero-title {
  font-size: 40rpx;
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: 2rpx;
}

.hero-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 10rpx;
}

.section {
  margin: 32rpx 24rpx 0;
}

.sec-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #3A3030;
  display: block;
  margin-bottom: 20rpx;
}

.tool-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.tool-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 28rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.tool-icon-circle {
  width: 56rpx;
  height: 56rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tool-name {
  font-size: 28rpx;
  color: #3A3030;
  font-weight: 600;
  flex: 1;
}

.article-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  display: flex;
  gap: 20rpx;
  align-items: flex-start;
}

.art-index {
  font-size: 36rpx;
  font-weight: 800;
  color: #BBA2CA;
  line-height: 1;
  flex-shrink: 0;
  min-width: 50rpx;
}

.art-content {
  flex: 1;
}

.art-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #3A3030;
  display: block;
  margin-bottom: 10rpx;
}

.art-desc {
  font-size: 24rpx;
  color: #747288;
  line-height: 1.7;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hotline-section {
  margin-bottom: 40rpx;
}

.hotline-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.hotline-icon-wrap {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hotline-icon-wrap.urgent {
  background: rgba(212, 165, 192, 0.12);
}

.hotline-icon-wrap.school {
  background: rgba(140, 97, 214, 0.08);
}

.hotline-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.hotline-name {
  font-size: 26rpx;
  color: #747288;
}

.hotline-num {
  font-size: 30rpx;
  color: #3A3030;
  font-weight: 700;
  letter-spacing: 1rpx;
}

.hotline-badge {
  font-size: 20rpx;
  color: #D4A5C0;
  background: rgba(212, 165, 192, 0.1);
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-weight: 600;
}

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
}

.empty-t {
  font-size: 28rpx;
  color: #A09CAE;
  margin-top: 16rpx;
}

.hero-ico {
  font-size: 36rpx;
  color: #FFFFFF;
}

.tool-ico {
  font-size: 28rpx;
}

.tool-arrow-ico {
  font-size: 26rpx;
  color: #A09CAE;
}

.empty-ico {
  font-size: 64rpx;
  color: #A09CAE;
}

.hotline-ico {
  font-size: 28rpx;
}

.hotline-ico--urgent {
  color: #D4A5C0;
}

.hotline-ico--school {
  color: #8C61D6;
}
</style>
