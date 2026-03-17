'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const userRes = await db.collection('uni-id-users').where({ 'token.token': event.token }).limit(1).get()
    if (!userRes.data || !userRes.data.length) return { code: 401, msg: '未登录' }
    const user = userRes.data[0]
    if (!user.role || !user.role.includes('admin')) return { code: 403, msg: '无权限' }

    const { name, description, file_url, thumbnail_url } = event
    if (!name || !file_url) return { code: -1, msg: '名称和文件地址不能为空' }

    const res = await db.collection('campus-models').add({
      name,
      description: description || '',
      file_url,
      thumbnail_url: thumbnail_url || '',
      status: 'active',
      hotspots: [],
      created_at: Date.now()
    })
    return { code: 0, msg: '上传成功', data: { id: res.id } }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
