<template>
  <view class="notice-page">
    <view class="form-section">
      <view class="input-group">
        <text class="input-label">通知标题</text>
        <input v-model="title" class="form-input" placeholder="请输入通知标题" maxlength="50" />
      </view>
      <view class="input-group">
        <text class="input-label">通知内容</text>
        <textarea v-model="content" class="form-textarea" placeholder="请输入通知内容..." maxlength="500" />
        <text class="char-count">{{ content.length }}/500</text>
      </view>
      <view class="input-group">
        <text class="input-label">发送对象</text>
        <view class="target-row">
          <view class="target-tag" :class="{ active: target === 'all' }" @click="target = 'all'">
            <text>全部用户</text>
          </view>
          <view class="target-tag" :class="{ active: target === 'active' }" @click="target = 'active'">
            <text>活跃用户</text>
          </view>
        </view>
      </view>
    </view>

    <button class="btn-send" @click="handleSend">发送通知</button>

    <view class="history-section">
      <text class="sec-title">发送记录</text>
      <view v-for="n in history" :key="n._id" class="history-card">
        <text class="h-title">{{ n.title }}</text>
        <text class="h-content text-ellipsis">{{ n.content }}</text>
        <text class="h-time">{{ n.created_at }} · 发送给{{ n.target === 'all' ? '全部用户' : '活跃用户' }}</text>
      </view>
      <view v-if="!history.length" class="empty-box">
        <text class="ri-notification-3-line empty-icon"></text>
        <text class="empty-t">暂无发送记录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const title = ref('')
const content = ref('')
const target = ref('all')
const history = ref([])

onMounted(() => { loadHistory() })

async function loadHistory() {
  try {
    const res = await callCloud('admin-get-notices', {})
    history.value = res.data || []
  } catch (e) { console.error(e) }
}

async function handleSend() {
  if (!title.value.trim()) return uni.showToast({ title: '请输入通知标题', icon: 'none' })
  if (!content.value.trim()) return uni.showToast({ title: '请输入通知内容', icon: 'none' })

  uni.showModal({
    title: '确认发送', content: `确定发送通知给${target.value === 'all' ? '全部用户' : '活跃用户'}？`,
    success: async (r) => {
      if (r.confirm) {
        try {
          await callCloud('admin-send-notice', { title: title.value, content: content.value, target: target.value })
          uni.showToast({ title: '发送成功', icon: 'success' })
          title.value = ''
          content.value = ''
          loadHistory()
        } catch (e) { console.error(e) }
      }
    }
  })
}
</script>

<style scoped>
.notice-page {
  min-height: 100vh;
  background: #F7F6FA;
  padding: 24rpx;
}

.form-section {
  background: #FFF;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.input-group {
  margin-bottom: 24rpx;
}

.input-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #3A3030;
  display: block;
  margin-bottom: 12rpx;
}

.form-input {
  height: 80rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  border: 1rpx solid #ECEAF0;
  border-radius: 16rpx;
  width: 100%;
  box-sizing: border-box;
}

.form-textarea {
  width: 100%;
  height: 200rpx;
  padding: 20rpx;
  font-size: 28rpx;
  border: 1rpx solid #ECEAF0;
  border-radius: 16rpx;
  box-sizing: border-box;
}

.char-count {
  font-size: 22rpx;
  color: #A09CAE;
  text-align: right;
  display: block;
  margin-top: 4rpx;
}

.target-row {
  display: flex;
  gap: 16rpx;
}

.target-tag {
  padding: 12rpx 32rpx;
  border-radius: 48rpx;
  background: #F7F6FA;
  font-size: 26rpx;
  color: #747288;
}

.target-tag.active {
  background: rgba(140, 97, 214, 0.1);
  color: #8C61D6;
  font-weight: 600;
}

.btn-send {
  margin-top: 32rpx;
  height: 96rpx;
  line-height: 96rpx;
  background: #8C61D6;
  color: #FFF;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 48rpx;
  border: none;
}

.btn-send::after {
  border: none;
}

.history-section {
  margin-top: 40rpx;
}

.sec-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #3A3030;
  display: block;
  margin-bottom: 16rpx;
}

.history-card {
  background: #FFF;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.h-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #3A3030;
  display: block;
}

.h-content {
  font-size: 24rpx;
  color: #747288;
  margin-top: 8rpx;
  display: block;
}

.h-time {
  font-size: 22rpx;
  color: #A09CAE;
  margin-top: 8rpx;
  display: block;
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

.empty-icon {
  font-size: 56rpx;
  color: #A09CAE;
}
</style>
