<template>
  <view class="pg">
    <!-- ====== header ====== -->
    <view class="hd">
      <view class="hd-inner" :style="{ paddingTop: barH + 'px' }">
        <view class="nav-row">
          <text class="nav-title">我的</text>
          <view class="nav-btn" hover-class="nav-btn-hover" @click="go('/pages/mine/settings')">
            <text class="ri-settings-3-line nav-ico"></text>
          </view>
        </view>

        <view class="profile" @click="goEditProfile">
          <view class="ava-wrap">
            <image v-if="userStore.avatar" :src="userStore.avatar" mode="aspectFill" class="ava-img" />
            <view v-else class="ava-ph">
              <text class="ava-char">{{ (userStore.nickname || 'U')[0] }}</text>
            </view>
          </view>

          <view class="info">
            <view class="name-row">
              <text class="name">{{ userStore.nickname || '未设置昵称' }}</text>
              <text class="ri-pencil-line edit-ico"></text>
            </view>
            <text class="uid">ID: {{ userStore.userId ? userStore.userId.slice(-8) : '--------' }}</text>
            <view class="role-tag">
              <text class="role-t">校园达人</text>
            </view>
          </view>

          <text class="ri-arrow-right-s-line go-arrow"></text>
        </view>
      </view>
    </view>

    <!-- ====== stats ====== -->
    <view class="stats-wrap">
      <view class="stats-card">
        <view class="stat" @click="go('/pages/study/index')">
          <text class="stat-v">{{ studyStore.totalDays || 0 }}</text>
          <text class="stat-k">打卡天数</text>
        </view>
        <view class="stat-sep"></view>
        <view class="stat" @click="go('/pages/study/badges')">
          <text class="stat-v">{{ studyStore.points || 0 }}</text>
          <text class="stat-k">积分</text>
        </view>
        <view class="stat-sep"></view>
        <view class="stat" @click="go('/pages/study/badges')">
          <text class="stat-v">{{ studyStore.badges?.length || 0 }}</text>
          <text class="stat-k">勋章</text>
        </view>
        <view class="stat-sep"></view>
        <view class="stat" @click="go('/pages/study/index')">
          <text class="stat-v">{{ studyStore.streakDays || 0 }}</text>
          <text class="stat-k">连续打卡</text>
        </view>
      </view>
    </view>

    <!-- ====== menu groups ====== -->
    <view class="menu-area">
      <view class="menu-group">
        <view class="menu-item" hover-class="item-hover" @click="go('/pages/mine/myPosts')">
          <view class="mi-icon mi-icon--purple">
            <text class="ri-chat-quote-line mi-ico"></text>
          </view>
          <text class="mi-label">我的帖子</text>
          <text class="ri-arrow-right-s-line mi-arrow"></text>
        </view>
        <view class="sep"></view>
        <view class="menu-item" hover-class="item-hover" @click="go('/pages/study/index')">
          <view class="mi-icon mi-icon--blue">
            <text class="ri-book-open-line mi-ico"></text>
          </view>
          <text class="mi-label">学习记录</text>
          <text class="ri-arrow-right-s-line mi-arrow"></text>
        </view>
        <view class="sep"></view>
        <view class="menu-item" hover-class="item-hover" @click="go('/pages/study/badges')">
          <view class="mi-icon mi-icon--amber">
            <text class="ri-award-line mi-ico"></text>
          </view>
          <text class="mi-label">积分与勋章</text>
          <text class="ri-arrow-right-s-line mi-arrow"></text>
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-item" hover-class="item-hover" @click="go('/pages/course/index')">
          <view class="mi-icon mi-icon--green">
            <text class="ri-calendar-schedule-line mi-ico"></text>
          </view>
          <text class="mi-label">课程表</text>
          <text class="ri-arrow-right-s-line mi-arrow"></text>
        </view>
        <view class="sep"></view>
        <view class="menu-item" hover-class="item-hover" @click="go('/pages/mental/index')">
          <view class="mi-icon mi-icon--lavender">
            <text class="ri-mental-health-line mi-ico"></text>
          </view>
          <text class="mi-label">心理健康</text>
          <text class="ri-arrow-right-s-line mi-arrow"></text>
        </view>
        <view class="sep"></view>
        <view class="menu-item" hover-class="item-hover" @click="go('/pages/feedback/index')">
          <view class="mi-icon mi-icon--accent">
            <text class="ri-feedback-line mi-ico"></text>
          </view>
          <text class="mi-label">意见反馈</text>
          <text class="ri-arrow-right-s-line mi-arrow"></text>
        </view>
      </view>

      <view class="menu-group">
        <view class="menu-item" hover-class="item-hover" @click="go('/pages/mine/settings')">
          <view class="mi-icon mi-icon--grey">
            <text class="ri-settings-3-line mi-ico"></text>
          </view>
          <text class="mi-label">设置</text>
          <text class="ri-arrow-right-s-line mi-arrow"></text>
        </view>
        <view v-if="userStore.isAdmin" class="sep"></view>
        <view v-if="userStore.isAdmin" class="menu-item" hover-class="item-hover" @click="go('/pages/admin/index')">
          <view class="mi-icon mi-icon--red">
            <text class="ri-shield-keyhole-line mi-ico"></text>
          </view>
          <text class="mi-label">管理后台</text>
          <text class="ri-arrow-right-s-line mi-arrow"></text>
        </view>
      </view>
    </view>

    <view style="height: 140rpx"></view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/store/user.js'
