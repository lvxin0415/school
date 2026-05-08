<script>
export default {
  onLaunch() {
    console.log('App Launch')

    // #ifdef APP-PLUS
    if (uniCloud.config && !uniCloud.config.spaceId) {
      uniCloud.init({
        provider: 'aliyun',
        spaceId: 'mp-617c61b1-0cce-41d5-931f-bd51f8d154ee',
        clientSecret: 'ANa/OKMzzj8Mt5Pzw/f4hw=='
      })
    }
    // #endif

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
