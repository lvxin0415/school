<template>
  <view class="publish-page">
    <view class="form-area">
      <textarea v-model="content" class="content-input" placeholder="说点什么吧... 完全匿名哦" maxlength="500" :auto-height="true" />
      <text class="char-count">{{ content.length }}/500</text>
    </view>

    <view class="img-section">
      <view class="img-grid">
        <view v-for="(img, i) in images" :key="i" class="img-item">
          <image :src="img" mode="aspectFill" class="img-preview" />
          <view class="img-del" @click="removeImg(i)">
            <text class="ri-close-line del-icon"></text>
          </view>
        </view>
        <view v-if="images.length < 9" class="img-add" @click="chooseImg">
          <text class="ri-image-add-line add-icon"></text>
          <text class="add-text">添加图片</text>
        </view>
      </view>
    </view>

    <view class="tag-section">
      <text class="tag-label">话题标签</text>
      <view class="tag-list">
        <view v-for="tag in selectedTags" :key="tag" class="sel-tag" @click="toggleTag(tag)">
          <text class="sel-tag-text">#{{ tag }}</text>
          <text class="ri-close-line sel-tag-close"></text>
        </view>
      </view>
      <view class="hot-tags">
        <text v-for="ht in hotTags" :key="ht" class="hot-tag" @click="toggleTag(ht)">#{{ ht }}</text>
      </view>
    </view>

    <view class="publish-bar safe-area-bottom">
      <button class="btn-pub" :loading="submitting" @click="handlePublish">匿名发布</button>
      <text class="tip-text">帖子经审核后公开展示</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { callCloud, uploadFile } from '@/common/utils/request.js'
import { randomAnonymousName, randomAvatarColor } from '@/common/utils/helper.js'

const content = ref('')
const images = ref([])
const selectedTags = ref([])
const submitting = ref(false)
const hotTags = ['校园生活', '吐槽', '表白', '考试', '美食', '求助', '趣事']

function chooseImg() {
  uni.chooseImage({
    count: 9 - images.value.length,
    sizeType: ['compressed'],
    success: (res) => { images.value = [...images.value, ...res.tempFilePaths] }
  })
}
function removeImg(i) { images.value.splice(i, 1) }
function toggleTag(tag) {
  const i = selectedTags.value.indexOf(tag)
  if (i > -1) selectedTags.value.splice(i, 1)
  else if (selectedTags.value.length < 3) selectedTags.value.push(tag)
  else uni.showToast({ title: '最多3个标签', icon: 'none' })
}

async function handlePublish() {
  if (!content.value.trim()) return uni.showToast({ title: '请输入内容', icon: 'none' })
  submitting.value = true
  try {
    let imageUrls = []
    for (const img of images.value) {
      const ext = img.split('.').pop()
      const cp = `posts/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const fid = await uploadFile(img, cp)
      imageUrls.push(fid)
    }
    await callCloud('createPost', {
      content: content.value, images: imageUrls, tags: selectedTags.value,
      anonymous_name: randomAnonymousName(), avatar_color: randomAvatarColor()
    })
    uni.showToast({ title: '发布成功，等待审核', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1000)
  } catch (e) { console.error(e) }
  finally { submitting.value = false }
}
</script>

<style scoped>
.publish-page {
  min-height: 100vh;
  background: #F7F6FA;
  padding-bottom: 200rpx;
}

.form-area {
  background: #FFFFFF;
  padding: 32rpx;
  margin-bottom: 16rpx;
  border-bottom: 1rpx solid #ECEAF0;
}
.content-input {
  width: 100%;
  min-height: 300rpx;
  font-size: 30rpx;
  color: #3A3030;
  line-height: 1.8;
}
.char-count {
  display: block;
  text-align: right;
  font-size: 24rpx;
  color: #A09CAE;
  margin-top: 12rpx;
}

.img-section {
  background: #FFFFFF;
  padding: 32rpx;
  margin-bottom: 16rpx;
  border-top: 1rpx solid #ECEAF0;
  border-bottom: 1rpx solid #ECEAF0;
}
.img-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}
.img-item {
  position: relative;
  width: 200rpx;
  height: 200rpx;
}
.img-preview {
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
}
.img-del {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  width: 40rpx;
  height: 40rpx;
  background: rgba(58,48,48,0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.del-icon {
  font-size: 24rpx;
  color: #FFFFFF;
}
.img-add {
  width: 200rpx;
  height: 200rpx;
  background: #F7F6FA;
  border-radius: 16rpx;
  border: 2rpx dashed #ECEAF0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.add-icon {
  font-size: 48rpx;
  color: #A09CAE;
}
.add-text {
  font-size: 22rpx;
  color: #A09CAE;
  margin-top: 8rpx;
}

.tag-section {
  background: #FFFFFF;
  padding: 32rpx;
  border-top: 1rpx solid #ECEAF0;
}
.tag-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #3A3030;
  display: block;
  margin-bottom: 16rpx;
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 16rpx;
}
.sel-tag {
  display: flex;
  align-items: center;
  gap: 6rpx;
  background: #8C61D6;
  padding: 8rpx 20rpx;
  border-radius: 99rpx;
}
.sel-tag-text {
  font-size: 24rpx;
  color: #FFFFFF;
}
.sel-tag-close {
  font-size: 22rpx;
  color: rgba(255,255,255,0.7);
}
.hot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.hot-tag {
  font-size: 24rpx;
  color: #8C61D6;
  background: rgba(140,97,214,0.08);
  padding: 8rpx 20rpx;
  border-radius: 99rpx;
}

.publish-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx 32rpx;
  background: #FFFFFF;
  border-top: 1rpx solid #ECEAF0;
}
.btn-pub {
  height: 96rpx;
  line-height: 96rpx;
  background: #8C61D6;
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 600;
  letter-spacing: 6rpx;
  border-radius: 16rpx;
  border: none;
  box-shadow: 0 4rpx 16rpx rgba(140,97,214,0.35);
}
.btn-pub::after {
  border: none;
}
.tip-text {
  display: block;
  text-align: center;
  font-size: 22rpx;
  color: #A09CAE;
  margin-top: 12rpx;
}
</style>
