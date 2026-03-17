'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const userRes = await db.collection('uni-id-users').where({ 'token.token': event.token }).limit(1).get()
    if (!userRes.data || !userRes.data.length) return { code: 401, msg: '未登录' }
    const user = userRes.data[0]
    if (!user.role || !user.role.includes('admin')) return { code: 403, msg: '无权限' }

    const res = await db.collection('notices')
      .orderBy('created_at', 'desc')
      .limit(50)
      .get()
    return { code: 0, data: res.data || [] }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
