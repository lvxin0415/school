<template>
  <view class="pg">
    <!-- ====== Header ====== -->
    <view class="hd" :style="{ paddingTop: barH + 'px' }">
      <view class="nav">
        <view class="nav-left">
          <image src="/static/logo.png" mode="aspectFit" class="nav-logo" />
          <text class="nav-name">逛校园</text>
        </view>
        <view class="nav-right">
          <view class="nav-btn" @click="goSearch">
            <text class="ri-search-line nav-ico"></text>
          </view>
          <view class="nav-btn" @click="goMessage">
            <text class="ri-notification-3-line nav-ico"></text>
            <view v-if="unreadCount > 0" class="red-dot"></view>
          </view>
        </view>
      </view>
      <view class="search-bar" @click="goSearch">
        <text class="ri-search-line search-ico"></text>
        <text class="search-ph">搜索留言、活动、课程...</text>
      </view>
    </view>

    <!-- ====== Body ====== -->
    <scroll-view scroll-y class="bd" @scrolltolower="loadMore">

      <!-- Banner -->
      <view class="banner-wrap">
        <swiper
          class="swiper"
          circular
          autoplay
          :interval="4000"
          indicator-dots
          indicator-color="rgba(140,97,214,0.15)"
          indicator-active-color="#8C61D6"
        >
          <swiper-item v-for="(b, i) in banners" :key="i">
            <view class="slide">
              <image :src="b.img" mode="aspectFill" class="slide-img" />
              <view class="slide-mask"></view>
              <view class="slide-info">
                <text class="slide-tag">{{ b.tag }}</text>
                <text class="slide-title">{{ b.title }}</text>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>

      <!-- Notice -->
      <view class="notice" @click="navTo('/pages/activity/list')">
        <text class="ri-megaphone-line notice-ico"></text>
        <text class="notice-txt">新学期活动报名已开启，快来参加吧</text>
        <text class="ri-arrow-right-s-line notice-arr"></text>
      </view>

      <!-- Grid -->
      <view class="grid-card">
        <view class="grid">
          <view v-for="g in gridItems" :key="g.name" class="gi" @click="navTo(g.url)">
            <view class="gi-circle" :style="{ background: g.bg }">
              <text :class="g.icon" class="gi-ico" :style="{ color: g.color }"></text>
            </view>
            <text class="gi-name">{{ g.name }}</text>
          </view>
        </view>
      </view>

      <!-- Shortcuts -->
      <view class="shortcuts-card">
        <view class="sc-row" @click="navTo('/pages/study/checkin')">
          <view class="sc-left">
            <view class="sc-dot" style="background:#8C61D6"></view>
            <text class="sc-name">今日打卡</text>
          </view>
          <view class="sc-right">
            <text class="sc-desc">坚持每天进步</text>
            <text class="ri-arrow-right-s-line sc-arr"></text>
          </view>
        </view>
        <view class="sc-divider"></view>
        <view class="sc-row" @click="navTo('/pages/study/rank')">
          <view class="sc-left">
            <view class="sc-dot" style="background:#D4A5C0"></view>
            <text class="sc-name">学习排行</text>
          </view>
          <view class="sc-right">
            <text class="sc-desc">看看谁是学霸</text>
            <text class="ri-arrow-right-s-line sc-arr"></text>
          </view>
        </view>
      </view>

      <!-- Feed -->
      <view class="feed-section">
        <view class="feed-header">
          <view class="feed-header-left">
            <view class="feed-accent"></view>
            <text class="feed-title">最新动态</text>
          </view>
          <view class="feed-more" @click="goWall">
            <text class="feed-more-txt">更多</text>
            <text class="ri-arrow-right-s-line feed-more-arr"></text>
          </view>
        </view>

        <view v-for="post in feedList" :key="post._id" class="post-card" @click="goDetail(post._id)">
          <view class="post-top">
            <view class="post-avatar" :style="{ background: post.avatar_color || '#94B8D6' }">
              <text class="avatar-letter">{{ (post.anonymous_name || '匿')[0] }}</text>
            </view>
            <view class="post-meta">
              <text class="post-nick">{{ post.anonymous_name || '匿名用户' }}</text>
              <text class="post-time">{{ formatTime(post.created_at) }}</text>
            </view>
          </view>
          <text class="post-body text-ellipsis-2">{{ post.content }}</text>
          <view v-if="post.images && post.images.length" class="post-images">
            <image
              v-for="(img, idx) in post.images.slice(0, 3)"
              :key="idx"
              :src="img"
              mode="aspectFill"
              class="post-img"
            />
          </view>
          <view v-if="post.tags && post.tags.length" class="post-tags">
            <text v-for="t in post.tags" :key="t" class="post-tag">#{{ t }}</text>
          </view>
          <view class="post-footer">
            <view class="pf-item">
              <text class="ri-heart-3-line pf-ico"></text>
              <text class="pf-num">{{ post.likes || 0 }}</text>
            </view>
            <view class="pf-item">
              <text class="ri-chat-3-line pf-ico"></text>
              <text class="pf-num">{{ post.comment_count || 0 }}</text>
            </view>
            <view class="pf-item">
              <text class="ri-share-forward-line pf-ico"></text>
              <text class="pf-num">分享</text>
            </view>
          </view>
        </view>

        <!-- States -->
        <view v-if="feedLoading" class="state-tip">
          <text class="state-tip-txt">加载中...</text>
        </view>
        <view v-if="noMore && feedList.length > 0" class="state-tip">
          <text class="state-tip-txt">— 已经到底啦 —</text>
        </view>
        <view v-if="!feedLoading && feedList.length === 0" class="state-empty">
          <text class="ri-draft-line empty-ico"></text>
          <text class="empty-title">暂无动态</text>
          <text class="empty-sub">去留言墙发帖吧</text>
        </view>
      </view>

      <view style="height:120rpx"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import { useUserStore } from '@/store/user.js'
