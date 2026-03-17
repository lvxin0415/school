<template>
  <view class="wall-page">
    <!-- Tab 切换栏 -->
    <view class="tab-bar">
      <view class="tab-bar-inner">
        <view class="tab-bg-pill" :style="{ transform: currentTab === 'hot' ? 'translateX(100%)' : 'translateX(0)' }"></view>
        <view
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-item"
          :class="{ active: currentTab === tab.key }"
          @click="switchTab(tab.key)"
        >
          <text class="tab-text">{{ tab.name }}</text>
        </view>
      </view>
    </view>

    <!-- 帖子列表 -->
    <scroll-view scroll-y class="post-scroll" @scrolltolower="loadMore">
      <view
        v-for="post in postList"
        :key="post._id"
        class="post-card"
        @click="goDetail(post._id)"
      >
        <view class="post-header">
          <view class="post-avatar" :style="{ background: post.avatar_color || '#8C61D6' }">
            <text class="av-char">{{ (post.anonymous_name || '匿')[0] }}</text>
          </view>
          <view class="post-meta">
            <text class="post-name">{{ post.anonymous_name || '匿名用户' }}</text>
            <text class="post-time">{{ formatTime(post.created_at) }}</text>
          </view>
        </view>

        <text class="post-body text-ellipsis-2">{{ post.content }}</text>

        <view v-if="post.images && post.images.length" class="post-imgs">
          <image
            v-for="(img, i) in post.images.slice(0, 3)"
            :key="i"
            :src="img"
            mode="aspectFill"
            class="p-img"
          />
          <view v-if="post.images.length > 3" class="img-more">
            <text class="img-more-num">+{{ post.images.length - 3 }}</text>
          </view>
        </view>

        <view v-if="post.tags && post.tags.length" class="post-tags">
          <view v-for="tag in post.tags" :key="tag" class="tag-pill" @click.stop="goTopic(tag)">
            <text class="tag-hash">#</text>
            <text class="tag-name">{{ tag }}</text>
          </view>
        </view>

        <view class="post-actions">
          <view class="action-btn" @click.stop="likePost(post)">
            <text
              :class="post.isLiked ? 'ri-heart-fill' : 'ri-heart-line'"
              class="action-icon"
              :style="{ color: post.isLiked ? '#E06B6B' : '#A09CAE' }"
            ></text>
            <text class="action-num" :class="{ liked: post.isLiked }">{{ post.likes || 0 }}</text>
          </view>
          <view class="action-btn">
            <text class="ri-chat-3-line action-icon"></text>
            <text class="action-num">{{ post.comment_count || 0 }}</text>
          </view>
        </view>
      </view>

      <view v-if="loading" class="load-tip">
        <text class="load-text">加载中...</text>
      </view>

      <view v-if="noMore && postList.length" class="load-tip">
        <view class="divider-line"></view>
        <text class="load-text">已经到底啦</text>
        <view class="divider-line"></view>
      </view>

      <view v-if="!loading && !postList.length" class="empty-box">
        <view class="empty-icon-wrap">
          <text class="ri-edit-line empty-icon"></text>
        </view>
        <text class="empty-title">这里空空如也</text>
        <text class="empty-sub">快来发布第一条帖子吧~</text>
      </view>

      <view style="height: 180rpx;"></view>
    </scroll-view>

    <!-- FAB 发布按钮 -->
    <view class="fab-wrap" @click="goPublish">
      <view class="fab-btn">
        <text class="ri-add-line fab-icon"></text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'
import { formatTime } from '@/common/utils/helper.js'