import { useStudyStore } from '@/store/study.js'

const userStore = useUserStore()
const studyStore = useStudyStore()
const barH = uni.getSystemInfoSync().statusBarHeight || 44

onMounted(() => {
  studyStore.fetchStudyData().catch(() => {})
})

function go(url) { uni.navigateTo({ url }) }
function goEditProfile() { uni.navigateTo({ url: '/pages/mine/editProfile' }) }
</script>

<style scoped>
.pg {
  min-height: 100vh;
  background: #F7F6FA;
}

/* ===== header ===== */
.hd {
  background: linear-gradient(180deg, #DDD5F0 0%, #E8E2F5 40%, #F7F6FA 100%);
}

.hd-inner {
  padding: 0 36rpx 40rpx;
}

/* nav */
.nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 96rpx;
}

.nav-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #3A3030;
  letter-spacing: 2rpx;
}

.nav-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: rgba(140, 97, 214, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.nav-btn-hover {
  background: rgba(140, 97, 214, 0.16);
}

.nav-ico {
  font-size: 36rpx;
  color: #6B47B8;
}

/* profile */
.profile {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-top: 16rpx;
  padding: 28rpx 24rpx;
  background: #FFF;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.ava-wrap {
  flex-shrink: 0;
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  border: 4rpx solid #E8E2F5;
  overflow: hidden;
}

.ava-img {
  width: 100%;
  height: 100%;
}

.ava-ph {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #C9B8E8, #A882E0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.ava-char {
  font-size: 44rpx;
  color: #FFF;
  font-weight: 700;
}

.info {
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.name {
  font-size: 34rpx;
  font-weight: 700;
  color: #3A3030;
  max-width: 320rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.edit-ico {
  font-size: 24rpx;
  color: #A09CAE;
}

.uid {
  display: block;
  font-size: 22rpx;
  color: #A09CAE;
  margin-top: 6rpx;
  letter-spacing: 1rpx;
}

.role-tag {
  display: inline-flex;
  align-items: center;
  margin-top: 10rpx;
  padding: 4rpx 16rpx;
  border-radius: 100rpx;
  background: rgba(140, 97, 214, 0.08);
}

.role-t {
  font-size: 20rpx;
  color: #8C61D6;
  font-weight: 500;
}

.go-arrow {
  font-size: 32rpx;
  color: #D0CDE0;
  flex-shrink: 0;
}

/* ===== stats ===== */
.stats-wrap {
  padding: 0 36rpx;
  margin-top: 20rpx;
}

.stats-card {
  display: flex;
  align-items: center;
  padding: 32rpx 0;
  background: #FFF;
  border-radius: 24rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.stat-v {
  font-size: 38rpx;
  font-weight: 800;
  color: #6B47B8;
  line-height: 1;
}

.stat-k {
  font-size: 22rpx;
  color: #A09CAE;
  font-weight: 400;
}

.stat-sep {
  width: 1rpx;
  height: 48rpx;
  background: #ECEAF0;
}

/* ===== menu ===== */
.menu-area {
  padding: 20rpx 36rpx 0;
}

.menu-group {
  background: #FFF;
  border-radius: 24rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 28rpx 28rpx;
  transition: background 0.15s;
}

.item-hover {
  background: rgba(140, 97, 214, 0.03);
}

.mi-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mi-ico {
  font-size: 32rpx;
}

.mi-icon--purple { background: rgba(140, 97, 214, 0.08); }
.mi-icon--purple .mi-ico { color: #8C61D6; }

.mi-icon--blue { background: rgba(99, 153, 186, 0.08); }
.mi-icon--blue .mi-ico { color: #6399BA; }

.mi-icon--amber { background: rgba(218, 168, 92, 0.08); }
.mi-icon--amber .mi-ico { color: #DAA85C; }

.mi-icon--green { background: rgba(107, 174, 138, 0.08); }
.mi-icon--green .mi-ico { color: #6BAE8A; }

.mi-icon--lavender { background: rgba(168, 130, 224, 0.08); }
.mi-icon--lavender .mi-ico { color: #A882E0; }

.mi-icon--accent { background: rgba(187, 162, 202, 0.08); }
.mi-icon--accent .mi-ico { color: #BBA2CA; }

.mi-icon--grey { background: rgba(160, 156, 174, 0.08); }
.mi-icon--grey .mi-ico { color: #8E8AA0; }

.mi-icon--red { background: rgba(224, 107, 107, 0.08); }
.mi-icon--red .mi-ico { color: #E06B6B; }

.mi-label {
  flex: 1;
  font-size: 30rpx;
  color: #3A3030;
  font-weight: 500;
  letter-spacing: 1rpx;
}

.mi-arrow {
  font-size: 28rpx;
  color: #D0CDE0;
}

.sep {
  height: 1rpx;
  margin-left: 112rpx;
  margin-right: 28rpx;
  background: #ECEAF0;
}
</style>
