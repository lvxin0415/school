<template>
  <view class="pg">
    <view class="status-bar" :style="{ height: barH + 'px' }"></view>

    <view class="header">
      <view class="header-left">
        <text class="header-title">消息</text>
        <view v-if="totalUnread > 0" class="unread-badge">
          <text class="unread-badge-text">{{ totalUnread > 99 ? '99+' : totalUnread }}</text>
        </view>
      </view>
      <view v-if="list.length > 0" class="read-all-btn" @click="markAllRead">
        <text class="ri-check-double-line read-all-ico"></text>
        <text class="read-all-text">全部已读</text>
      </view>
    </view>

    <scroll-view scroll-x class="tabs-scroll" :show-scrollbar="false">
      <view class="tabs-row">
        <view
          v-for="cat in cats"
          :key="cat.key"
          class="tab-pill"
          :class="{ 'tab-active': curTab === cat.key }"
          :style="curTab === cat.key ? { background: cat.activeBg, color: cat.color } : {}"
          @click="switchTab(cat.key)"
        >
          <text
            :class="curTab === cat.key ? cat.fillIcon : cat.icon"
            class="tab-ico"
            :style="{ color: curTab === cat.key ? cat.color : '#A09CAE' }"
          ></text>
          <text class="tab-label" :style="{ color: curTab === cat.key ? cat.color : '#747288' }">{{ cat.label }}</text>
          <view v-if="getTabCount(cat.key) > 0" class="tab-dot">
            <text class="tab-dot-text">{{ getTabCount(cat.key) }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <scroll-view scroll-y class="msg-scroll" @scrolltolower="loadMore">
      <view
        v-for="item in filtered"
        :key="item._id"
        class="msg-card"
        :class="{ 'msg-unread': !item.read }"
        @click="handleClick(item)"
      >
        <view class="msg-icon-box" :style="{ background: getBg(item.type) }">
          <text :class="getIcon(item.type)" class="msg-icon" :style="{ color: getColor(item.type) }"></text>
        </view>
        <view class="msg-body">
          <view class="msg-head">
            <text class="msg-label">{{ getLabel(item.type) }}</text>
            <text class="msg-time">{{ shortTime(item.created_at) }}</text>
          </view>
          <text class="msg-content">{{ item.content }}</text>
        </view>
        <view v-if="!item.read" class="msg-dot"></view>
      </view>

      <view v-if="loading" class="state-box">
        <text class="ri-loader-4-line state-spinner"></text>
        <text class="state-text">加载中...</text>
      </view>

      <view v-if="noMore && list.length > 0" class="state-box">
        <view class="divider"></view>
        <text class="state-text">没有更多了</text>
        <view class="divider"></view>
      </view>

      <view v-if="!loading && filtered.length === 0" class="empty-box">
        <view class="empty-icon-wrap">
          <text class="ri-mail-open-line empty-icon"></text>
        </view>
        <text class="empty-title">{{ curTab === 'all' ? '暂无消息' : '暂无' + curCat.label + '消息' }}</text>
        <text class="empty-desc">新消息到达时会第一时间通知你</text>
      </view>

      <view style="height: 140rpx"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user.js'
import { callCloud } from '@/common/utils/request.js'

const userStore = useUserStore()
const list = ref([])
const loading = ref(false)
const noMore = ref(false)
const page = ref(1)
const curTab = ref('all')
const barH = uni.getSystemInfoSync().statusBarHeight || 44

const cats = [
  { key: 'all',      label: '全部', icon: 'ri-apps-line',           fillIcon: 'ri-apps-fill',           color: '#8C61D6', bg: 'rgba(140,97,214,0.08)', activeBg: 'rgba(140,97,214,0.15)' },
  { key: 'like',     label: '点赞', icon: 'ri-heart-3-line',        fillIcon: 'ri-heart-3-fill',        color: '#E06B6B', bg: 'rgba(224,107,107,0.08)', activeBg: 'rgba(224,107,107,0.15)' },
  { key: 'comment',  label: '评论', icon: 'ri-chat-3-line',         fillIcon: 'ri-chat-3-fill',         color: '#6BAE8A', bg: 'rgba(107,174,138,0.08)', activeBg: 'rgba(107,174,138,0.15)' },
  { key: 'system',   label: '系统', icon: 'ri-notification-3-line', fillIcon: 'ri-notification-3-fill', color: '#6B47B8', bg: 'rgba(107,71,184,0.08)',  activeBg: 'rgba(107,71,184,0.15)' },
  { key: 'activity', label: '活动', icon: 'ri-flag-2-line',         fillIcon: 'ri-flag-2-fill',         color: '#E6A84E', bg: 'rgba(230,168,78,0.08)',  activeBg: 'rgba(230,168,78,0.15)' }
]

const curCat = computed(() => cats.find(c => c.key === curTab.value) || cats[0])

const filtered = computed(() =>
  curTab.value === 'all' ? list.value : list.value.filter(m => m.type === curTab.value)
)

const totalUnread = computed(() => list.value.filter(m => !m.read).length)

function shortTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

function getTabCount(type) {
  if (type === 'all') return totalUnread.value
  return list.value.filter(m => m.type === type && !m.read).length
}

function switchTab(key) { curTab.value = key }

const iconMap  = { like: 'ri-heart-3-fill', comment: 'ri-chat-3-fill', system: 'ri-notification-3-fill', points: 'ri-copper-coin-fill', activity: 'ri-flag-2-fill' }
const colorMap = { like: '#E06B6B', comment: '#6BAE8A', system: '#6B47B8', points: '#E6A84E', activity: '#E6A84E' }
const bgMap    = { like: 'rgba(224,107,107,0.1)', comment: 'rgba(107,174,138,0.1)', system: 'rgba(107,71,184,0.1)', points: 'rgba(230,168,78,0.1)', activity: 'rgba(230,168,78,0.1)' }
const labelMap = { like: '收到点赞', comment: '收到评论', system: '系统通知', points: '积分变动', activity: '活动通知' }

function getIcon(t)  { return iconMap[t] || 'ri-information-fill' }
function getColor(t) { return colorMap[t] || '#8E8AA0' }
function getBg(t)    { return bgMap[t] || 'rgba(142,138,160,0.1)' }
function getLabel(t) { return labelMap[t] || '通知' }

onMounted(() => { loadMessages() })

async function loadMessages() {
  if (loading.value || noMore.value) return
  loading.value = true
  try {
    const res = await callCloud('get-notifications', { page: page.value, pageSize: 20 })
    const data = (res && res.data) || []
    if (data.length < 20) noMore.value = true
    list.value = [...list.value, ...data]
    page.value++
    userStore.unreadCount = list.value.filter(m => !m.read).length
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function loadMore() { loadMessages() }

async function markAllRead() {
  try {
    await callCloud('mark-all-read', {})
    list.value.forEach(item => { item.read = true })
    userStore.unreadCount = 0
    uni.showToast({ title: '已全部已读', icon: 'success' })
  } catch (e) { console.error(e) }
}

function handleClick(item) {
  if (!item.read) {
    item.read = true
    userStore.unreadCount = Math.max(0, userStore.unreadCount - 1)
    callCloud('mark-read', { id: item._id }).catch(() => {})
  }
  if (item.type === 'like' || item.type === 'comment') {
    uni.navigateTo({ url: `/pages/wall/detail?id=${item.post_id}` })
  } else if (item.type === 'activity') {
    uni.navigateTo({ url: `/pages/activity/detail?id=${item.activity_id}` })
  }
}
</script>

<style scoped>
.pg {
  min-height: 100vh;
  background: #F7F6FA;
}

.status-bar {
  background: transparent;
}

/* ---- Header ---- */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 40rpx 24rpx;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.header-title {
  font-size: 48rpx;
  font-weight: 800;
  color: #3A3030;
  letter-spacing: 1rpx;
}

.unread-badge {
  background: #E06B6B;
  border-radius: 20rpx;
  padding: 2rpx 14rpx;
  min-width: 36rpx;
  text-align: center;
}

.unread-badge-text {
  font-size: 22rpx;
  color: #FFF;
  font-weight: 700;
}

.read-all-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 12rpx 24rpx;
  border-radius: 100rpx;
  background: rgba(140, 97, 214, 0.07);
}

.read-all-ico {
  font-size: 28rpx;
  color: #8C61D6;
}

.read-all-text {
  font-size: 24rpx;
  color: #8C61D6;
  font-weight: 500;
}

/* ---- Tabs ---- */
.tabs-scroll {
  white-space: nowrap;
  padding-bottom: 4rpx;
}

.tabs-row {
  display: flex;
  gap: 16rpx;
  padding: 0 40rpx 28rpx;
}

.tab-pill {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 14rpx 28rpx;
  border-radius: 100rpx;
  background: #FFF;
  border: 1rpx solid #ECEAF0;
  position: relative;
  transition: all 0.2s ease;
}

.tab-active {
  border-color: transparent;
}

.tab-ico {
  font-size: 28rpx;
}

.tab-label {
  font-size: 24rpx;
  font-weight: 600;
}

.tab-dot {
  position: absolute;
  top: -8rpx;
  right: -4rpx;
  background: #E06B6B;
  border-radius: 16rpx;
  padding: 0 10rpx;
  min-width: 28rpx;
  height: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-dot-text {
  font-size: 18rpx;
  color: #FFF;
  font-weight: 700;
}

/* ---- Message list ---- */
.msg-scroll {
  flex: 1;
  padding: 0 32rpx;
}

.msg-card {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 24rpx;
  background: #FFF;
  border-radius: 20rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  transition: background 0.2s;
}

.msg-unread {
  background: #FEFEFE;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.06);
}

.msg-icon-box {
  width: 80rpx;
  height: 80rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.msg-icon {
  font-size: 36rpx;
}

.msg-body {
  flex: 1;
  min-width: 0;
}

.msg-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.msg-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #3A3030;
}

.msg-time {
  font-size: 22rpx;
  color: #A09CAE;
  flex-shrink: 0;
}

.msg-content {
  font-size: 26rpx;
  color: #747288;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.msg-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: #E06B6B;
  flex-shrink: 0;
}

/* ---- Loading / state ---- */
.state-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  padding: 48rpx 0;
}

.state-spinner {
  font-size: 32rpx;
  color: #BBA2CA;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.state-text {
  font-size: 24rpx;
  color: #A09CAE;
}

.divider {
  width: 48rpx;
  height: 1rpx;
  background: #ECEAF0;
}

/* ---- Empty state ---- */
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0 80rpx;
}

.empty-icon-wrap {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(140, 97, 214, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}

.empty-icon {
  font-size: 56rpx;
  color: #BBA2CA;
}

.empty-title {
  font-size: 30rpx;
  color: #3A3030;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.empty-desc {
  font-size: 24rpx;
  color: #A09CAE;
}
</style>
