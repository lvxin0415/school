<template>
  <view class="admin-page">
    <view class="hd" :style="{ paddingTop: barH + 'px' }">
      <text class="hd-title">用户管理</text>
      <!-- Search -->
      <view class="search-row">
        <view class="search-box">
          <text class="ri-search-line search-ico"></text>
          <input v-model="keyword" class="search-input" placeholder="搜索用户名 / 昵称" placeholder-class="ph" @confirm="searchUser" />
        </view>
        <view class="search-btn" @click="searchUser">
          <text class="ri-search-2-line search-btn-ico"></text>
        </view>
      </view>
    </view>

    <scroll-view scroll-y class="user-scroll" @scrolltolower="loadMore">
      <view v-for="u in userList" :key="u._id" class="user-card" @click="goDetail(u._id)">
        <view class="ua-wrap" :style="{ background: u.avatar ? '#EDEAF4' : '#8C61D6' }">
          <image v-if="u.avatar" :src="u.avatar" mode="aspectFill" class="ua-img" />
          <text v-else class="ua-char">{{ (u.nickname || u.username || 'U')[0] }}</text>
        </view>
        <view class="ui-body">
          <view class="ui-top">
            <text class="ui-name">{{ u.nickname || u.username }}</text>
            <view class="ui-badge" :class="u.status === 'banned' ? 'ui-banned' : 'ui-ok'">
              <text>{{ u.status === 'banned' ? '封禁' : '正常' }}</text>
            </view>
          </view>
          <text class="ui-meta">@{{ u.username }} · 积分 {{ u.points || 0 }}</text>
          <text class="ui-date">注册于 {{ u.created_at }}</text>
        </view>
        <text class="ri-arrow-right-s-line ui-arrow"></text>
      </view>

      <view v-if="loading" class="load-tip">
        <text class="ri-loader-4-line load-spin"></text>
        <text class="load-text">加载中…</text>
      </view>
      <view v-if="!loading && !userList.length" class="empty-box">
        <text class="ri-team-line empty-ico"></text>
        <text class="empty-text">暂无用户数据</text>
      </view>
    </scroll-view>

    <!-- Tabbar -->
    <view class="admin-tabbar safe-area-bottom">
      <view class="atb-item" @click="switchPage('/pages/admin/index')">
        <view class="atb-ico-wrap"><text class="ri-dashboard-3-line atb-ico"></text></view>
        <text class="atb-label">概览</text>
      </view>
      <view class="atb-item" @click="switchPage('/pages/admin/content')">
        <view class="atb-ico-wrap"><text class="ri-file-list-3-line atb-ico"></text></view>
        <text class="atb-label">内容</text>
      </view>
      <view class="atb-item" @click="switchPage('/pages/admin/models')">
        <view class="atb-ico-wrap"><text class="ri-box-3-line atb-ico"></text></view>
        <text class="atb-label">模型</text>
      </view>
      <view class="atb-item atb-active">
        <view class="atb-ico-wrap atb-ico-on"><text class="ri-team-line atb-ico"></text></view>
        <text class="atb-label atb-label-on">用户</text>
      </view>
      <view class="atb-item" @click="switchPage('/pages/admin/publish')">
        <view class="atb-ico-wrap"><text class="ri-megaphone-line atb-ico"></text></view>
        <text class="atb-label">发布</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const barH = ref(0)
uni.getSystemInfo({ success: r => { barH.value = r.statusBarHeight || 44 } })

const userList = ref([])
const keyword = ref('')
const loading = ref(false)
const page = ref(1)

onMounted(() => { loadUsers() })

async function loadUsers() {
  loading.value = true
  try {
    const res = await callCloud('admin-get-users', { page: page.value, pageSize: 20, keyword: keyword.value })
    userList.value = page.value === 1 ? (res.data || []) : [...userList.value, ...(res.data || [])]
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

function searchUser() { page.value = 1; loadUsers() }
function loadMore() { page.value++; loadUsers() }
function goDetail(id) { uni.navigateTo({ url: `/pages/admin/userDetail?id=${id}` }) }
function switchPage(url) { uni.redirectTo({ url }) }
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #F4F2F9;
  padding-bottom: 140rpx;
}

/* ── Header ── */
.hd {
  background: linear-gradient(145deg, #7B52C1 0%, #9B6FE0 100%);
  padding: 0 32rpx 28rpx;
}
.hd-title {
  display: block;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 36rpx;
  font-weight: 800;
  color: #FFF;
  letter-spacing: 1rpx;
}

/* ── Search ── */
.search-row {
  display: flex;
  gap: 14rpx;
  margin-top: 4rpx;
}
.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background: rgba(255,255,255,.18);
  border-radius: 100rpx;
  padding: 0 24rpx;
  height: 72rpx;
}
.search-ico { font-size: 28rpx; color: rgba(255,255,255,.55); margin-right: 12rpx; }
.search-input {
  flex: 1;
  font-size: 26rpx;
  color: #FFF;
  height: 72rpx;
}
.ph { color: rgba(255,255,255,.45); }
.search-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: rgba(255,255,255,.22);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.search-btn-ico { font-size: 30rpx; color: #FFF; }

/* ── User List ── */
.user-scroll { padding: 24rpx 32rpx; }
.user-card {
  display: flex;
  align-items: center;
  background: #FFF;
  border-radius: 20rpx;
  padding: 22rpx 24rpx;
  margin-bottom: 14rpx;
  gap: 18rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,.03);
}
.ua-wrap {
  width: 82rpx;
  height: 82rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}
.ua-img { width: 100%; height: 100%; }
.ua-char { color: #FFF; font-size: 30rpx; font-weight: 800; }

.ui-body { flex: 1; min-width: 0; }
.ui-top {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.ui-name {
  font-size: 28rpx;
  font-weight: 700;
  color: #3A3030;
}
.ui-badge {
  font-size: 20rpx;
  font-weight: 600;
  padding: 2rpx 14rpx;
  border-radius: 100rpx;
}
.ui-ok { background: #E8F5EC; color: #4EA07A; }
.ui-banned { background: #FDEAEA; color: #D95555; }
.ui-meta {
  font-size: 22rpx;
  color: #8A849A;
  margin-top: 4rpx;
  display: block;
}
.ui-date {
  font-size: 20rpx;
  color: #C5C0D0;
  display: block;
  margin-top: 2rpx;
}
.ui-arrow { font-size: 26rpx; color: #D2CEE0; flex-shrink: 0; }

/* ── States ── */
.load-tip {
  padding: 60rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}
.load-spin { font-size: 40rpx; color: #8C61D6; }
.load-text { font-size: 24rpx; color: #A09CAE; }
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 160rpx 0;
}
.empty-ico { font-size: 72rpx; color: #D2CEE0; }
.empty-text { font-size: 28rpx; color: #A09CAE; margin-top: 16rpx; }

/* ── Tabbar ── */
.admin-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: #FFF;
  padding: 10rpx 0 6rpx;
  box-shadow: 0 -2rpx 16rpx rgba(0,0,0,.05);
  z-index: 99;
}
.atb-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}
.atb-ico-wrap {
  width: 52rpx;
  height: 52rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.atb-ico-on { background: rgba(140,97,214,.10); }
.atb-ico { font-size: 34rpx; color: #B0ABBC; }
.atb-ico-on .atb-ico { color: #8C61D6; }
.atb-label { font-size: 20rpx; color: #B0ABBC; }
.atb-label-on { color: #8C61D6; font-weight: 700; }
</style>
