<template>
  <view class="edit-page">
    <view class="form-section">
      <view class="form-item">
        <text class="form-label">头像</text>
        <view class="avatar-wrap" @click="chooseAvatar">
          <image v-if="avatar" :src="avatar" mode="aspectFill" class="avatar-img" />
          <view v-else class="avatar-placeholder">
            <text class="ri-camera-line avatar-ico"></text>
          </view>
        </view>
      </view>
      <view class="form-item">
        <text class="form-label">昵称</text>
        <input v-model="nickname" class="form-input" placeholder="请输入昵称" maxlength="20" />
      </view>
    </view>
    <button class="btn-save" @click="saveProfile">保存</button>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/user.js'
import { callCloud } from '@/common/utils/request.js'

const userStore = useUserStore()
const nickname = ref('')
const avatar = ref('')

onMounted(() => {
  nickname.value = userStore.userInfo.nickname || ''
  avatar.value = userStore.userInfo.avatar || ''
})

function chooseAvatar() {
  uni.chooseImage({
    count: 1, sizeType: ['compressed'],
    success: (res) => { avatar.value = res.tempFilePaths[0] }
  })
}

async function saveProfile() {
  if (!nickname.value.trim()) return uni.showToast({ title: '昵称不能为空', icon: 'none' })
  try {
    await callCloud('update-profile', { nickname: nickname.value, avatar: avatar.value })
    userStore.userInfo.nickname = nickname.value
    userStore.userInfo.avatar = avatar.value
    uni.showToast({ title: '保存成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 500)
  } catch (e) { console.error(e) }
}
</script>

<style scoped>
.edit-page {
  min-height: 100vh;
  background: #F7F6FA;
  padding: 24rpx;
}

.form-section {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 0 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 0;
  border-bottom: 1rpx solid #ECEAF0;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  font-size: 30rpx;
  color: #3A3030;
  font-weight: 500;
}

.form-input {
  text-align: right;
  font-size: 30rpx;
  color: #3A3030;
  flex: 1;
  margin-left: 40rpx;
}

.avatar-wrap {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #F7F6FA;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2rpx dashed #ECEAF0;
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

.avatar-ico {
  font-size: 36rpx;
  color: #A09CAE;
}
</style>
