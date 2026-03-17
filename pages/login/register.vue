<template>
  <view class="pg">
    <!-- nav bar -->
    <view class="nav" :style="{ paddingTop: barH + 'px' }">
      <view class="nav-back" @click="goBack">
        <text class="ri-arrow-left-s-line nav-ico"></text>
      </view>
    </view>

    <!-- scroll content -->
    <scroll-view scroll-y class="content">
      <!-- title area -->
      <view class="title-area anim-fade">
        <text class="title">创建账号</text>
        <text class="subtitle">加入逛校园，发现更多精彩</text>
      </view>

      <!-- form card -->
      <view class="form-card anim-rise">
        <!-- username -->
        <view class="grp" :class="{ on: fc === 'u' }">
          <view class="grp-head">
            <text class="ri-user-3-line gh-ico"></text>
            <text class="gh-label">用户名</text>
          </view>
          <input v-model="form.username" class="grp-input" placeholder="4-20位字母或数字"
            placeholder-style="color:#A09CAE" maxlength="20"
            @focus="fc = 'u'" @blur="fc = ''" />
        </view>

        <!-- nickname -->
        <view class="grp" :class="{ on: fc === 'n' }">
          <view class="grp-head">
            <text class="ri-emotion-happy-line gh-ico"></text>
            <text class="gh-label">昵称</text>
          </view>
          <input v-model="form.nickname" class="grp-input" placeholder="给自己起个名字吧"
            placeholder-style="color:#A09CAE" maxlength="12"
            @focus="fc = 'n'" @blur="fc = ''" />
        </view>

        <!-- password -->
        <view class="grp" :class="{ on: fc === 'p' }">
          <view class="grp-head">
            <text class="ri-lock-2-line gh-ico"></text>
            <text class="gh-label">密码</text>
          </view>
          <input v-model="form.password" class="grp-input" type="password" placeholder="至少6位密码"
            placeholder-style="color:#A09CAE" maxlength="30"
            @focus="fc = 'p'" @blur="fc = ''" />
        </view>

        <!-- confirm password -->
        <view class="grp" :class="{ on: fc === 'c' }">
          <view class="grp-head">
            <text class="ri-shield-check-line gh-ico"></text>
            <text class="gh-label">确认密码</text>
          </view>
          <input v-model="form.confirmPwd" class="grp-input" type="password" placeholder="再次输入密码"
            placeholder-style="color:#A09CAE" maxlength="30"
            @focus="fc = 'c'" @blur="fc = ''" />
        </view>

        <!-- submit -->
        <button class="btn-reg" :loading="loading" @click="handleRegister">注 册</button>

        <!-- back link -->
        <view class="back-link" @click="goBack">
          <text class="bl-hint">已有账号？</text>
          <text class="bl-action">返回登录</text>
        </view>
      </view>

      <view style="height: 80rpx"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useUserStore } from '@/store/user.js'
import { callCloud } from '@/common/utils/request.js'

const userStore = useUserStore()
const loading = ref(false)
const fc = ref('')
const barH = uni.getSystemInfoSync().statusBarHeight || 44
const form = reactive({
  username: '',
  nickname: '',
  password: '',
  confirmPwd: ''
})

async function handleRegister() {
  if (!form.username.trim() || form.username.length < 4)
    return uni.showToast({ title: '用户名至少4位', icon: 'none' })
  if (!form.nickname.trim())
    return uni.showToast({ title: '请输入昵称', icon: 'none' })
  if (form.password.length < 6)
    return uni.showToast({ title: '密码至少6位', icon: 'none' })
  if (form.password !== form.confirmPwd)
    return uni.showToast({ title: '两次密码不一致', icon: 'none' })

  loading.value = true
  try {
    await callCloud('user-register', {
      username: form.username,
      password: form.password,
      nickname: form.nickname
    })
    uni.showToast({ title: '注册成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 800)
  } catch (e) {
    console.error('注册失败', e)
  } finally {
    loading.value = false
  }
}

function goBack() {
  uni.navigateBack()
}
</script>

<style scoped>
.pg {
  min-height: 100vh;
  background: #F7F6FA;
  display: flex;
  flex-direction: column;
}

/* ========== nav ========== */
.nav {
  position: relative;
  z-index: 3;
  padding-left: 32rpx;
  padding-right: 32rpx;
  padding-bottom: 8rpx;
  background: #F7F6FA;
}

.nav-back {
  width: 68rpx;
  height: 68rpx;
  border-radius: 16rpx;
  background: #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.nav-ico {
  font-size: 36rpx;
  color: #3A3030;
}

/* ========== content ========== */
.content {
  flex: 1;
  padding: 0 40rpx;
}

/* title */
.title-area {
  padding: 32rpx 0 36rpx 8rpx;
}

.title {
  display: block;
  font-size: 48rpx;
  font-weight: 800;
  color: #3A3030;
  letter-spacing: 6rpx;
}

.subtitle {
  display: block;
  font-size: 26rpx;
  color: #747288;
  letter-spacing: 3rpx;
  margin-top: 12rpx;
}

/* ========== form card ========== */
.form-card {
  width: 100%;
  padding: 40rpx 32rpx 36rpx;
  border-radius: 24rpx;
  background: #FFF;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.grp {
  padding: 16rpx 22rpx;
  margin-bottom: 20rpx;
  background: #F5F4F8;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
  transition: border-color 0.25s, background 0.25s;
}

.grp.on {
  border-color: #8C61D6;
  background: #FFF;
}

.grp-head {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 4rpx;
}

.gh-ico {
  font-size: 22rpx;
  color: #8C61D6;
}

.gh-label {
  font-size: 22rpx;
  color: #8C61D6;
  font-weight: 600;
  letter-spacing: 2rpx;
}

.grp-input {
  width: 100%;
  height: 68rpx;
  font-size: 30rpx;
  color: #3A3030;
  background: transparent;
  padding: 0;
  margin: 0;
}

/* ========== button ========== */
.btn-reg {
  width: 100%;
  margin-top: 30rpx;
  height: 96rpx;
  line-height: 96rpx;
  background: #8C61D6;
  color: #FFF;
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: 12rpx;
  border-radius: 48rpx;
  border: none;
  box-shadow: 0 4rpx 16rpx rgba(140, 97, 214, 0.18);
  padding: 0;
  margin-left: 0;
  margin-right: 0;
}

.btn-reg::after {
  border: none;
}

/* ========== back link ========== */
.back-link {
  margin-top: 32rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bl-hint {
  font-size: 26rpx;
  color: #A09CAE;
}

.bl-action {
  font-size: 26rpx;
  color: #8C61D6;
  font-weight: 600;
  margin-left: 8rpx;
}

/* ========== animations ========== */
.anim-fade {
  animation: fadeIn 0.6s ease both;
}

.anim-rise {
  animation: riseUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 0.15s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-16rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes riseUp {
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
