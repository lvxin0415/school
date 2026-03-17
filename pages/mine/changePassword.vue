<template>
  <view class="pwd-page">
    <view class="form-section">
      <view class="input-group">
        <text class="input-label">原密码</text>
        <input v-model="oldPwd" class="form-input" type="password" placeholder="请输入原密码" />
      </view>
      <view class="input-group">
        <text class="input-label">新密码</text>
        <input v-model="newPwd" class="form-input" type="password" placeholder="请输入新密码(至少6位)" />
      </view>
      <view class="input-group">
        <text class="input-label">确认密码</text>
        <input v-model="confirmPwd" class="form-input" type="password" placeholder="请再次输入新密码" />
      </view>
    </view>
    <button class="btn-save" @click="handleSave">确认修改</button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const oldPwd = ref('')
const newPwd = ref('')
const confirmPwd = ref('')

async function handleSave() {
  if (!oldPwd.value) return uni.showToast({ title: '请输入原密码', icon: 'none' })
  if (newPwd.value.length < 6) return uni.showToast({ title: '新密码至少6位', icon: 'none' })
  if (newPwd.value !== confirmPwd.value) return uni.showToast({ title: '两次密码不一致', icon: 'none' })
  try {
    await callCloud('change-password', { oldPassword: oldPwd.value, newPassword: newPwd.value })
    uni.showToast({ title: '修改成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 500)
  } catch (e) { console.error(e) }
}
</script>

<style scoped>
.pwd-page {
  min-height: 100vh;
  background: #F7F6FA;
  padding: 24rpx;
}

.form-section {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 8rpx 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.input-group {
  padding: 28rpx 0;
  border-bottom: 1rpx solid #ECEAF0;
}

.input-group:last-child {
  border-bottom: none;
}

.input-label {
  font-size: 26rpx;
  color: #747288;
  display: block;
  margin-bottom: 12rpx;
}

.form-input {
  font-size: 30rpx;
  color: #3A3030;
  height: 60rpx;
}

.btn-save {
  margin-top: 60rpx;
  height: 96rpx;
  line-height: 96rpx;
  background: #8C61D6;
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 24rpx;
  border: none;
}

.btn-save::after {
  border: none;
}
</style>
