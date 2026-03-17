<template>
  <view class="upload-page">
    <view class="form-section">
      <view class="input-group">
        <text class="input-label">模型名称</text>
        <input v-model="name" class="form-input" placeholder="请输入模型名称" />
      </view>
      <view class="input-group">
        <text class="input-label">模型描述</text>
        <textarea v-model="description" class="form-textarea" placeholder="请输入模型描述..." maxlength="200" />
      </view>
      <view class="input-group">
        <text class="input-label">模型文件 (FBX/GLB)</text>
        <view class="file-area" @click="chooseFile">
          <text class="ri-upload-cloud-2-line upload-icon"></text>
          <text class="file-text">{{ fileName || '点击选择文件' }}</text>
        </view>
      </view>
      <view class="input-group">
        <text class="input-label">缩略图</text>
        <view class="thumb-area" @click="chooseThumbnail">
          <image v-if="thumbnail" :src="thumbnail" mode="aspectFill" class="thumb-img" />
          <view v-else class="thumb-placeholder">
            <text class="ri-image-line thumb-icon"></text>
            <text class="thumb-text">选择缩略图</text>
          </view>
        </view>
      </view>
    </view>
    <button class="btn-upload" :disabled="uploading" @click="handleUpload">
      {{ uploading ? '上传中...' : '上传模型' }}
    </button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const name = ref('')
const description = ref('')
const fileName = ref('')
const filePath = ref('')
const thumbnail = ref('')
const uploading = ref(false)

function chooseFile() {
  // #ifdef MP-WEIXIN
  uni.chooseMessageFile({
    count: 1,
    type: 'file',
    success: (res) => {
      filePath.value = res.tempFiles[0].path
      fileName.value = res.tempFiles[0].name
    }
  })
  // #endif
  // #ifdef H5
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.fbx,.glb,.gltf,.obj'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    fileName.value = file.name
    filePath.value = URL.createObjectURL(file)
    filePath._file = file
  }
  input.click()
  // #endif
  // #ifdef APP-PLUS
  plus.io.chooseFile({
    count: 1,
    extension: ['.fbx', '.glb', '.gltf', '.obj'],
    success: (res) => {
      filePath.value = res.tempFiles[0].path
      fileName.value = res.tempFiles[0].name
    },
    fail: () => {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          filePath.value = res.tempFilePaths[0]
          fileName.value = res.tempFilePaths[0].split('/').pop()
        }
      })
    }
  })
  // #endif
}

function chooseThumbnail() {
  uni.chooseImage({
    count: 1, sizeType: ['compressed'],
    success: (res) => { thumbnail.value = res.tempFilePaths[0] }
  })
}

async function handleUpload() {
  if (!name.value.trim()) return uni.showToast({ title: '请输入模型名称', icon: 'none' })
  if (!filePath.value) return uni.showToast({ title: '请选择模型文件', icon: 'none' })
  uploading.value = true
  try {
    let fileUrl = ''
    if (filePath.value) {
      const uploadOpts = { filePath: filePath.value, cloudPath: `models/${Date.now()}_${fileName.value}` }
      // #ifdef H5
      if (filePath._file) uploadOpts.filePath = filePath._file
      // #endif
      const uploadRes = await uniCloud.uploadFile(uploadOpts)
      fileUrl = uploadRes.fileID
    }
    let thumbUrl = ''
    if (thumbnail.value) {
      const thumbRes = await uniCloud.uploadFile({ filePath: thumbnail.value, cloudPath: `thumbnails/${Date.now()}.jpg` })
      thumbUrl = thumbRes.fileID
    }
    await callCloud('admin-upload-model', { name: name.value, description: description.value, file_url: fileUrl, thumbnail_url: thumbUrl })
    uni.showToast({ title: '上传成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 500)
  } catch (e) { console.error(e); uni.showToast({ title: '上传失败', icon: 'none' }) }
  finally { uploading.value = false }
}
</script>

<style scoped>
.upload-page {
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
  margin-bottom: 28rpx;
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
  height: 180rpx;
  padding: 20rpx;
  font-size: 28rpx;
  border: 1rpx solid #ECEAF0;
  border-radius: 16rpx;
  box-sizing: border-box;
}

.file-area {
  border: 2rpx dashed #ECEAF0;
  border-radius: 16rpx;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}

.file-text {
  font-size: 26rpx;
  color: #8C61D6;
}

.thumb-area {
  width: 200rpx;
  height: 200rpx;
}

.thumb-img {
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
}

.thumb-placeholder {
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

.thumb-text {
  font-size: 22rpx;
  color: #A09CAE;
}

.btn-upload {
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

.btn-upload::after {
  border: none;
}

.btn-upload[disabled] {
  opacity: 0.6;
}

.upload-icon {
  font-size: 36rpx;
  color: #8C61D6;
}

.thumb-icon {
  font-size: 32rpx;
  color: #A09CAE;
}
</style>
