<template>
  <view class="admin-page">
    <view class="hd" :style="{ paddingTop: barH + 'px' }">
      <text class="hd-title">内容管理</text>
    </view>

    <!-- Tabs -->
    <view class="tabs-wrap">
      <view class="tab-pill" :class="{ active: tab === 'pending' }" @click="switchTab('pending')">
        <text>待审核</text>
        <view v-if="pendingCount > 0" class="tab-badge">{{ pendingCount }}</view>
      </view>
      <view class="tab-pill" :class="{ active: tab === 'approved' }" @click="switchTab('approved')">
        <text>已通过</text>
      </view>
      <view class="tab-pill" :class="{ active: tab === 'reported' }" @click="switchTab('reported')">
        <text>举报</text>
      </view>
    </view>

    <scroll-view scroll-y class="content-scroll" @scrolltolower="loadMore">
      <!-- Batch Bar -->
      <view v-if="tab === 'pending' && list.length" class="batch-bar">
        <view class="batch-check" @click="toggleSelectAll">
          <text :class="[selectedAll ? 'ri-checkbox-circle-fill' : 'ri-circle-line', 'ck-ico', { 'ck-active': selectedAll }]"></text>
          <text class="batch-text">全选</text>
        </view>
        <view class="batch-actions">
          <view class="ba-btn ba-pass" @click="batchAction('approved')">
            <text class="ri-check-line ba-ico"></text><text>批量通过</text>
          </view>
          <view class="ba-btn ba-deny" @click="batchAction('rejected')">
            <text class="ri-close-line ba-ico"></text><text>批量拒绝</text>
          </view>
        </view>
      </view>

      <!-- Post Cards -->
      <view v-for="post in list" :key="post._id" class="post-card">
        <view v-if="tab === 'pending'" class="post-check" @click="toggleSelect(post)">
          <text :class="[post.selected ? 'ri-checkbox-circle-fill' : 'ri-circle-line', 'ck-ico', { 'ck-active': post.selected }]"></text>
        </view>
        <view class="post-body">
          <text class="post-content text-ellipsis-2">{{ post.content }}</text>
          <view v-if="post.images && post.images.length" class="post-imgs">
            <image v-for="(img, i) in post.images.slice(0, 3)" :key="i" :src="img" mode="aspectFill" class="pi" />
          </view>
          <text class="post-time">{{ post.created_at }}</text>
        </view>
        <view class="post-ops">
          <template v-if="tab === 'pending'">
            <view class="op-btn op-pass" @click="reviewPost(post._id, 'approved')"><text class="ri-check-line op-ico"></text></view>
            <view class="op-btn op-deny" @click="reviewPost(post._id, 'rejected')"><text class="ri-close-line op-ico"></text></view>
          </template>
          <template v-if="tab === 'approved'">
            <view class="op-btn op-del" @click="deletePost(post._id)"><text class="ri-delete-bin-6-line op-ico"></text></view>
          </template>
          <template v-if="tab === 'reported'">
            <view class="op-btn op-pass" @click="keepPost(post._id)"><text class="ri-shield-check-line op-ico"></text></view>
            <view class="op-btn op-del" @click="deletePost(post._id)"><text class="ri-delete-bin-6-line op-ico"></text></view>
          </template>
        </view>
      </view>

      <view v-if="loading" class="load-tip"><text class="ri-loader-4-line load-spin"></text><text class="load-text">加载中…</text></view>
      <view v-if="!loading && !list.length" class="empty-box">
        <text class="ri-inbox-unarchive-line empty-ico"></text>
        <text class="empty-text">暂无数据</text>
      </view>
    </scroll-view>

    <!-- Tabbar -->
    <view class="admin-tabbar safe-area-bottom">
      <view class="atb-item" @click="switchPage('/pages/admin/index')">
        <view class="atb-ico-wrap"><text class="ri-dashboard-3-line atb-ico"></text></view>
        <text class="atb-label">概览</text>
      </view>
      <view class="atb-item atb-active">
        <view class="atb-ico-wrap atb-ico-on"><text class="ri-file-list-3-line atb-ico"></text></view>
        <text class="atb-label atb-label-on">内容</text>
      </view>
      <view class="atb-item" @click="switchPage('/pages/admin/models')">
        <view class="atb-ico-wrap"><text class="ri-box-3-line atb-ico"></text></view>
        <text class="atb-label">模型</text>
      </view>
      <view class="atb-item" @click="switchPage('/pages/admin/users')">
        <view class="atb-ico-wrap"><text class="ri-team-line atb-ico"></text></view>
        <text class="atb-label">用户</text>
      </view>
      <view class="atb-item" @click="switchPage('/pages/admin/publish')">
        <view class="atb-ico-wrap"><text class="ri-megaphone-line atb-ico"></text></view>
        <text class="atb-label">发布</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const barH = ref(0)
uni.getSystemInfo({ success: r => { barH.value = r.statusBarHeight || 44 } })