const tabs = [{ key: 'latest', name: '最新' }, { key: 'hot', name: '热门' }]
const currentTab = ref('latest')
const postList = ref([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)

onMounted(() => { loadPosts() })

function switchTab(key) {
  if (currentTab.value === key) return
  currentTab.value = key
  page.value = 1; noMore.value = false; postList.value = []
  loadPosts()
}

async function loadPosts() {
  if (loading.value || noMore.value) return
  loading.value = true
  try {
    const res = await callCloud('getPosts', { page: page.value, pageSize: 15, sort: currentTab.value })
    const data = res.data || []
    if (data.length < 15) noMore.value = true
    postList.value = [...postList.value, ...data]
    page.value++
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

function loadMore() { loadPosts() }

async function likePost(post) {
  try {
    const res = await callCloud('likePost', { postId: post._id })
    post.isLiked = !post.isLiked
    post.likes = res.likes
  } catch (e) { console.error(e) }
}

function goDetail(id) { uni.navigateTo({ url: `/pages/wall/detail?id=${id}` }) }
function goPublish() { uni.navigateTo({ url: '/pages/wall/publish' }) }
function goTopic(tag) { uni.navigateTo({ url: `/pages/wall/topic?tag=${encodeURIComponent(tag)}` }) }
</script>

<style scoped>
.wall-page {
  min-height: 100vh;
  background: #F7F6FA;
}

.tab-bar {
  background: #FFFFFF;
  padding: 20rpx 32rpx;
}
.tab-bar-inner {
  display: flex;
  position: relative;
  background: #F7F6FA;
  border-radius: 99rpx;
  padding: 6rpx;
}
.tab-bg-pill {
  position: absolute;
  top: 6rpx;
  left: 6rpx;
  width: calc(50% - 6rpx);
  height: calc(100% - 12rpx);
  border-radius: 99rpx;
  background: #8C61D6;
  transition: transform 0.2s ease;
  z-index: 1;
}
.tab-item {
  flex: 1;
  padding: 18rpx 0;
  text-align: center;
  position: relative;
  z-index: 2;
}
.tab-text {
  font-size: 28rpx;
  color: #747288;
  font-weight: 500;
  transition: color 0.2s;
}
.tab-item.active .tab-text {
  color: #FFFFFF;
  font-weight: 700;
}

.post-scroll {
  height: calc(100vh - 100rpx);
  padding: 20rpx 28rpx 0;
}

.post-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
  padding: 28rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
  border: 1rpx solid #ECEAF0;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}
.post-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 18rpx;
  flex-shrink: 0;
}
.av-char {
  color: #FFFFFF;
  font-size: 28rpx;
  font-weight: 700;
}
.post-meta {
  flex: 1;
  overflow: hidden;
}
.post-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #3A3030;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.post-time {
  font-size: 22rpx;
  color: #A09CAE;
  display: block;
  margin-top: 4rpx;
}

.post-body {
  font-size: 28rpx;
  color: #3A3030;
  line-height: 1.75;
  margin-bottom: 16rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.post-imgs {
  display: flex;
  gap: 12rpx;
  margin-bottom: 16rpx;
}
.p-img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 16rpx;
  flex-shrink: 0;
}
.img-more {
  width: 200rpx;
  height: 200rpx;
  border-radius: 16rpx;
  background: #F7F6FA;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1rpx dashed #ECEAF0;
}
.img-more-num {
  font-size: 34rpx;
  color: #8C61D6;
  font-weight: 700;
}

.post-tags {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
  margin-bottom: 16rpx;
}
.tag-pill {
  display: flex;
  align-items: center;
  padding: 6rpx 20rpx;
  border-radius: 99rpx;
  background: rgba(140,97,214,0.06);
  border: 1rpx solid rgba(140,97,214,0.1);
}
.tag-hash {
  font-size: 24rpx;
  color: #8C61D6;
  font-weight: 700;
  margin-right: 2rpx;
}
.tag-name {
  font-size: 24rpx;
  color: #8C61D6;
}

.post-actions {
  display: flex;
  gap: 48rpx;
  padding-top: 16rpx;
  border-top: 1rpx solid #ECEAF0;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.action-icon {
  font-size: 36rpx;
  color: #A09CAE;
}
.action-num {
  font-size: 24rpx;
  color: #A09CAE;
}
.action-num.liked {
  color: #E06B6B;
}

.load-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 48rpx 0;
}
.divider-line {
  width: 56rpx;
  height: 1rpx;
  background: #ECEAF0;
}
.load-text {
  font-size: 24rpx;
  color: #A09CAE;
}

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 200rpx 0 100rpx;
}
.empty-icon-wrap {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(140,97,214,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}
.empty-icon {
  font-size: 52rpx;
  color: #A882E0;
}
.empty-title {
  font-size: 30rpx;
  color: #3A3030;
  font-weight: 600;
  margin-bottom: 8rpx;
}
.empty-sub {
  font-size: 26rpx;
  color: #A09CAE;
}

.fab-wrap {
  position: fixed;
  right: 40rpx;
  bottom: 180rpx;
  z-index: 100;
}
.fab-btn {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: #8C61D6;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(140,97,214,0.35);
}
.fab-icon {
  font-size: 56rpx;
  color: #FFFFFF;
}
</style>
