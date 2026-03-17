<template>
  <view class="custom-tabbar safe-area-bottom">
    <view class="tabbar-bg"></view>
    <view class="tabbar-content">
      <view v-for="(item, index) in tabs" :key="item.path" class="tab-item" :class="{ active: currentIndex === index }"
        @click="switchTab(item, index)">
        <view class="tab-icon-wrap" :class="{ active: currentIndex === index }">
          <text :class="currentIndex === index ? item.activeIcon : item.icon" class="tab-ico" :style="{ color: currentIndex === index ? '#8C61D6' : '#A09CAE' }"></text>
          <view v-if="item.badge > 0" class="tab-badge">{{ item.badge > 99 ? '99+' : item.badge }}</view>
        </view>
        <text class="tab-text" :class="{ active: currentIndex === index }">{{ item.text }}</text>
        <view v-if="currentIndex === index" class="tab-indicator"></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user.js'

const props = defineProps({
  current: { type: Number, default: 0 }
})

const userStore = useUserStore()
const currentIndex = ref(props.current)

const tabs = computed(() => [
  { text: '首页', icon: 'ri-home-4-line', activeIcon: 'ri-home-4-fill', path: '/pages/index/index', badge: 0 },
  { text: '消息', icon: 'ri-chat-3-line', activeIcon: 'ri-chat-3-fill', path: '/pages/message/message', badge: userStore.unreadCount },
  { text: '我的', icon: 'ri-user-3-line', activeIcon: 'ri-user-3-fill', path: '/pages/mine/mine', badge: 0 }
])

function switchTab(item, index) {
  if (currentIndex.value === index) return
  currentIndex.value = index
  uni.switchTab({ url: item.path })
}
</script>

<style scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
}

.tabbar-bg {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border-top: 1rpx solid #ECEAF0;
  box-shadow: 0 -2rpx 12rpx rgba(0, 0, 0, 0.04);
}

.tabbar-content {
  position: relative;
  display: flex;
  align-items: center;
  height: 110rpx;
  padding: 0 20rpx;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-icon-wrap {
  position: relative;
  width: 52rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-icon-wrap.active {
  background: rgba(140, 97, 214, 0.1);
  transform: scale(1.08);
}

.tab-ico {
  font-size: 36rpx;
}

.tab-badge {
  position: absolute;
  top: -8rpx;
  right: -14rpx;
  min-width: 28rpx;
  height: 28rpx;
  line-height: 28rpx;
  text-align: center;
  padding: 0 6rpx;
  background: #E06B6B;
  color: #FFFFFF;
  font-size: 18rpx;
  font-weight: 600;
  border-radius: 200rpx;
  border: 2rpx solid #FFFFFF;
}

.tab-text {
  font-size: 20rpx;
  color: #A09CAE;
  margin-top: 2rpx;
  transition: all 0.3s;
  font-weight: 500;
}

.tab-text.active {
  color: #8C61D6;
  font-weight: 600;
}

.tab-indicator {
  position: absolute;
  top: 0;
  width: 40rpx;
  height: 4rpx;
  background: #8C61D6;
  border-radius: 0 0 4rpx 4rpx;
}
</style>
