<template>
  <view class="topic-page">
    <view class="topic-header">
      <text class="topic-tag">#{{ tagName }}</text>
      <text class="topic-count">共 {{ total }} 条帖子</text>
    </view>
    <scroll-view scroll-y class="topic-scroll" @scrolltolower="loadMore">
      <view v-for="post in postList" :key="post._id" class="post-card" @click="goDetail(post._id)">
        <view class="post-top">
          <view class="post-av" :style="{ background: post.avatar_color || '#8C61D6' }">
            <text class="av-c">{{ (post.anonymous_name || '匿')[0] }}</text>
          </view>
          <view class="post-m">
            <text class="pn">{{ post.anonymous_name || '匿名用户' }}</text>
            <text class="pt">{{ formatTime(post.created_at) }}</text>
          </view>
        </view>
        <text class="post-body text-ellipsis-2">{{ post.content }}</text>
        <view class="post-acts">
          <view class="act-item">
            <text class="ri-heart-3-line act-ico"></text>
            <text>{{ post.likes || 0 }}</text>
          </view>
          <view class="act-item">
            <text class="ri-chat-3-line act-ico"></text>
            <text>{{ post.comment_count || 0 }}</text>
          </view>
        </view>
      </view>
      <view v-if="loading" class="load-tip"><text>加载中...</text></view>
      <view v-if="noMore && postList.length" class="load-tip"><text>没有更多了</text></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'
import { formatTime } from '@/common/utils/helper.js'

const tagName = ref('')
const postList = ref([])
const total = ref(0)
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)

onMounted(() => {
  const pages = getCurrentPages()
  const cur = pages[pages.length - 1]
  tagName.value = decodeURIComponent(cur.options?.tag || '')
  uni.setNavigationBarTitle({ title: `#${tagName.value}` })
  loadPosts()
})

async function loadPosts() {
  if (loading.value || noMore.value) return
  loading.value = true
  try {
    const res = await callCloud('getPosts', { page: page.value, pageSize: 15, tag: tagName.value })
    const data = res.data || []
    total.value = res.total || 0
    if (data.length < 15) noMore.value = true
    postList.value = [...postList.value, ...data]
    page.value++
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

function loadMore() { loadPosts() }
function goDetail(id) { uni.navigateTo({ url: `/pages/wall/detail?id=${id}` }) }
</script>

<style scoped>
.topic-page {
  min-height: 100vh;
  background: #F7F6FA;
}

.topic-header {
  background: #FFFFFF;
  padding: 48rpx 32rpx 36rpx;
  border-bottom: 1rpx solid #ECEAF0;
}

.topic-tag {
  font-size: 38rpx;
  font-weight: 700;
  color: #8C61D6;
  display: block;
}

.topic-count {
  font-size: 24rpx;
  color: #A09CAE;
  margin-top: 8rpx;
  display: block;
}

.topic-scroll {
  height: calc(100vh - 160rpx);
  padding: 20rpx 24rpx;
}

.post-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.post-top {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
}

.post-av {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
}

.av-c {
  color: #FFFFFF;
  font-size: 26rpx;
  font-weight: 700;
}

.post-m {
  flex: 1;
}

.pn {
  font-size: 26rpx;
  font-weight: 600;
  color: #3A3030;
  display: block;
}

.pt {
  font-size: 22rpx;
  color: #A09CAE;
  display: block;
}

.post-body {
  font-size: 28rpx;
  color: #3A3030;
  line-height: 1.7;
  margin-bottom: 16rpx;
}

.post-acts {
  display: flex;
  gap: 40rpx;
  font-size: 24rpx;
  color: #A09CAE;
  padding-top: 16rpx;
  border-top: 1rpx solid #ECEAF0;
}

.act-item {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.act-ico {
  font-size: 28rpx;
  color: #A09CAE;
}

.load-tip {
  padding: 40rpx;
  text-align: center;
  font-size: 24rpx;
  color: #A09CAE;
}
</style>
