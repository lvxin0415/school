<template>
  <view class="activity-page">
    <view class="page-header">
      <text class="header-title">活动广场</text>
      <text class="header-sub">发现校园精彩活动</text>
    </view>

    <scroll-view scroll-y class="act-scroll" @scrolltolower="loadMore">
      <view class="card-list">
        <view v-for="item in list" :key="item._id" class="act-card" @click="goDetail(item._id)">
          <view class="cover-wrap">
            <image :src="item.cover_url || '/static/act-default.png'" mode="aspectFill" class="act-cover" />
            <view v-if="item.is_top" class="pin-badge">
              <text class="pin-text">置顶</text>
            </view>
          </view>
          <view class="act-info">
            <text class="act-title text-ellipsis">{{ item.title }}</text>
            <view class="meta-row">
              <view class="meta-item">
                <text class="ri-map-pin-2-line meta-ico"></text>
                <text class="meta-text">{{ item.location || '线上' }}</text>
              </view>
              <view class="meta-item">
                <text class="ri-calendar-line meta-ico"></text>
                <text class="meta-text">{{ item.start_time }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view v-if="loading" class="load-tip">
        <text class="load-text">加载中...</text>
      </view>
      <view v-if="noMore && list.length" class="load-tip">
        <text class="load-text">没有更多了</text>
      </view>
      <view v-if="!loading && !list.length" class="empty-box">
        <text class="ri-flag-2-line empty-ico"></text>
        <text class="empty-t">暂无活动</text>
        <text class="empty-d">活动即将上线，敬请期待</text>
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
const pageSize = 15

onMounted(() => { loadData() })

async function loadData() {
  if (loading.value || noMore.value) return
  loading.value = true
  try {
    const res = await callCloud('get-activities', { page: page.value, pageSize })
    const data = res.data || []
    if (data.length < pageSize) noMore.value = true
    list.value = [...list.value, ...data]
    page.value++
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

function loadMore() { loadData() }
function goDetail(id) { uni.navigateTo({ url: `/pages/activity/detail?id=${id}` }) }
</script>

<style scoped>
.activity-page {
  min-height: 100vh;
  background: #F7F6FA;
}

.page-header {
  padding: 60rpx 36rpx 40rpx;
  background: #FFFFFF;
  border-bottom: 1rpx solid #ECEAF0;
}

.header-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #3A3030;
  display: block;
}

.header-sub {
  font-size: 24rpx;
  color: #A09CAE;
  display: block;
  margin-top: 8rpx;
}

.act-scroll {
  height: calc(100vh - 180rpx);
}

.card-list {
  padding: 24rpx 28rpx 20rpx;
}

.act-card {
  background: #FFFFFF;
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.cover-wrap {
  position: relative;
  overflow: hidden;
}

.act-cover {
  width: 100%;
  height: 300rpx;
  display: block;
}

.pin-badge {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  background: #8C61D6;
  padding: 8rpx 20rpx;
  border-radius: 16rpx;
}

.pin-text {
  font-size: 22rpx;
  color: #FFFFFF;
  font-weight: 600;
}

.act-info {
  padding: 24rpx 28rpx 28rpx;
}

.act-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #3A3030;
  display: block;
  margin-bottom: 18rpx;
  line-height: 1.4;
}

.meta-row {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.meta-ico {
  font-size: 26rpx;
  color: #8C61D6;
}

.meta-text {
  font-size: 24rpx;
  color: #747288;
}

.load-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.load-text {
  font-size: 24rpx;
  color: #A09CAE;
}

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0;
  gap: 12rpx;
}

.empty-ico {
  font-size: 64rpx;
  color: #A09CAE;
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
</style>
