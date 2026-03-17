<template>
  <view class="feedback-page">
    <view class="page-top">
      <text class="page-title">意见反馈</text>
      <text class="page-sub">你的声音，我们在意</text>
    </view>

    <view class="form-card">
      <view class="field-group">
        <text class="field-label">反馈类型</text>
        <view class="type-row">
          <view
            v-for="t in types"
            :key="t.value"
            class="type-tag"
            :class="{ active: feedbackType === t.value }"
            @click="feedbackType = t.value"
          >
            <text>{{ t.label }}</text>
          </view>
        </view>
      </view>

      <view class="field-group">
        <text class="field-label">反馈内容</text>
        <view class="textarea-wrap">
          <textarea
            v-model="content"
            class="fb-textarea"
            placeholder="请详细描述你的问题或建议..."
            maxlength="500"
          />
          <text class="char-count">{{ content.length }}/500</text>
        </view>
      </view>

      <view class="field-group">
        <text class="field-label">截图（可选）</text>
        <view class="img-row">
          <view v-for="(img, i) in images" :key="i" class="img-wrap">
            <image :src="img" mode="aspectFill" class="fb-img" />
            <view class="img-del" @click="images.splice(i, 1)">
              <text class="ri-close-line del-ico"></text>
            </view>
          </view>
          <view v-if="images.length < 3" class="img-add" @click="addImage">
            <text class="ri-add-line add-ico"></text>
            <text class="add-text">添加</text>
          </view>
        </view>
      </view>

      <view class="field-group">
        <text class="field-label">联系方式（可选）</text>
        <input v-model="contact" class="fb-input" placeholder="QQ / 邮箱 / 手机号" />
      </view>
    </view>

    <button class="btn-submit" @click="handleSubmit">提交反馈</button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { callCloud } from '@/common/utils/request.js'

const types = [
  { label: '功能建议', value: 'suggestion' },
  { label: 'Bug反馈', value: 'bug' },
  { label: '投诉举报', value: 'report' },
  { label: '其他', value: 'other' }
]

const feedbackType = ref('suggestion')
const content = ref('')
const images = ref([])
const contact = ref('')

function addImage() {
  uni.chooseImage({
    count: 3 - images.value.length, sizeType: ['compressed'],
    success: (res) => { images.value = [...images.value, ...res.tempFilePaths] }
  })
}

async function handleSubmit() {
  if (!content.value.trim()) return uni.showToast({ title: '请填写反馈内容', icon: 'none' })
  try {
    await callCloud('submit-feedback', {
      type: feedbackType.value,
      content: content.value,
      images: images.value,
      contact: contact.value
    })
    uni.showToast({ title: '反馈已提交', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 500)
  } catch (e) { console.error(e) }
}
</script>

<style scoped>
.feedback-page {
  min-height: 100vh;
  background: #F7F6FA;
  padding-bottom: 60rpx;
}

.page-top {
  padding: 60rpx 36rpx 40rpx;
  background: #FFFFFF;
  border-bottom: 1rpx solid #ECEAF0;
}

.page-title {
  font-size: 38rpx;
  font-weight: 700;
  color: #3A3030;
  display: block;
}

.page-sub {
  font-size: 24rpx;
  color: #A09CAE;
  display: block;
  margin-top: 6rpx;
}

.form-card {
  margin: 24rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.field-group {
  margin-bottom: 32rpx;
}

.field-group:last-child {
  margin-bottom: 0;
}

.field-label {
  font-size: 28rpx;
  font-weight: 600;
  color: #3A3030;
  display: block;
  margin-bottom: 16rpx;
}

.type-row {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}

.type-tag {
  padding: 14rpx 32rpx;
  border-radius: 16rpx;
  background: #F7F6FA;
  font-size: 26rpx;
  color: #747288;
  border: 2rpx solid transparent;
}

.type-tag.active {
  background: rgba(140, 97, 214, 0.08);
  color: #8C61D6;
  font-weight: 700;
  border-color: rgba(140, 97, 214, 0.2);
}

.textarea-wrap {
  position: relative;
  background: #F7F6FA;
  border-radius: 16rpx;
  border: 1rpx solid #ECEAF0;
  overflow: hidden;
}

.fb-textarea {
  width: 100%;
  height: 240rpx;
  padding: 24rpx;
  font-size: 28rpx;
  color: #3A3030;
  box-sizing: border-box;
  background: transparent;
}

.char-count {
  font-size: 22rpx;
  color: #A09CAE;
  text-align: right;
  display: block;
  padding: 0 24rpx 16rpx;
}

.img-row {
  display: flex;
  gap: 16rpx;
}

.img-wrap {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  overflow: hidden;
}

.fb-img {
  width: 100%;
  height: 100%;
}

.img-del {
  position: absolute;
  top: 8rpx;
  right: 8rpx;
  width: 36rpx;
  height: 36rpx;
  background: rgba(58, 48, 48, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.img-add {
  width: 160rpx;
  height: 160rpx;
  border: 2rpx dashed #ECEAF0;
  border-radius: 16rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  background: #F7F6FA;
}

.add-text {
  font-size: 20rpx;
  color: #A09CAE;
}

.fb-input {
  height: 88rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #3A3030;
  background: #F7F6FA;
  border: 1rpx solid #ECEAF0;
  border-radius: 16rpx;
}

.btn-submit {
  margin: 40rpx 24rpx 0;
  height: 96rpx;
  line-height: 96rpx;
  background: #8C61D6;
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 700;
  border-radius: 24rpx;
  border: none;
  letter-spacing: 4rpx;
}

.btn-submit::after {
  border: none;
}

.del-ico {
  font-size: 26rpx;
  color: #FFF;
}

.add-ico {
  font-size: 36rpx;
  color: #A09CAE;
}
</style>
