<template>
  <view class="review-page">
    <scroll-view scroll-y class="review-scroll" @scrolltolower="loadMore">
      <view v-for="post in list" :key="post._id" class="post-card">
        <text class="post-content">{{ post.content }}</text>
        <view v-if="post.images && post.images.length" class="post-imgs">
          <image v-for="(img, i) in post.images.slice(0, 3)" :key="i" :src="img" mode="aspectFill" class="p-img" />
        </view>
        <text class="post-time">{{ post.anonymous_name }} · {{ post.created_at }}</text>
        <view class="post-actions">
          <text class="action-btn approve" @click="review(post._id, 'approve')">通过</text>
          <text class="action-btn reject" @click="review(post._id, 'reject')">拒绝</text>
        </view>
      </view>

      <view v-if="loading" class="load-tip"><text>加载中...</text></view>
      <view v-if="!loading && !list.length" class="empty-box">
        <text class="ri-checkbox-circle-fill empty-icon"></text>
        <text class="empty-t">没有待审核的帖子</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const list = ref([])
const loading = ref(false)
const page = ref(1)

onMounted(() => { loadData() })

async function loadData() {
  loading.value = true
  try {
    const res = await callCloud('admin-review-post', { action: 'list', tab: 'pending', page: page.value })
    list.value = [...list.value, ...(res.data || [])]
    page.value++
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

function loadMore() { loadData() }

async function review(id, action) {
  try {
    await callCloud('admin-review-post', { id, action })
    list.value = list.value.filter(p => p._id !== id)
    uni.showToast({ title: action === 'approve' ? '已通过' : '已拒绝', icon: 'success' })
  } catch (e) { console.error(e) }
}
</script>

<style scoped>
.review-page {
  min-height: 100vh;
  background: #F7F6FA;
}

.review-scroll {
  height: 100vh;
}

.post-card {
  margin: 16rpx 24rpx;
  background: #FFF;
  border-radius: 24rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.post-content {
  font-size: 28rpx;
  color: #3A3030;
  line-height: 1.6;
  display: block;
}

.post-imgs {
  display: flex;
  gap: 10rpx;
  margin-top: 16rpx;
}

.p-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
}

.post-time {
  font-size: 22rpx;
  color: #A09CAE;
  display: block;
  margin-top: 12rpx;
}

.post-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 16rpx;
}

.action-btn {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  border-radius: 48rpx;
  font-size: 28rpx;
  font-weight: 600;
}

.action-btn.approve {
  background: rgba(92, 184, 92, 0.1);
  color: #5CB85C;
}

.action-btn.reject {
  background: rgba(232, 93, 93, 0.1);
  color: #E85D5D;
}

.load-tip {
  text-align: center;
  padding: 30rpx;
  font-size: 24rpx;
  color: #A09CAE;
}

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-t {
  font-size: 28rpx;
  color: #A09CAE;
  margin-top: 20rpx;
}

.empty-icon {
  font-size: 64rpx;
  color: #5CB85C;
}
</style>
