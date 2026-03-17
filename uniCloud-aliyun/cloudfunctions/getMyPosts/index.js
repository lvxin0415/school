'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const { page = 1, pageSize = 15, token } = event
  if (!token) {
    return { code: 401, msg: '未登录' }
  }

  try {
    const userRes = await db.collection('uni-id-users')
      .where({ 'token.token': token })
      .limit(1)
      .field({ _id: true })
      .get()

    if (!userRes.data || !userRes.data.length) {
      return { code: 401, msg: '未登录' }
    }

    const userId = userRes.data[0]._id
    const skip = (page - 1) * pageSize

    const countRes = await db.collection('posts')
      .where({ user_id: userId })
      .count()
    const total = countRes.total

    const res = await db.collection('posts')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    return { code: 0, data: res.data, total }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
