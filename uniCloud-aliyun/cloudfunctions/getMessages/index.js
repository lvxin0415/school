'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const { page = 1, pageSize = 20 } = event
  const { uid } = context.auth || {}
  if (!uid) return { code: -1, msg: '请先登录' }

  try {
    const skip = (page - 1) * pageSize
    const countRes = await db.collection('messages').where({ user_id: uid }).count()
    const res = await db.collection('messages')
      .where({ user_id: uid })
      .orderBy('created_at', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    return { code: 0, data: res.data, total: countRes.total }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
