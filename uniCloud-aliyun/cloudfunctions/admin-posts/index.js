'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const userRes = await db.collection('uni-id-users').where({ 'token.token': event.token }).limit(1).get()
  if (!userRes.data || !userRes.data.length) return { code: 401, msg: '未登录' }
  const user = userRes.data[0]
  if (!user.role || !user.role.includes('admin')) return { code: 403, msg: '无权限' }

  const { status = 'pending', page = 1, pageSize = 20 } = event
  const skip = (page - 1) * pageSize
  try {
    const where = { status }
    const countRes = await db.collection('posts').where(where).count()
    const res = await db.collection('posts')
      .where(where)
      .orderBy('created_at', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()
    return { code: 0, data: res.data, total: countRes.total }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
