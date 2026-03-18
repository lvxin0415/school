<template>
  <view class="campus3d-page">
    <view class="nav-bar safe-area-top">
      <view class="nav-content">
        <view class="nav-back" @click="goBack"><text class="ri-arrow-left-s-line back-ico"></text> <text>返回</text>
        </view>
        <text class="nav-title">3D 校园参观</text>
        <view class="nav-reset" @click="resetView"><text class="ri-refresh-line reset-ico"></text></view>
      </view>
    </view>

    <view v-if="loading" class="loading-overlay">
      <view class="loading-box">
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: progress + '%' }"></view>
        </view>
        <text class="progress-text">加载中... {{ progress }}%</text>
      </view>
    </view>

    <view v-if="!loading && !hasModel" class="empty-3d">
      <text class="ri-map-pin-2-line empty-ico"></text>
      <text class="empty-title">校园模型准备中</text>
      <text class="empty-desc">敬请期待 3D 沉浸式校园参观</text>
    </view>

    <view v-show="hasModel && !loading" id="three-container" class="three-container" :modelUrl="modelUrl"
      :hotspots="JSON.stringify(hotspots)" :change:modelUrl="render.onModelUrlChange"
      :change:hotspots="render.onHotspotsChange">
    </view>

    <view v-if="showHotspot" class="hotspot-card safe-area-bottom" @click="showHotspot = false">
      <view class="hotspot-content" @click.stop>
        <view class="hotspot-header">
          <text class="hotspot-name">{{ currentHotspot.name }}</text>
          <view class="hotspot-close" @click="showHotspot = false"><text class="ri-close-line hotspot-close-ico"></text>
          </view>
        </view>
        <image v-if="currentHotspot.image" :src="currentHotspot.image" mode="aspectFill" class="hotspot-img" />
        <text class="hotspot-desc">{{ currentHotspot.description }}</text>
      </view>
    </view>

    <view v-if="hasModel && !loading && showTip" class="tip-bar">
      <text class="tip-text">单指拖动旋转 · 双指缩放 · 双击重置</text>
      <view class="tip-close" @click="showTip = false"><text class="ri-close-line tip-close-ico"></text></view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      progress: 0,
      hasModel: false,
      modelUrl: '',
      hotspots: [],
      showHotspot: false,
      currentHotspot: {},
      showTip: true
    }
  },
  async onLoad() {
    try {
      const res = await uniCloud.callFunction({
        name: 'get-campus-model',
        data: { token: uni.getStorageSync('uni_id_token') }
      })
      if (res.result.code === 0 && res.result.data) {
        this.modelUrl = res.result.data.file_url
        this.hotspots = res.result.data.hotspots || []
        this.hasModel = true
      } else {
        this.loading = false
        this.hasModel = false
      }
    } catch (e) {
      console.error(e)
      this.loading = false
      this.hasModel = false
    }
  },
  methods: {
    goBack() { uni.navigateBack() },
    resetView() {
      // 通知 renderjs 重置视角
      this.modelUrl = this.modelUrl + '?reset=' + Date.now()
    },
    onHotspotClick(data) {
      this.currentHotspot = data
      this.showHotspot = true
    },
    onLoadProgress(p) {
      this.progress = p
      if (p >= 100) {
        setTimeout(() => { this.loading = false }, 500)
      }
    }
  }
}
</script>

<script module="render" lang="renderjs">
let THREE, scene, camera, renderer, controls, mixer
let container

