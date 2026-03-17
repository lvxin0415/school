<template>
  <view class="user-detail-page">
    <view class="profile-card">
      <view class="avatar-circle">
        <text class="avatar-char">{{ (user.nickname || user.username || '?')[0] }}</text>
      </view>
      <text class="user-name">{{ user.nickname || user.username }}</text>
      <text class="user-id">ID: {{ user._id }}</text>
      <view class="user-tags">
        <text class="tag role">{{ (user.role || ['user'])[0] }}</text>
        <text class="tag" :class="user.status === 1 ? 'banned' : 'normal'">{{ user.status === 1 ? '已封禁' : '正常' }}</text>
      </view>
    </view>

    <view class="info-section">
      <view class="info-row">
        <text class="info-label">注册时间</text>
        <text class="info-value">{{ formatDate(user.register_date) }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">最后登录</text>
        <text class="info-value">{{ formatDate(user.last_login_date) }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">积分</text>
        <text class="info-value">{{ user.points || 0 }}</text>
      </view>
    </view>

    <view class="action-section">
      <button v-if="user.status !== 1" class="btn-action ban" @click="toggleBan(1)">封禁用户</button>
      <button v-else class="btn-action unban" @click="toggleBan(0)">解除封禁</button>
      <button class="btn-action reset" @click="resetPassword">重置密码</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const user = ref({})

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const id = currentPage.$page?.options?.id || currentPage.options?.id
  if (id) loadUser(id)
})

async function loadUser(id) {
  try {
    const res = await callCloud('admin-get-user-detail', { id })
    user.value = res.data || {}
  } catch (e) { console.error(e) }
}

function formatDate(ts) {
  if (!ts) return '-'
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

function toggleBan(status) {
  const action = status === 1 ? '封禁' : '解封'
  uni.showModal({
    title: `确认${action}`, content: `确定${action}用户「${user.value.nickname || user.value.username}」？`,
    success: async (r) => {
      if (r.confirm) {
        await callCloud('admin-ban-user', { id: user.value._id, status })
        user.value.status = status
        uni.showToast({ title: `已${action}`, icon: 'success' })
      }
    }
  })
}

function resetPassword() {
  uni.showModal({
    title: '重置密码', content: '确定将该用户密码重置为 123456 ？',
    success: async (r) => {
      if (r.confirm) {
        await callCloud('admin-reset-password', { id: user.value._id })
        uni.showToast({ title: '已重置', icon: 'success' })
      }
    }
  })
}
</script>

<style scoped>
.user-detail-page {
  min-height: 100vh;
  background: #F7F6FA;
  padding: 24rpx;
}

.profile-card {
  background: #FFF;
  border-radius: 24rpx;
  padding: 48rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.avatar-circle {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: #8C61D6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-char {
  font-size: 48rpx;
  color: #FFF;
  font-weight: 700;
}

.user-name {
  font-size: 34rpx;
  font-weight: 700;
  color: #3A3030;
  margin-top: 16rpx;
}

.user-id {
  font-size: 22rpx;
  color: #A09CAE;
  margin-top: 6rpx;
}

.user-tags {
  display: flex;
  gap: 12rpx;
  margin-top: 16rpx;
}

.tag {
  font-size: 22rpx;
  padding: 4rpx 20rpx;
  border-radius: 99px;
}

.tag.role {
  background: rgba(140, 97, 214, 0.08);
  color: #8C61D6;
}

.tag.normal {
  background: rgba(92, 184, 92, 0.1);
  color: #5CB85C;
}

.tag.banned {
  background: rgba(232, 93, 93, 0.1);
  color: #E85D5D;
}

.info-section {
  background: #FFF;
  border-radius: 24rpx;
  margin-top: 20rpx;
  padding: 0 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 28rpx 0;
  border-bottom: 1rpx solid #ECEAF0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #A09CAE;
}

.info-value {
  font-size: 28rpx;
  color: #3A3030;
}

.action-section {
  margin-top: 40rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.btn-action {
  height: 88rpx;
  line-height: 88rpx;
  font-size: 30rpx;
  font-weight: 600;
  border-radius: 48rpx;
  border: none;
}

.btn-action::after {
  border: none;
}

.btn-action.ban {
  background: rgba(232, 93, 93, 0.1);
  color: #E85D5D;
}

.btn-action.unban {
  background: rgba(92, 184, 92, 0.1);
  color: #5CB85C;
}

.btn-action.reset {
  background: rgba(240, 173, 78, 0.1);
  color: #F0AD4E;
}
</style>
