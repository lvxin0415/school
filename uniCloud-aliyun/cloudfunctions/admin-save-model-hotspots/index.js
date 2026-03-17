'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const userRes = await db.collection('uni-id-users').where({ 'token.token': event.token }).limit(1).get()
    if (!userRes.data || !userRes.data.length) return { code: 401, msg: '未登录' }
    const user = userRes.data[0]
    if (!user.role || !user.role.includes('admin')) return { code: 403, msg: '无权限' }

    const { id, hotspots } = event
    if (!id) return { code: -1, msg: 'id不能为空' }
    if (!Array.isArray(hotspots)) return { code: -1, msg: 'hotspots必须为数组' }

    await db.collection('campus-models').doc(id).update({
      hotspots: hotspots
    })
    return { code: 0, msg: '保存成功' }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
