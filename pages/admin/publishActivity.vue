<template>
  <view class="pub-act-page">
    <view class="form-section">
      <view class="input-group">
        <text class="input-label">活动标题</text>
        <input v-model="form.title" class="form-input" placeholder="请输入活动标题" maxlength="50" />
      </view>
      <view class="input-group">
        <text class="input-label">活动内容</text>
        <textarea v-model="form.content" class="form-textarea" placeholder="请输入活动详细内容..." maxlength="1000" />
      </view>
      <view class="input-group">
        <text class="input-label">活动地点</text>
        <input v-model="form.location" class="form-input" placeholder="请输入活动地点" />
      </view>
      <view class="input-group">
        <text class="input-label">开始时间</text>
        <picker mode="date" @change="(e) => form.start_time = e.detail.value">
          <view class="picker-view">
            <text :class="{ placeholder: !form.start_time }">{{ form.start_time || '选择开始日期' }}</text>
            <text class="ri-arrow-right-s-line picker-arrow"></text>
          </view>
        </picker>
      </view>
      <view class="input-group">
        <text class="input-label">结束时间</text>
        <picker mode="date" @change="(e) => form.end_time = e.detail.value">
          <view class="picker-view">
            <text :class="{ placeholder: !form.end_time }">{{ form.end_time || '选择结束日期' }}</text>
            <text class="ri-arrow-right-s-line picker-arrow"></text>
          </view>
        </picker>
      </view>
      <view class="input-group">
        <text class="input-label">封面图</text>
        <view class="cover-area" @click="chooseCover">
          <image v-if="form.cover_url" :src="form.cover_url" mode="aspectFill" class="cover-img" />
          <view v-else class="cover-placeholder">
            <text class="ri-image-line cover-icon"></text>
            <text class="cover-text">选择封面图</text>
          </view>
        </view>
      </view>
      <view class="switch-row">
        <text class="switch-label">置顶</text>
        <switch :checked="form.is_top" color="#8C61D6" @change="(e) => form.is_top = e.detail.value" />
      </view>
      <view class="switch-row">
        <text class="switch-label">展示在首页Banner</text>
        <switch :checked="form.is_banner" color="#8C61D6" @change="(e) => form.is_banner = e.detail.value" />
      </view>
    </view>

    <button class="btn-publish" @click="handlePublish">{{ editId ? '更新活动' : '发布活动' }}</button>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const form = ref({ title: '', content: '', location: '', start_time: '', end_time: '', cover_url: '', is_top: false, is_banner: false })
const editId = ref('')

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  editId.value = currentPage.$page?.options?.id || currentPage.options?.id || ''
  if (editId.value) loadActivity()
})

async function loadActivity() {
  try {
    const res = await callCloud('get-activity-detail', { id: editId.value })
    if (res.data) form.value = { ...form.value, ...res.data }
  } catch (e) { console.error(e) }
}

function chooseCover() {
  uni.chooseImage({
    count: 1, sizeType: ['compressed'],
    success: (res) => { form.value.cover_url = res.tempFilePaths[0] }
  })
}

async function handlePublish() {
  if (!form.value.title.trim()) return uni.showToast({ title: '请输入活动标题', icon: 'none' })
  try {
    const action = editId.value ? 'admin-update-activity' : 'admin-create-activity'
    await callCloud(action, { ...form.value, id: editId.value })
    uni.showToast({ title: editId.value ? '更新成功' : '发布成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 500)
  } catch (e) { console.error(e) }
}
</script>

<style scoped>
.pub-act-page {
  min-height: 100vh;
  background: #F7F6FA;
  padding: 24rpx;
}

.form-section {
  background: #FFF;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.input-group {
  margin-bottom: 24rpx;
}

.input-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #3A3030;
  display: block;
  margin-bottom: 12rpx;
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
  height: 200rpx;
  padding: 20rpx;
  font-size: 28rpx;
  border: 1rpx solid #ECEAF0;
  border-radius: 16rpx;
  box-sizing: border-box;
}

.picker-view {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80rpx;
  padding: 0 20rpx;
  border: 1rpx solid #ECEAF0;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #3A3030;
}

.placeholder {
  color: #A09CAE;
}

.cover-area {
  width: 300rpx;
  height: 200rpx;
}

.cover-img {
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  border: 2rpx dashed #ECEAF0;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}

.cover-text {
  font-size: 22rpx;
  color: #A09CAE;
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
}

.switch-label {
  font-size: 28rpx;
  color: #3A3030;
}

.btn-publish {
  margin-top: 40rpx;
  height: 96rpx;
  line-height: 96rpx;
  background: #8C61D6;
  color: #FFF;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 48rpx;
  border: none;
}

.btn-publish::after {
  border: none;
}

.picker-arrow {
  font-size: 28rpx;
  color: #A09CAE;
}

.cover-icon {
  font-size: 36rpx;
  color: #A09CAE;
}
</style>
