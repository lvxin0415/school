/**
 * uniCloud 云函数请求封装
 */

export function callCloud(name, data = {}) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('uni_id_token') || ''
    uniCloud.callFunction({
      name,
      data: {
        ...data,
        token
      },
      success(res) {
        if (res.result.code === 0) {
          resolve(res.result)
        } else if (res.result.code === 401) {
          // Token 过期，跳转登录
          uni.removeStorageSync('uni_id_token')
          uni.removeStorageSync('uni_id_token_expired')
          uni.removeStorageSync('userInfo')
          uni.reLaunch({ url: '/pages/login/login' })
          reject(res.result)
        } else {
          uni.showToast({ title: res.result.msg || '请求失败', icon: 'none' })
          reject(res.result)
        }
      },
      fail(err) {
        uni.showToast({ title: '网络错误', icon: 'none' })
        reject(err)
      }
    })
  })
}

/**
 * 上传文件到云存储
 */
export function uploadFile(filePath, cloudPath) {
  return new Promise((resolve, reject) => {
    uniCloud.uploadFile({
      filePath,
      cloudPath,
      onUploadProgress(e) {
        const percent = Math.round((e.loaded * 100) / e.total)
        uni.$emit('uploadProgress', percent)
      },
      success(res) {
        resolve(res.fileID)
      },
      fail(err) {
        uni.showToast({ title: '上传失败', icon: 'none' })
        reject(err)
      }
    })
  })
}

/**
 * 获取临时文件URL
 */
export function getTempFileURL(fileList) {
  return uniCloud.getTempFileURL({ fileList })
}
