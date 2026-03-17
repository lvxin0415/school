<template>
  <view class="search-page">
    <view class="search-header">
      <view class="search-bar">
        <text class="ri-search-line search-ico"></text>
        <input
          v-model="keyword"
          class="search-input"
          :focus="true"
          placeholder="搜索帖子、活动..."
          placeholder-class="search-placeholder"
          confirm-type="search"
          @confirm="doSearch"
        />
        <view v-if="keyword" class="clear-btn" @click="keyword = ''">
          <text class="ri-close-line clear-ico"></text>
        </view>
      </view>
    </view>

    <view v-if="!searched" class="hot-section">
      <text class="sec-title">热门搜索</text>
      <view class="hot-tags">
        <view v-for="tag in hotTags" :key="tag" class="hot-tag" @click="keyword = tag; doSearch()">
          <text class="tag-text">{{ tag }}</text>
        </view>
      </view>
    </view>

    <view v-if="searched" class="result-section">
      <view class="result-header">
        <text class="sec-title">搜索结果</text>
        <text class="result-count">{{ results.length }} 条</text>
      </view>

      <view v-for="item in results" :key="item._id" class="result-card" @click="goDetail(item._id)">
        <text class="result-content text-ellipsis-2">{{ item.content }}</text>
        <view class="result-bottom">
          <text class="result-time">{{ item.created_at }}</text>
          <view class="result-stats">
            <text class="ri-heart-3-line stat-ico"></text>
            <text class="stat-n">{{ item.likes || 0 }}</text>
          </view>
        </view>
      </view>

      <view v-if="!results.length" class="empty-box">
        <text class="ri-search-line empty-ico"></text>
        <text class="empty-t">未找到相关内容</text>
        <text class="empty-d">换个关键词试试吧</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const keyword = ref('')
const searched = ref(false)
const results = ref([])
const hotTags = ref(['校园美食', '学习打卡', '社团活动', '考研交流', '兼职信息', '失物招领'])

async function doSearch() {
  if (!keyword.value.trim()) return
  searched.value = true
  try {
    const res = await callCloud('search-posts', { keyword: keyword.value })
    results.value = res.data || []
  } catch (e) { console.error(e) }
}

function goDetail(id) { uni.navigateTo({ url: `/pages/wall/detail?id=${id}` }) }
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  background: #F7F6FA;
}

.search-header {
  padding: 20rpx 28rpx;
  background: #FFFFFF;
  border-bottom: 1rpx solid #ECEAF0;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  height: 80rpx;
  background: #F7F6FA;
  border-radius: 16rpx;
  gap: 12rpx;
}

.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #3A3030;
}

.search-placeholder {
  color: #A09CAE;
}

.clear-btn {
  width: 40rpx;
  height: 40rpx;
  background: #ECEAF0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hot-section {
  padding: 32rpx 28rpx;
}

.sec-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #3A3030;
  display: block;
  margin-bottom: 24rpx;
}

.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.hot-tag {
  padding: 14rpx 32rpx;
  background: #FFFFFF;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  border: 1rpx solid #ECEAF0;
}

.tag-text {
  font-size: 26rpx;
  color: #6B47B8;
}

.result-section {
  padding: 28rpx;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.result-count {
  font-size: 24rpx;
  color: #A09CAE;
}

.result-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  padding: 24rpx 28rpx;
}

.result-content {
  font-size: 28rpx;
  color: #3A3030;
  line-height: 1.7;
  display: block;
}

.result-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 18rpx;
  padding-top: 14rpx;
  border-top: 1rpx solid #ECEAF0;
}

.result-time {
  font-size: 22rpx;
  color: #A09CAE;
}

.result-stats {
  display: flex;
  align-items: center;
  gap: 6rpx;
}

.stat-n {
  font-size: 22rpx;
  color: #8C61D6;
}

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
  gap: 12rpx;
}

.empty-t {
  font-size: 30rpx;
  color: #747288;
  font-weight: 600;
}

.empty-d {
  font-size: 24rpx;
  color: #A09CAE;
}

.search-ico {
  font-size: 36rpx;
  color: #A09CAE;
}

.clear-ico {
  font-size: 26rpx;
  color: #747288;
}

.stat-ico {
  font-size: 28rpx;
  color: #8C61D6;
}

.empty-ico {
  font-size: 64rpx;
  color: #A09CAE;
}
</style>
