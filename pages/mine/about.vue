<template>
  <view class="about-page">
    <view class="logo-section">
      <view class="logo-box">
        <text class="ri-home-4-line logo-ico"></text>
      </view>
      <text class="app-name">逛校园</text>
      <text class="app-ver">V1.0.0</text>
    </view>

    <view class="info-section">
      <view class="info-item">
        <text class="info-label">项目介绍</text>
        <text class="info-content">逛校园是一款面向大学生的综合校园生活平台，集匿名留言墙、学习打卡记录、3D校园参观、活动广场等功能于一体。</text>
      </view>
      <view class="info-item">
        <text class="info-label">技术栈</text>
        <text class="info-content">uni-app + Vue 3 + uniCloud + Three.js</text>
      </view>
      <view class="info-item">
        <text class="info-label">开发者</text>
        <text class="info-content">Campus Explorer Team</text>
      </view>
    </view>
  </view>
</template>

<script setup>
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: #F7F6FA;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80rpx 0 40rpx;
}

.logo-box {
  width: 140rpx;
  height: 140rpx;
  background: #FFFFFF;
  border-radius: 32rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  margin-bottom: 24rpx;
}

.app-name {
  font-size: 40rpx;
  font-weight: 700;
  color: #3A3030;
}

.app-ver {
  font-size: 26rpx;
  color: #A09CAE;
  margin-top: 8rpx;
}

.info-section {
  margin: 40rpx 24rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 8rpx 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.info-item {
  padding: 28rpx 0;
  border-bottom: 1rpx solid #ECEAF0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 26rpx;
  color: #747288;
  display: block;
  margin-bottom: 12rpx;
}

.info-content {
  font-size: 28rpx;
  color: #3A3030;
  line-height: 1.6;
}

.logo-ico {
  font-size: 64rpx;
  color: #8C61D6;
}
</style>
