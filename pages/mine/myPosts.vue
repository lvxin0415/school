<template>
  <view class="my-posts-page">
    <scroll-view scroll-y class="posts-scroll" @scrolltolower="loadMore">
      <view v-for="post in list" :key="post._id" class="post-card" @click="goDetail(post._id)">
        <text class="post-content text-ellipsis-2">{{ post.content }}</text>
        <view v-if="post.images && post.images.length" class="post-imgs">
          <image v-for="(img, i) in post.images.slice(0, 3)" :key="i" :src="img" mode="aspectFill" class="p-img" />
        </view>
        <view class="post-bottom">
          <text class="post-time">{{ post.created_at }}</text>
          <view class="post-stats">
            <text class="ri-heart-3-line stat-ico"></text>
            <text class="stat-n">{{ post.likes || 0 }}</text>
            <text class="ri-chat-3-line stat-ico"></text>
            <text class="stat-n">{{ post.comment_count || 0 }}</text>
          </view>
          <text class="post-status" :class="post.status">{{ statusText(post.status) }}</text>
        </view>
      </view>

      <view v-if="loading" class="load-tip"><text>加载中...</text></view>
      <view v-if="noMore && list.length" class="load-tip"><text>— 没有更多了 —</text></view>
      <view v-if="!loading && !list.length" class="empty-box">
        <text class="ri-edit-box-line empty-ico"></text>
        <text class="empty-t">你还没有发过帖子</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const list = ref([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)

onMounted(() => { loadData() })

async function loadData() {
  if (loading.value || noMore.value) return
  loading.value = true
  try {
    const res = await callCloud('getMyPosts', { page: page.value, pageSize: 15 })
    const data = res.data || []
    if (data.length < 15) noMore.value = true
    list.value = [...list.value, ...data]
    page.value++
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

function loadMore() { loadData() }
function goDetail(id) { uni.navigateTo({ url: `/pages/wall/detail?id=${id}` }) }
function statusText(s) { return { pending: '审核中', approved: '已通过', rejected: '未通过', reported: '被举报' }[s] || s }
</script>

<style scoped>
.my-posts-page {
  min-height: 100vh;
  background: #F7F6FA;
}

.posts-scroll {
  height: 100vh;
}

.post-card {
  margin: 16rpx 24rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 28rpx;
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
  gap: 12rpx;
  margin-top: 16rpx;
}

.p-img {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
}

.post-bottom {
  display: flex;
  align-items: center;
  margin-top: 20rpx;
  gap: 16rpx;
}

.post-time {
  font-size: 22rpx;
  color: #A09CAE;
  flex: 1;
}

.post-stats {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.stat-n {
  font-size: 22rpx;
  color: #A09CAE;
  margin-right: 10rpx;
}

.post-status {
  font-size: 22rpx;
  padding: 4rpx 18rpx;
  border-radius: 99px;
  font-weight: 500;
}

.post-status.pending {
  background: rgba(240, 173, 78, 0.1);
  color: #F0AD4E;
}

.post-status.approved {
  background: rgba(92, 184, 92, 0.1);
  color: #5CB85C;
}

.post-status.rejected {
  background: rgba(232, 93, 93, 0.1);
  color: #E85D5D;
}

.post-status.reported {
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

.stat-ico {
  font-size: 26rpx;
  color: #A09CAE;
}

.empty-ico {
  font-size: 64rpx;
  color: #A09CAE;
}
</style>
