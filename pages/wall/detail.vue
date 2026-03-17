<template>
  <view class="detail-page">
    <scroll-view scroll-y class="detail-scroll">
      <!-- 帖子主体卡片 -->
      <view class="post-card">
        <view class="post-header">
          <view class="post-avatar" :style="{ background: post.avatar_color || '#8C61D6' }">
            <text class="av-char">{{ (post.anonymous_name || '匿')[0] }}</text>
          </view>
          <view class="post-info">
            <text class="post-name">{{ post.anonymous_name || '匿名用户' }}</text>
            <text class="post-time">{{ formatTime(post.created_at) }}</text>
          </view>
        </view>

        <text class="post-content">{{ post.content }}</text>

        <view v-if="post.images && post.images.length" class="post-images">
          <image
            v-for="(img, i) in post.images"
            :key="i"
            :src="img"
            mode="widthFix"
            class="post-img"
            @click="previewImg(i)"
          />
        </view>

        <view v-if="post.tags && post.tags.length" class="post-tags">
          <view v-for="tag in post.tags" :key="tag" class="tag-pill">
            <text class="tag-hash">#</text>
            <text class="tag-text">{{ tag }}</text>
          </view>
        </view>

        <view class="post-actions">
          <view class="action-btn" @click="likePost">
            <text
              :class="isLiked ? 'ri-heart-fill' : 'ri-heart-line'"
              class="action-icon"
              :style="{ color: isLiked ? '#E06B6B' : '#A09CAE' }"
            ></text>
            <text class="action-num" :class="{ liked: isLiked }">{{ post.likes || 0 }}</text>
          </view>
          <view class="action-btn">
            <text class="ri-chat-3-line action-icon"></text>
            <text class="action-num">{{ comments.length }}</text>
          </view>
        </view>
      </view>

      <!-- 评论区 -->
      <view class="comment-section">
        <view class="section-header">
          <text class="section-title">评论</text>
          <view class="comment-count-badge">
            <text class="count-text">{{ comments.length }}</text>
          </view>
        </view>

        <view v-for="(c, idx) in comments" :key="c._id" class="comment-item">
          <view class="comment-top">
            <view class="cm-avatar" :style="{ background: c.avatar_color || '#A882E0' }">
              <text class="cm-char">{{ (c.anonymous_name || '匿')[0] }}</text>
            </view>
            <view class="cm-info">
              <text class="cm-name">{{ c.anonymous_name || '匿名用户' }}</text>
              <view class="cm-floor-badge">
                <text class="cm-floor">#{{ idx + 1 }}</text>
              </view>
            </view>
            <text class="cm-time">{{ formatTime(c.created_at) }}</text>
          </view>
          <text class="cm-content">{{ c.content }}</text>
          <view v-if="c.reply_to" class="cm-reply">
            <view class="reply-bar"></view>
            <text class="reply-text">回复 {{ c.reply_name }}：{{ c.reply_content }}</text>
          </view>
        </view>

        <view v-if="comments.length === 0" class="empty-comment">
          <text class="ri-chat-3-line empty-cm-icon"></text>
          <text class="empty-cm-text">暂无评论，快来说两句</text>
        </view>
      </view>

      <view style="height: 140rpx;"></view>
    </scroll-view>

    <!-- 底部评论输入框 -->
    <view class="comment-bar safe-area-bottom">
      <view class="bar-content">
        <view class="input-wrap">
          <text class="ri-edit-line input-icon"></text>
          <input
            v-model="commentText"
            class="cm-input"
            placeholder="写下你的评论..."
            maxlength="200"
            :adjust-position="true"
            @confirm="submitComment"
          />
        </view>
        <view class="cm-send" :class="{ active: commentText.trim() }" @click="submitComment">
          <text class="send-text">发送</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { callCloud } from '@/common/utils/request.js'
import { formatTime, randomAnonymousName, randomAvatarColor } from '@/common/utils/helper.js'

const post = ref({})
const comments = ref([])
const commentText = ref('')
const isLiked = ref(false)
const postId = ref('')

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  postId.value = currentPage.options?.id || ''
  if (postId.value) {
    loadPost()
    loadComments()
  }
})

async function loadPost() {
  try {
    const res = await callCloud('getPostDetail', { id: postId.value })
    post.value = res.data || {}
    isLiked.value = res.data?.isLiked || false
  } catch (e) { console.error(e) }
}

async function loadComments() {
  try {
    const res = await callCloud('getComments', { postId: postId.value })
    comments.value = res.data || []
  } catch (e) { console.error(e) }
}

async function likePost() {
  try {
    const res = await callCloud('likePost', { postId: postId.value })
    isLiked.value = !isLiked.value
    post.value.likes = res.likes
  } catch (e) { console.error(e) }
}

async function submitComment() {
  if (!commentText.value.trim()) return
  try {
    await callCloud('addComment', {
      postId: postId.value,
      content: commentText.value,
      anonymous_name: randomAnonymousName(),
      avatar_color: randomAvatarColor()
    })
    commentText.value = ''
    uni.showToast({ title: '评论成功', icon: 'success' })
    loadComments()
  } catch (e) { console.error(e) }
}

function previewImg(idx) {
  uni.previewImage({
    current: idx,
    urls: post.value.images || []
  })
}
</script>

