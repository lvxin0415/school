'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const userRes = await db.collection('uni-id-users').where({ 'token.token': event.token }).limit(1).get()
    if (!userRes.data || !userRes.data.length) return { code: 401, msg: '未登录' }
    const user = userRes.data[0]
    if (!user.role || !user.role.includes('admin')) return { code: 403, msg: '无权限' }

    const { id } = event
    if (!id) return { code: -1, msg: 'id不能为空' }

    const res = await db.collection('campus-models').doc(id).get()
    if (!res.data || !res.data[0]) return { code: -1, msg: '模型不存在' }
    const model = res.data[0]
    return { code: 0, data: model.hotspots || [] }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