import { callCloud } from '@/common/utils/request.js'
import { formatTime } from '@/common/utils/helper.js'

const userStore = useUserStore()
const feedList = ref([])
const feedLoading = ref(false)
const noMore = ref(false)
const pg = ref(1)
const pageSize = 10
const unreadCount = ref(0)
const barH = uni.getSystemInfoSync().statusBarHeight || 44

const banners = ref([
  { img: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80', tag: '校园风光', title: '春日校园 · 花开正盛' },
  { img: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80', tag: '图书馆', title: '知识殿堂 · 静享书香' },
  { img: 'https://images.unsplash.com/photo-1523050854058-8df90110c8f1?w=800&q=80', tag: '毕业季', title: '青春不散场 · 未来可期' }
])

const gridItems = [
  { name: '留言墙',   icon: 'ri-chat-smile-2-line',       color: '#8C61D6', bg: 'rgba(140,97,214,0.1)',  url: '/pages/wall/list' },
  { name: '学习记录', icon: 'ri-book-open-line',           color: '#6BAE8A', bg: 'rgba(107,174,138,0.1)', url: '/pages/study/index' },
  { name: '校园参观', icon: 'ri-building-2-line',          color: '#D4A5C0', bg: 'rgba(212,165,192,0.1)', url: '/pages/campus3d/index' },
  { name: '活动广场', icon: 'ri-flag-2-line',              color: '#E6A84E', bg: 'rgba(230,168,78,0.1)',  url: '/pages/activity/list' },
  { name: '课程表',   icon: 'ri-calendar-schedule-line',   color: '#6399BA', bg: 'rgba(99,153,186,0.1)',  url: '/pages/course/index' },
  { name: '学习统计', icon: 'ri-bar-chart-2-line',         color: '#A882E0', bg: 'rgba(168,130,224,0.1)', url: '/pages/study/stats' },
  { name: '心理健康', icon: 'ri-mental-health-line',        color: '#85C88A', bg: 'rgba(133,200,138,0.1)', url: '/pages/mental/index' },
  { name: '意见反馈', icon: 'ri-feedback-line',             color: '#A09CAE', bg: 'rgba(160,156,174,0.1)', url: '/pages/feedback/index' }
]

onMounted(() => { loadFeed(); loadUnread() })

async function loadUnread() {
  try { const r = await callCloud('get-unread-count', {}); unreadCount.value = (r && r.count) || 0; userStore.unreadCount = unreadCount.value } catch (_) { unreadCount.value = 0 }
}

async function loadFeed() {
  if (feedLoading.value || noMore.value) return
  feedLoading.value = true
  try {
    const r = await callCloud('getPosts', { page: pg.value, pageSize })
    const list = (r && r.data) || []
    if (list.length < pageSize) noMore.value = true
    feedList.value = [...feedList.value, ...list]
    pg.value++
  } catch (_) {} finally { feedLoading.value = false }
}

function loadMore() { loadFeed() }
function navTo(u) { uni.navigateTo({ url: u }) }
function goSearch() { uni.navigateTo({ url: '/pages/search/index' }) }
function goMessage() { uni.switchTab({ url: '/pages/message/message' }) }
function goWall() { uni.navigateTo({ url: '/pages/wall/list' }) }
function goDetail(id) { uni.navigateTo({ url: `/pages/wall/detail?id=${id}` }) }

onPullDownRefresh(() => {
  pg.value = 1; noMore.value = false; feedList.value = []
  Promise.all([loadFeed(), loadUnread()]).finally(() => uni.stopPullDownRefresh())
})
</script>

<style scoped>
.pg {
  min-height: 100vh;
  background: #F7F6FA;
}

/* ========== Header ========== */
.hd {
  background: linear-gradient(180deg, #E2D9F3 0%, #EFEAFC 50%, #F7F6FA 100%);
  padding: 0 32rpx 32rpx;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 88rpx;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.nav-logo {
  width: 40rpx;
  height: 40rpx;
  border-radius: 10rpx;
}

.nav-name {
  font-size: 34rpx;
  font-weight: 700;
  color: #3A3030;
  letter-spacing: 2rpx;
}

.nav-right {
  display: flex;
  gap: 16rpx;
}

.nav-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(140, 97, 214, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.nav-ico {
  font-size: 36rpx;
  color: #6B47B8;
}

.red-dot {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #E06B6B;
  border: 2rpx solid #FFF;
}

/* Search bar */
.search-bar {
  display: flex;
  align-items: center;
  gap: 14rpx;
  height: 72rpx;
  padding: 0 28rpx;
  background: #FFF;
  border-radius: 36rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  margin-top: 8rpx;
}

.search-ico {
  font-size: 30rpx;
  color: #A09CAE;
}

.search-ph {
  font-size: 26rpx;
  color: #A09CAE;
}

/* ========== Scrollable body ========== */
.bd {
  padding: 0 0 40rpx;
}

/* Banner */
.banner-wrap {
  padding: 20rpx 32rpx 0;
}

.swiper {
  height: 320rpx;
  border-radius: 20rpx;
  overflow: hidden;
}

.slide {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 20rpx;
  overflow: hidden;
}

.slide-img {
  width: 100%;
  height: 100%;
}

.slide-mask {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(30, 25, 50, 0.5) 100%);
}

.slide-info {
  position: absolute;
  bottom: 24rpx;
  left: 24rpx;
  right: 24rpx;
}

.slide-tag {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  background: rgba(140, 97, 214, 0.8);
  color: #FFF;
  font-size: 22rpx;
  font-weight: 600;
  margin-bottom: 8rpx;
}

.slide-title {
  display: block;
  color: #FFF;
  font-size: 30rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
  text-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.25);
}

/* Notice */
.notice {
  margin: 20rpx 32rpx 0;
  padding: 22rpx 24rpx;
  background: #FFF;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.notice-ico {
  font-size: 32rpx;
  color: #8C61D6;
  flex-shrink: 0;
}

.notice-txt {
  flex: 1;
  font-size: 24rpx;
  color: #3A3030;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.notice-arr {
  font-size: 28rpx;
  color: #A09CAE;
}

/* Grid card */
.grid-card {
  margin: 20rpx 32rpx 0;
  padding: 28rpx 0 8rpx;
  background: #FFF;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.grid {
  display: flex;
  flex-wrap: wrap;
}

.gi {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24rpx;
}

.gi-circle {
  width: 88rpx;
  height: 88rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rpx;
}

.gi-ico {
  font-size: 38rpx;
}

.gi-name {
  font-size: 24rpx;
  color: #3A3030;
}

/* Shortcuts */
.shortcuts-card {
  margin: 20rpx 32rpx 0;
  padding: 0 28rpx;
  background: #FFF;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.sc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx 0;
}

.sc-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.sc-dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 50%;
}

.sc-name {
  font-size: 28rpx;
  color: #3A3030;
  font-weight: 600;
}

.sc-right {
  display: flex;
  align-items: center;
  gap: 4rpx;
}

.sc-desc {
  font-size: 24rpx;
  color: #A09CAE;
}

.sc-arr {
  font-size: 28rpx;
  color: #A09CAE;
}

.sc-divider {
  height: 1rpx;
  background: #ECEAF0;
}

/* ========== Feed ========== */
.feed-section {
  padding: 28rpx 32rpx 0;
}

.feed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.feed-header-left {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.feed-accent {
  width: 6rpx;
  height: 30rpx;
  border-radius: 3rpx;
  background: #8C61D6;
}

.feed-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #3A3030;
}

.feed-more {
  display: flex;
  align-items: center;
}

.feed-more-txt {
  font-size: 24rpx;
  color: #8C61D6;
}

.feed-more-arr {
  font-size: 24rpx;
  color: #8C61D6;
}

/* Post card */
.post-card {
  background: #FFF;
  border-radius: 20rpx;
  padding: 28rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);
}

.post-top {
  display: flex;
  align-items: center;
  margin-bottom: 18rpx;
}

.post-avatar {
  width: 68rpx;
  height: 68rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.avatar-letter {
  color: #FFF;
  font-size: 26rpx;
  font-weight: 700;
}

.post-meta {
  flex: 1;
}

.post-nick {
  font-size: 28rpx;
  font-weight: 600;
  color: #3A3030;
  display: block;
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
  line-height: 1.7;
  margin-bottom: 16rpx;
}

.post-images {
  display: flex;
  gap: 10rpx;
  margin-bottom: 16rpx;
}

.post-img {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
}

.post-tags {
  display: flex;
  gap: 10rpx;
  flex-wrap: wrap;
  margin-bottom: 14rpx;
}

.post-tag {
  font-size: 22rpx;
  color: #8C61D6;
  background: rgba(140, 97, 214, 0.06);
  padding: 6rpx 16rpx;
  border-radius: 100rpx;
}

.post-footer {
  display: flex;
  padding-top: 16rpx;
  border-top: 1rpx solid #ECEAF0;
}

.pf-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
}

.pf-ico {
  font-size: 28rpx;
  color: #A09CAE;
}

.pf-num {
  font-size: 24rpx;
  color: #A09CAE;
}

/* States */
.state-tip {
  padding: 36rpx;
  text-align: center;
}

.state-tip-txt {
  font-size: 24rpx;
  color: #A09CAE;
}

.state-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 0;
  gap: 14rpx;
}

.empty-ico {
  font-size: 80rpx;
  color: #BBA2CA;
}

.empty-title {
  font-size: 30rpx;
  color: #747288;
  font-weight: 600;
}

.empty-sub {
  font-size: 24rpx;
  color: #A09CAE;
}
</style>
