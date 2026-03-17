<script>
export default {
  onLaunch() {
    console.log('App Launch')
    // 检查登录状态
    const token = uni.getStorageSync('uni_id_token')
    if (!token) {
      uni.reLaunch({ url: '/pages/login/login' })
    }
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  }
}
</script>

<style>
@import './common/styles/base.css';
@import './static/fonts/remixicon.css';
</style>
