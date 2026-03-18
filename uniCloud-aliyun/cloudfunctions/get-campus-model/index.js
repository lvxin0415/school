'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const res = await db.collection('campus-models')
      .where({ status: 'active' })
      .orderBy('created_at', 'desc')
      .limit(1)
      .get()

    if (!res.data || res.data.length === 0) {
      return { code: -1, msg: '暂无可用模型' }
    }

    const model = res.data[0]

    let fileUrl = model.file_url || ''
    if (fileUrl && !fileUrl.startsWith('http')) {
      try {
        const urlRes = await uniCloud.getTempFileURL({ fileList: [fileUrl] })
        if (urlRes.fileList && urlRes.fileList[0]) {
          fileUrl = urlRes.fileList[0].tempFileURL
        }
      } catch (e) {
        console.error('获取临时URL失败:', e)
      }
    }

    return {
      code: 0,
      data: {
        _id: model._id,
        name: model.name,
        file_url: fileUrl,
        thumbnail_url: model.thumbnail_url || '',
        hotspots: model.hotspots || []
      }
    }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
