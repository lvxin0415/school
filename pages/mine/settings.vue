<template>
  <view class="settings-page">
    <view class="menu-group">
      <view class="menu-item" @click="goEditProfile">
        <view
          class="menu-icon-wrap"
          style="background: rgba(140, 97, 214, 0.08)"
        >
          <text class="ri-user-3-line menu-ico person-ico"></text>
        </view>
        <text class="menu-text">编辑资料</text>
        <text class="ri-arrow-right-s-line arrow-ico"></text>
      </view>
      <view class="menu-item" @click="goChangePassword">
        <view
          class="menu-icon-wrap"
          style="background: rgba(168, 130, 224, 0.08)"
        >
          <text class="ri-lock-2-line menu-ico lock-ico"></text>
        </view>
        <text class="menu-text">修改密码</text>
        <text class="ri-arrow-right-s-line arrow-ico"></text>
      </view>
    </view>

    <view class="menu-group">
      <view class="menu-item" @click="clearCache">
        <view
          class="menu-icon-wrap"
          style="background: rgba(240, 173, 78, 0.08)"
        >
          <text class="ri-delete-bin-line menu-ico trash-ico"></text>
        </view>
        <text class="menu-text">清理缓存</text>
        <text class="ri-arrow-right-s-line arrow-ico"></text>
      </view>
      <!-- <view class="menu-item" @click="goAbout">
        <view class="menu-icon-wrap" style="background: rgba(140, 97, 214, 0.08)">
          <text class="ri-information-line menu-ico info-ico"></text>
        </view>
        <text class="menu-text">关于逛校园</text>
        <text class="ri-arrow-right-s-line arrow-ico"></text>
      </view> -->
    </view>

    <button class="btn-logout" @click="handleLogout">退出登录</button>
  </view>
</template>

<script setup>
import { useUserStore } from "@/store/user.js"

const userStore = useUserStore()

function goEditProfile() {
  uni.navigateTo({ url: "/pages/mine/editProfile" })
}
function goChangePassword() {
  uni.navigateTo({ url: "/pages/mine/changePassword" })
}
function goAbout() {
  uni.navigateTo({ url: "/pages/mine/about" })
}

function clearCache() {
  uni.showModal({
    title: "清理缓存",
    content: "确定清理本地缓存吗？",
    success: (r) => {
      if (r.confirm) {
        uni.clearStorageSync()
        uni.showToast({ title: "清理完成", icon: "success" })
      }
    }
  })
}

function handleLogout() {
  uni.showModal({
    title: "退出登录",
    content: "确定退出当前账号吗？",
    success: (r) => {
      if (r.confirm) {
        userStore.logout()
        uni.reLaunch({ url: "/pages/login/login" })
      }
    }
  })
}
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: #f7f6fa;
  padding: 24rpx;
}

.menu-group {
  background: #ffffff;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx 28rpx;
  border-bottom: 1rpx solid #eceaf0;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon-wrap {
  width: 56rpx;
  height: 56rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #3a3030;
  margin-left: 20rpx;
  font-weight: 500;
}

.btn-logout {
  margin-top: 80rpx;
  height: 96rpx;
  line-height: 96rpx;
  background: #ffffff;
  color: #e85d5d;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 24rpx;
  border: none;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.btn-logout::after {
  border: none;
}

.menu-ico {
  font-size: 36rpx;
}

.person-ico {
  color: #8c61d6;
}

.lock-ico {
  color: #a882e0;
}

.trash-ico {
  color: #f0ad4e;
}

.info-ico {
  color: #8c61d6;
}

.arrow-ico {
  font-size: 28rpx;
  color: #a09cae;
}
</style>
