<template>
  <view class="admin-page">
    <view class="hd" :style="{ paddingTop: barH + 'px' }">
      <text class="hd-title">3D 模型管理</text>
      <text class="hd-sub">{{ modelList.length }} 个模型</text>
    </view>

    <view class="model-list">
      <view v-for="m in modelList" :key="m._id" class="model-card">
        <view class="mc-thumb-wrap">
          <image :src="m.thumbnail_url || '/static/model-default.png'" mode="aspectFill" class="mc-thumb" />
          <view class="mc-badge" :class="m.status === 'active' ? 'mc-on' : 'mc-off'">
            <text>{{ m.status === 'active' ? '启用' : '停用' }}</text>
          </view>
        </view>
        <view class="mc-body">
          <text class="mc-name">{{ m.name }}</text>
          <text class="mc-desc text-ellipsis">{{ m.description || '暂无描述' }}</text>
          <text class="mc-time">{{ m.uploaded_at }}</text>
        </view>
        <view class="mc-ops">
          <view v-if="m.status !== 'active'" class="op-pill op-enable" @click="toggleModel(m._id, 'active')">
            <text class="ri-play-circle-line op-ico"></text>
          </view>
          <view v-else class="op-pill op-disable" @click="toggleModel(m._id, 'inactive')">
            <text class="ri-pause-circle-line op-ico"></text>
          </view>
          <view class="op-pill op-hs" @click="goHotspots(m._id)">
            <text class="ri-map-pin-2-line op-ico"></text>
          </view>
          <view class="op-pill op-del" @click="deleteModel(m)">
            <text class="ri-delete-bin-6-line op-ico"></text>
          </view>
        </view>
      </view>

      <view v-if="!modelList.length" class="empty-box">
        <text class="ri-box-3-line empty-ico"></text>
        <text class="empty-text">暂无模型</text>
        <text class="empty-hint">点击右下角添加</text>
      </view>
    </view>

    <!-- FAB -->
    <view class="fab" @click="goUpload">
      <text class="ri-add-line fab-ico"></text>
    </view>

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
      <view class="atb-item atb-active">
        <view class="atb-ico-wrap atb-ico-on"><text class="ri-box-3-line atb-ico"></text></view>
        <text class="atb-label atb-label-on">模型</text>
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
import { ref, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const barH = ref(0)
uni.getSystemInfo({ success: r => { barH.value = r.statusBarHeight || 44 } })

const modelList = ref([])

onMounted(() => { loadModels() })

async function loadModels() {
  try {
    const res = await callCloud('admin-get-models', {})
    modelList.value = res.data || []
  } catch (e) { console.error(e) }
}

async function toggleModel(id, status) {
  try {
    await callCloud('admin-toggle-model', { id, status })
    uni.showToast({ title: '操作成功', icon: 'success' })
    loadModels()
  } catch (e) { console.error(e) }
}

function deleteModel(m) {
  if (m.status === 'active') return uni.showToast({ title: '启用中的模型不能删除', icon: 'none' })
  uni.showModal({
    title: '确认删除', content: `确定删除模型「${m.name}」？`,
    success: async (r) => {
      if (r.confirm) {
        await callCloud('admin-delete-model', { id: m._id })
        uni.showToast({ title: '已删除', icon: 'success' })
        loadModels()
      }
    }
  })
}

function goUpload() { uni.navigateTo({ url: '/pages/admin/modelUpload' }) }
function goHotspots(id) { uni.navigateTo({ url: `/pages/admin/modelHotspots?id=${id}` }) }
function switchPage(url) { uni.redirectTo({ url }) }
</script>

<style scoped>
.admin-page {
  min-height: 100vh;
  background: #F4F2F9;
  padding-bottom: 160rpx;
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
.hd-sub {
  font-size: 24rpx;
  color: rgba(255,255,255,.6);
  display: block;
  margin-top: -6rpx;
}

/* ── Model List ── */
.model-list { padding: 24rpx 32rpx; }
.model-card {
  background: #FFF;
  border-radius: 20rpx;
  padding: 20rpx;
  margin-bottom: 16rpx;
  display: flex;
  gap: 18rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,.03);
}
.mc-thumb-wrap {
  width: 160rpx;
  height: 120rpx;
  border-radius: 14rpx;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  background: #EDEAF4;
}
.mc-thumb { width: 100%; height: 100%; }
.mc-badge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 18rpx;
  font-weight: 700;
  padding: 4rpx 0;
}
.mc-on { background: rgba(78,160,122,.85); color: #FFF; }
.mc-off { background: rgba(90,85,104,.7); color: #ddd; }
.mc-body { flex: 1; min-width: 0; }
.mc-name {
  font-size: 28rpx;
  font-weight: 700;
  color: #3A3030;
  display: block;
}
.mc-desc {
  font-size: 23rpx;
  color: #A09CAE;
  margin-top: 4rpx;
  display: block;
}
.mc-time {
  font-size: 21rpx;
  color: #C5C0D0;
  margin-top: 8rpx;
  display: block;
}

/* ── Ops ── */
.mc-ops {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  flex-shrink: 0;
  justify-content: center;
}
.op-pill {
  width: 56rpx;
  height: 56rpx;
  border-radius: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.op-ico { font-size: 26rpx; }
.op-enable { background: #E8F5EC; }
.op-enable .op-ico { color: #4EA07A; }
.op-disable { background: #F0EDF4; }
.op-disable .op-ico { color: #8A849A; }
.op-hs { background: #F0E8FA; }
.op-hs .op-ico { color: #8C61D6; }
.op-del { background: #FDEAEA; }
.op-del .op-ico { color: #D95555; }

/* ── Empty ── */
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 180rpx 0 120rpx;
}
.empty-ico { font-size: 80rpx; color: #D2CEE0; }
.empty-text { font-size: 28rpx; color: #A09CAE; margin-top: 16rpx; }
.empty-hint { font-size: 24rpx; color: #C5C0D0; margin-top: 6rpx; }

/* ── FAB ── */
.fab {
  position: fixed;
  right: 40rpx;
  bottom: 200rpx;
  width: 108rpx;
  height: 108rpx;
  background: linear-gradient(145deg, #9B6FE0, #7B52C1);
  border-radius: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 28rpx rgba(123,82,193,.4);
  z-index: 100;
}
.fab-ico { font-size: 40rpx; color: #FFF; }

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