const tab = ref('pending')
const list = ref([])
const loading = ref(false)
const page = ref(1)
const pendingCount = ref(0)

const selectedAll = computed(() => list.value.length > 0 && list.value.every(p => p.selected))

onMounted(() => { loadList() })

function switchTab(t) { tab.value = t; page.value = 1; list.value = []; loadList() }

async function loadList() {
  loading.value = true
  try {
    const res = await callCloud('admin-posts', { status: tab.value, page: page.value, pageSize: 20 })
    list.value = (res.data || []).map(p => ({ ...p, selected: false }))
    if (tab.value === 'pending') pendingCount.value = res.total || 0
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

function loadMore() { page.value++; loadList() }

function toggleSelect(post) { post.selected = !post.selected }
function toggleSelectAll() {
  const val = !selectedAll.value
  list.value.forEach(p => p.selected = val)
}

async function reviewPost(id, status) {
  try {
    await callCloud('admin-review-post', { id, status })
    uni.showToast({ title: status === 'approved' ? '已通过' : '已拒绝', icon: 'success' })
    list.value = list.value.filter(p => p._id !== id)
    if (tab.value === 'pending') pendingCount.value--
  } catch (e) { console.error(e) }
}

async function batchAction(status) {
  const ids = list.value.filter(p => p.selected).map(p => p._id)
  if (!ids.length) return uni.showToast({ title: '请先选择帖子', icon: 'none' })
  try {
    await callCloud('admin-batch-review', { ids, status })
    uni.showToast({ title: '操作成功', icon: 'success' })
    list.value = list.value.filter(p => !ids.includes(p._id))
    pendingCount.value -= ids.length
  } catch (e) { console.error(e) }
}

async function deletePost(id) {
  uni.showModal({
    title: '确认删除', content: '删除后不可恢复',
    success: async (r) => {
      if (r.confirm) {
        await callCloud('admin-delete-post', { id })
        uni.showToast({ title: '已删除', icon: 'success' })
        list.value = list.value.filter(p => p._id !== id)
      }
    }
  })
}

async function keepPost(id) {
  await callCloud('admin-dismiss-report', { id })
  uni.showToast({ title: '已保留', icon: 'success' })
  list.value = list.value.filter(p => p._id !== id)
}

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

/* ── Tabs ── */
.tabs-wrap {
  display: flex;
  gap: 16rpx;
  padding: 24rpx 32rpx 16rpx;
}
.tab-pill {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 14rpx 32rpx;
  border-radius: 100rpx;
  font-size: 26rpx;
  color: #8A849A;
  background: #FFF;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,.03);
}
.tab-pill.active {
  background: #8C61D6;
  color: #FFF;
  font-weight: 700;
  box-shadow: 0 4rpx 16rpx rgba(140,97,214,.25);
}
.tab-badge {
  background: #FFF;
  color: #E06B6B;
  font-size: 20rpx;
  font-weight: 700;
  padding: 2rpx 12rpx;
  border-radius: 99px;
  min-width: 32rpx;
  text-align: center;
}
.tab-pill.active .tab-badge {
  background: rgba(255,255,255,.3);
  color: #FFF;
}

/* ── Content Scroll ── */
.content-scroll {
  padding: 0 32rpx;
}

/* ── Batch Bar ── */
.batch-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0 12rpx;
}
.batch-check {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.ck-ico { font-size: 36rpx; color: #C5C0D0; }
.ck-active { color: #8C61D6; }
.batch-text { font-size: 26rpx; color: #5A5568; }
.batch-actions { display: flex; gap: 12rpx; }
.ba-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  font-size: 24rpx;
  padding: 10rpx 24rpx;
  border-radius: 100rpx;
  font-weight: 600;
}
.ba-ico { font-size: 24rpx; }
.ba-pass { background: #E8F5EC; color: #4EA07A; }
.ba-deny { background: #FDEAEA; color: #D95555; }

/* ── Post Card ── */
.post-card {
  background: #FFF;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  display: flex;
  gap: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,.03);
}
.post-check {
  flex-shrink: 0;
  padding-top: 6rpx;
}
.post-body { flex: 1; min-width: 0; }
.post-content {
  font-size: 28rpx;
  color: #3A3030;
  line-height: 1.65;
  display: block;
  margin-bottom: 12rpx;
}
.post-imgs { display: flex; gap: 10rpx; margin-bottom: 12rpx; }
.pi { width: 120rpx; height: 120rpx; border-radius: 14rpx; }
.post-time { font-size: 22rpx; color: #A09CAE; display: block; }

/* ── Action Buttons ── */
.post-ops {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  flex-shrink: 0;
  justify-content: center;
}
.op-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.op-ico { font-size: 28rpx; }
.op-pass { background: #E8F5EC; }
.op-pass .op-ico { color: #4EA07A; }
.op-deny { background: #FFF0ED; }
.op-deny .op-ico { color: #D95555; }
.op-del { background: #FDEAEA; }
.op-del .op-ico { color: #D95555; }

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
  padding: 160rpx 0 120rpx;
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
