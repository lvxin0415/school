<template>
  <view class="hotspots-page">
    <view class="model-info">
      <text class="mi-title">模型热点标注管理</text>
      <text class="mi-desc">管理3D模型上的信息标注点</text>
    </view>

    <view class="hotspot-list">
      <view v-for="(h, i) in hotspots" :key="i" class="hotspot-card">
        <view class="hs-header">
          <text class="ri-map-pin-2-line hs-icon"></text>
          <text class="hs-name">{{ h.name }}</text>
          <text class="hs-del" @click="removeHotspot(i)">删除</text>
        </view>
        <text class="hs-desc">{{ h.description }}</text>
      </view>

      <view v-if="!hotspots.length" class="empty-box">
        <text class="ri-map-pin-2-line empty-icon"></text>
        <text class="empty-t">暂无热点标注</text>
      </view>
    </view>

    <view class="add-section">
      <text class="sec-title">添加新热点</text>
      <view class="form-row">
        <input v-model="newName" class="form-input" placeholder="热点名称" />
      </view>
      <view class="form-row">
        <textarea v-model="newDesc" class="form-textarea" placeholder="热点描述..." maxlength="100" />
      </view>
      <button class="btn-add" @click="addHotspot">添加热点</button>
    </view>

    <button class="btn-save" @click="saveHotspots">保存所有热点</button>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const hotspots = ref([])
const newName = ref('')
const newDesc = ref('')
let modelId = ''

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  modelId = currentPage.$page?.options?.id || currentPage.options?.id || ''
  if (modelId) loadHotspots()
})

async function loadHotspots() {
  try {
    const res = await callCloud('admin-get-model-hotspots', { id: modelId })
    hotspots.value = res.data || []
  } catch (e) { console.error(e) }
}

function addHotspot() {
  if (!newName.value.trim()) return uni.showToast({ title: '请输入热点名称', icon: 'none' })
  hotspots.value.push({
    name: newName.value.trim(),
    description: newDesc.value.trim(),
    position: { x: 0, y: 0, z: 0 }
  })
  newName.value = ''
  newDesc.value = ''
}

function removeHotspot(i) {
  uni.showModal({
    title: '确认删除', content: `删除热点「${hotspots.value[i].name}」？`,
    success: (r) => { if (r.confirm) hotspots.value.splice(i, 1) }
  })
}

async function saveHotspots() {
  try {
    await callCloud('admin-save-model-hotspots', { id: modelId, hotspots: hotspots.value })
    uni.showToast({ title: '保存成功', icon: 'success' })
  } catch (e) { console.error(e) }
}
</script>

<style scoped>
.hotspots-page {
  min-height: 100vh;
  background: #F7F6FA;
  padding: 24rpx;
  padding-bottom: 140rpx;
}

.model-info {
  background: #FFFFFF;
  padding: 32rpx;
  border-radius: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.mi-title {
  font-size: 32rpx;
  font-weight: 700;
  color: #3A3030;
  display: block;
}

.mi-desc {
  font-size: 24rpx;
  color: #A09CAE;
  margin-top: 8rpx;
  display: block;
}

.hotspot-list {
  margin-bottom: 24rpx;
}

.hotspot-card {
  background: #FFF;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.hs-header {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.hs-name {
  flex: 1;
  font-size: 28rpx;
  font-weight: 600;
  color: #3A3030;
}

.hs-del {
  font-size: 24rpx;
  color: #E85D5D;
}

.hs-desc {
  font-size: 24rpx;
  color: #A09CAE;
  margin-top: 8rpx;
  display: block;
}

.add-section {
  background: #FFF;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.sec-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #3A3030;
  display: block;
  margin-bottom: 16rpx;
}

.form-row {
  margin-bottom: 16rpx;
}

.form-input {
  height: 80rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  border: 1rpx solid #ECEAF0;
  border-radius: 16rpx;
  width: 100%;
  box-sizing: border-box;
}

.form-textarea {
  width: 100%;
  height: 120rpx;
  padding: 16rpx;
  font-size: 28rpx;
  border: 1rpx solid #ECEAF0;
  border-radius: 16rpx;
  box-sizing: border-box;
}

.btn-add {
  height: 72rpx;
  line-height: 72rpx;
  background: rgba(140, 97, 214, 0.08);
  color: #8C61D6;
  font-size: 28rpx;
  font-weight: 600;
  border-radius: 48rpx;
  border: none;
}

.btn-add::after {
  border: none;
}

.btn-save {
  height: 96rpx;
  line-height: 96rpx;
  background: #8C61D6;
  color: #FFF;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 48rpx;
  border: none;
}

.btn-save::after {
  border: none;
}

.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 0;
}

.empty-t {
  font-size: 28rpx;
  color: #A09CAE;
  margin-top: 16rpx;
}

.hs-icon {
  font-size: 28rpx;
  color: #8C61D6;
}

.empty-icon {
  font-size: 64rpx;
  color: #A09CAE;
}
</style>