<style scoped>
.detail-page {
  min-height: 100vh;
  background: #F7F6FA;
  display: flex;
  flex-direction: column;
}

.detail-scroll {
  flex: 1;
}

.post-card {
  margin: 24rpx 28rpx 16rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 28rpx 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
  border: 1rpx solid #ECEAF0;
}

.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}
.post-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}
.av-char {
  color: #FFFFFF;
  font-size: 32rpx;
  font-weight: 700;
}
.post-info {
  flex: 1;
}
.post-name {
  font-size: 30rpx;
  font-weight: 600;
  color: #3A3030;
  display: block;
}
.post-time {
  font-size: 24rpx;
  color: #A09CAE;
  display: block;
  margin-top: 6rpx;
}

.post-content {
  font-size: 30rpx;
  color: #3A3030;
  line-height: 1.85;
  margin-bottom: 24rpx;
}

.post-images {
  margin-bottom: 20rpx;
}
.post-img {
  width: 100%;
  border-radius: 16rpx;
  margin-bottom: 12rpx;
}

.post-tags {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
  margin-bottom: 20rpx;
}
.tag-pill {
  display: flex;
  align-items: center;
  padding: 8rpx 22rpx;
  border-radius: 99rpx;
  background: rgba(140,97,214,0.06);
  border: 1rpx solid rgba(140,97,214,0.1);
}
.tag-hash {
  font-size: 24rpx;
  color: #8C61D6;
  font-weight: 700;
  margin-right: 2rpx;
}
.tag-text {
  font-size: 24rpx;
  color: #8C61D6;
}

.post-actions {
  display: flex;
  gap: 40rpx;
  padding-top: 20rpx;
  border-top: 1rpx solid #ECEAF0;
}
.action-btn {
  display: flex;
  align-items: center;
  gap: 10rpx;
}
.action-icon {
  font-size: 40rpx;
  color: #A09CAE;
}
.action-num {
  font-size: 26rpx;
  color: #A09CAE;
}
.action-num.liked {
  color: #E06B6B;
}

/* 评论区 */
.comment-section {
  margin: 0 28rpx;
  background: #FFFFFF;
  border-radius: 24rpx;
  padding: 28rpx 28rpx 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
  border: 1rpx solid #ECEAF0;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 20rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #3A3030;
}
.comment-count-badge {
  padding: 2rpx 16rpx;
  border-radius: 99rpx;
  background: rgba(140,97,214,0.08);
}
.count-text {
  font-size: 22rpx;
  color: #8C61D6;
  font-weight: 600;
}

.comment-item {
  padding: 22rpx 0;
  border-bottom: 1rpx solid #ECEAF0;
}
.comment-item:last-child {
  border-bottom: none;
}
.comment-top {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
}
.cm-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16rpx;
}
.cm-char {
  color: #FFFFFF;
  font-size: 24rpx;
  font-weight: 600;
}
.cm-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.cm-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #3A3030;
}
.cm-floor-badge {
  padding: 2rpx 14rpx;
  border-radius: 6rpx;
  background: rgba(140,97,214,0.06);
}
.cm-floor {
  font-size: 20rpx;
  color: #747288;
  font-weight: 500;
}
.cm-time {
  font-size: 22rpx;
  color: #A09CAE;
}
.cm-content {
  font-size: 28rpx;
  color: #3A3030;
  line-height: 1.7;
  padding-left: 76rpx;
}
.cm-reply {
  margin-left: 76rpx;
  margin-top: 12rpx;
  padding: 16rpx 20rpx;
  background: #F7F6FA;
  border-radius: 14rpx;
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}
.reply-bar {
  width: 4rpx;
  min-height: 32rpx;
  border-radius: 2rpx;
  background: #A882E0;
  flex-shrink: 0;
  margin-top: 4rpx;
}
.reply-text {
  font-size: 24rpx;
  color: #747288;
  line-height: 1.6;
}

.empty-comment {
  padding: 60rpx 0 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.empty-cm-icon {
  font-size: 48rpx;
  color: #A09CAE;
  margin-bottom: 16rpx;
}
.empty-cm-text {
  font-size: 26rpx;
  color: #A09CAE;
}

/* 底部评论输入框 */
.comment-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  background: #FFFFFF;
  border-top: 1rpx solid #ECEAF0;
}
.bar-content {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 24rpx;
}
.input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12rpx;
  height: 76rpx;
  background: #F7F6FA;
  border-radius: 38rpx;
  padding: 0 24rpx;
  border: 1rpx solid #ECEAF0;
}
.input-icon {
  font-size: 32rpx;
  color: #A09CAE;
}
.cm-input {
  flex: 1;
  font-size: 28rpx;
  color: #3A3030;
}
.cm-send {
  padding: 0 36rpx;
  height: 76rpx;
  line-height: 76rpx;
  border-radius: 38rpx;
  background: #F7F6FA;
  transition: all 0.2s;
}
.cm-send.active {
  background: #8C61D6;
  box-shadow: 0 4rpx 16rpx rgba(140,97,214,0.35);
}
.send-text {
  font-size: 28rpx;
  color: #A09CAE;
}
.cm-send.active .send-text {
  color: #FFFFFF;
}
</style>
