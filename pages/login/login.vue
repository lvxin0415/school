<template>
  <view class="pg" :style="{ paddingTop: barH + 'px' }">
    <!-- header -->
    <view class="header">
      <view class="logo-wrap anim-drop">
        <image src="/static/logo.png" mode="aspectFit" class="logo-img" />
      </view>
      <text class="brand anim-drop-d1">逛校园</text>
      <text class="slogan anim-drop-d2">遇见美好校园</text>
    </view>

    <!-- form -->
    <view class="form-card anim-rise">
      <view class="field" :class="{ focus: fc === 'u' }">
        <view class="field-icon">
          <text class="ri-user-3-line fi"></text>
        </view>
        <input v-model="username" class="field-input" placeholder="请输入用户名"
          placeholder-style="color:#A09CAE" maxlength="20"
          @focus="fc = 'u'" @blur="fc = ''" />
      </view>

      <view class="field" :class="{ focus: fc === 'p' }">
        <view class="field-icon">
          <text class="ri-lock-2-line fi"></text>
        </view>
        <input v-model="password" class="field-input" type="password" placeholder="请输入密码"
          placeholder-style="color:#A09CAE" maxlength="30"
          @focus="fc = 'p'" @blur="fc = ''" />
      </view>

      <button class="btn-login" :loading="loading" @click="handleLogin">登 录</button>

      <view class="link-row" @click="goRegister">
        <text class="link-hint">还没有账号？</text>
        <text class="link-action">立即注册</text>
      </view>
    </view>

    <!-- footer -->
    <view class="ft">
      <text class="ft-t">逛校园 v1.0.0</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/store/user.js'

const userStore = useUserStore()
const username = ref('')
const password = ref('')
const loading = ref(false)
const fc = ref('')
const barH = uni.getSystemInfoSync().statusBarHeight || 44

async function handleLogin() {
  if (!username.value.trim()) return uni.showToast({ title: '请输入用户名', icon: 'none' })
  if (!password.value.trim()) return uni.showToast({ title: '请输入密码', icon: 'none' })
  loading.value = true
  try {
    const res = await userStore.login(username.value, password.value)
    uni.showToast({ title: '登录成功', icon: 'success' })
    const isAdmin = res && res.userInfo && res.userInfo.role === 'admin'
    setTimeout(() => {
      uni.reLaunch({ url: isAdmin ? '/pages/admin/index' : '/pages/index/index' })
    }, 500)
  } catch (e) {
    console.error('登录失败', e)
  } finally {
    loading.value = false
  }
}

function goRegister() {
  uni.navigateTo({ url: '/pages/login/register' })
}
</script>

<style scoped>
.pg {
  min-height: 100vh;
  background: #F7F6FA;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ========== header ========== */
.header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0 48rpx;
  background: linear-gradient(180deg, #E8DEFF 0%, #F0ECFF 40%, #F7F6FA 100%);
}

.logo-wrap {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  background: #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin-bottom: 28rpx;
}

.logo-img {
  width: 120rpx;
  height: 120rpx;
}

.brand {
  font-size: 48rpx;
  font-weight: 800;
  color: #3A3030;
  letter-spacing: 12rpx;
  margin-bottom: 10rpx;
}

.slogan {
  font-size: 24rpx;
  color: #747288;
  letter-spacing: 4rpx;
}

/* ========== form ========== */
.form-card {
  width: calc(100% - 80rpx);
  margin: 16rpx 40rpx 0;
  background: #FFF;
  border-radius: 24rpx;
  padding: 44rpx 36rpx 40rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.field {
  display: flex;
  align-items: center;
  gap: 16rpx;
  height: 100rpx;
  padding: 0 24rpx;
  margin-bottom: 24rpx;
  background: #F5F4F8;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
  transition: border-color 0.25s, background 0.25s;
}

.field.focus {
  border-color: #8C61D6;
  background: #FFF;
}

.field-icon {
  width: 44rpx;
  height: 44rpx;
  border-radius: 12rpx;
  background: rgba(140, 97, 214, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.fi {
  font-size: 26rpx;
  color: #8C61D6;
}

.field-input {
  flex: 1;
  height: 100rpx;
  font-size: 30rpx;
  color: #3A3030;
  background: transparent;
}

/* ========== button ========== */
.btn-login {
  margin-top: 32rpx;
  height: 96rpx;
  line-height: 96rpx;
  border-radius: 48rpx;
  border: none;
  background: #8C61D6;
  color: #FFF;
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: 12rpx;
  box-shadow: 0 4rpx 16rpx rgba(140, 97, 214, 0.18);
}

.btn-login::after {
  border: none;
}

/* ========== link ========== */
.link-row {
  margin-top: 36rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.link-hint {
  font-size: 26rpx;
  color: #A09CAE;
}

.link-action {
  font-size: 26rpx;
  color: #8C61D6;
  font-weight: 600;
  margin-left: 8rpx;
}

/* ========== footer ========== */
.ft {
  margin-top: auto;
  padding: 48rpx 0 40rpx;
  text-align: center;
}

.ft-t {
  font-size: 22rpx;
  color: #A09CAE;
  letter-spacing: 2rpx;
}

/* ========== animations ========== */
.anim-drop {
  animation: drop 0.6s ease both;
}

.anim-drop-d1 {
  animation: drop 0.6s ease both;
  animation-delay: 0.12s;
}

.anim-drop-d2 {
  animation: drop 0.6s ease both;
  animation-delay: 0.24s;
}

.anim-rise {
  animation: rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 0.3s;
}

@keyframes drop {
  from {
    opacity: 0;
    transform: translateY(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(36rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