export default {
  methods: {
    async onModelUrlChange(url) {
      if (!url) return
      const realUrl = url.split('?')[0]
      try {
        await this.initThree()
        this.loadModel(realUrl)
      } catch (e) {
        console.error('初始化失败:', e)
        this.$ownerInstance.callMethod('onLoadProgress', 100)
      }
    },
    onHotspotsChange() {},

    async initThree() {
      if (THREE) {
        if (controls) controls.reset()
        return
      }

      const CDN = 'https://cdn.jsdelivr.net/npm'

      await this.loadScript(`${CDN}/three@0.128.0/build/three.min.js`)

      // fflate UMD 需要 exports/module 全局变量
      const hadExports = 'exports' in window
      const hadModule = 'module' in window
      const origExports = window.exports
      const origModule = window.module
      window.exports = {}
      window.module = { exports: window.exports }

      await this.loadScript(`${CDN}/fflate@0.7.4/umd/index.js`)

      window.fflate = window.module.exports
      if (Object.keys(window.fflate).length === 0 && window.exports && Object.keys(window.exports).length > 0) {
        window.fflate = window.exports
      }

      // 还原全局变量
      if (hadExports) { window.exports = origExports } else { delete window.exports }
      if (hadModule) { window.module = origModule } else { delete window.module }

      await this.loadScript(`${CDN}/three@0.128.0/examples/js/loaders/FBXLoader.js`)
      await this.loadScript(`${CDN}/three@0.128.0/examples/js/controls/OrbitControls.js`)

      THREE = window.THREE
      container = document.getElementById('three-container')
      if (!container) return

      scene = new THREE.Scene()
      scene.background = new THREE.Color(0xa0a0a0)

      const w = container.clientWidth || window.innerWidth
      const h = container.clientHeight || window.innerHeight
      camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 5000)
      camera.position.set(0, 80, 150)

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      container.appendChild(renderer.domElement)

      scene.add(new THREE.AmbientLight(0xffffff, 0.65))
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
      dirLight.position.set(100, 200, 80)
      scene.add(dirLight)
      const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.2)
      dirLight2.position.set(-60, 120, -60)
      scene.add(dirLight2)

      controls = new THREE.OrbitControls(camera, renderer.domElement)
      controls.enablePan = true
      controls.minDistance = 5
      controls.maxDistance = 500
      controls.enableDamping = true
      controls.dampingFactor = 0.08

      const animate = () => {
        requestAnimationFrame(animate)
        if (mixer) mixer.update(0.016)
        controls.update()
        renderer.render(scene, camera)
      }
      animate()

      window.addEventListener('resize', () => {
        if (!container) return
        const nw = container.clientWidth || window.innerWidth
        const nh = container.clientHeight || window.innerHeight
        camera.aspect = nw / nh
        camera.updateProjectionMatrix()
        renderer.setSize(nw, nh)
      })
    },

    loadModel(url) {
      const isFBX = /\.fbx$/i.test(url)
      let loader
      if (isFBX) {
        loader = new THREE.FBXLoader()
      } else if (THREE.GLTFLoader) {
        loader = new THREE.GLTFLoader()
      } else {
        loader = new THREE.FBXLoader()
      }

      loader.load(
        url,
        (result) => {
          const object = result.scene || result

          object.traverse((child) => {
            if (child.isMesh) {
              if (child.geometry && child.geometry.attributes && child.geometry.attributes.color) {
                child.geometry.deleteAttribute('color')
              }
              const mats = Array.isArray(child.material) ? child.material : [child.material]
              const newMats = mats.map((mat) => {
                if (!mat) return mat
                return new THREE.MeshLambertMaterial({
                  color: mat.color ? mat.color.clone() : new THREE.Color(0xcccccc),
                  map: mat.map || null,
                  opacity: mat.opacity,
                  transparent: mat.transparent,
                  side: THREE.DoubleSide,
                  vertexColors: false
                })
              })
              child.material = newMats.length === 1 ? newMats[0] : newMats
            }
          })

          const box = new THREE.Box3().setFromObject(object)
          const size = box.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)
          if (maxDim > 0) {
            const scale = 80 / maxDim
            object.scale.setScalar(scale)
            const center = box.getCenter(new THREE.Vector3())
            object.position.sub(center.multiplyScalar(scale))
          }

          scene.add(object)

          if (object.animations && object.animations.length) {
            mixer = new THREE.AnimationMixer(object)
            object.animations.forEach((clip) => mixer.clipAction(clip).play())
          }

          camera.position.set(0, 60, 120)
          controls.target.set(0, 0, 0)
          controls.update()

          this.$ownerInstance.callMethod('onLoadProgress', 100)
        },
        (xhr) => {
          if (xhr.total > 0) {
            const p = Math.round((xhr.loaded / xhr.total) * 100)
            this.$ownerInstance.callMethod('onLoadProgress', Math.min(p, 99))
          }
        },
        (error) => {
          console.error('模型加载失败:', error)
          this.$ownerInstance.callMethod('onLoadProgress', 100)
        }
      )
    },

    loadScript(src) {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve()
        const s = document.createElement('script')
        s.src = src
        s.onload = resolve
        s.onerror = () => reject(new Error('Script load failed: ' + src))
        document.head.appendChild(s)
      })
    }
  }
}
</script>

<style scoped>
.campus3d-page {
  min-height: 100vh;
  background: #F7F6FA;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  background: #FFFFFF;
  border-bottom: 1rpx solid #ECEAF0;
  z-index: 10;
}

.nav-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
}

.nav-back {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 28rpx;
  color: #8C61D6;
}

.nav-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #3A3030;
}

.nav-reset {
  padding: 10rpx;
}

.three-container {
  flex: 1;
  width: 100%;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #F7F6FA;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
}

.loading-box {
  text-align: center;
}

.progress-bar {
  width: 400rpx;
  height: 12rpx;
  background: #ECEAF0;
  border-radius: 6rpx;
  overflow: hidden;
  margin-bottom: 16rpx;
}

.progress-fill {
  height: 100%;
  background: #8C61D6;
  border-radius: 6rpx;
  transition: width 0.3s;
}

.progress-text {
  font-size: 26rpx;
  color: #8C61D6;
}

.empty-3d {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
}

.empty-title {
  font-size: 34rpx;
  font-weight: 700;
  color: #3A3030;
}

.empty-desc {
  font-size: 26rpx;
  color: #A09CAE;
}

.hotspot-card {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 20;
  padding-top: 200rpx;
}

.hotspot-content {
  background: #FFF;
  border-radius: 24rpx 24rpx 0 0;
  padding: 32rpx;
}

.hotspot-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.hotspot-name {
  font-size: 34rpx;
  font-weight: 700;
  color: #3A3030;
}

.hotspot-close {
  padding: 10rpx;
}

.hotspot-img {
  width: 100%;
  height: 300rpx;
  border-radius: 16rpx;
  margin-bottom: 16rpx;
}

.hotspot-desc {
  font-size: 28rpx;
  color: #747288;
  line-height: 1.7;
}

.tip-bar {
  position: fixed;
  bottom: 120rpx;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(58, 48, 48, 0.75);
  color: #FFF;
  padding: 16rpx 32rpx;
  border-radius: 99px;
  display: flex;
  align-items: center;
  gap: 16rpx;
  z-index: 15;
}

.tip-text {
  font-size: 24rpx;
}

.tip-close {
  opacity: 0.7;
}

.back-ico {
  font-size: 32rpx;
  color: #8C61D6;
}

.reset-ico {
  font-size: 28rpx;
  color: #8C61D6;
}

.empty-ico {
  font-size: 120rpx;
  color: #A09CAE;
}

.hotspot-close-ico {
  font-size: 36rpx;
  color: #A09CAE;
}

.tip-close-ico {
  font-size: 28rpx;
  color: #FFFFFF;
}
</style>
