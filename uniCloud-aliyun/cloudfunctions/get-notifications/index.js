'use strict'

const db = uniCloud.database()

exports.main = async (event, context) => {
  const { token, page = 1, pageSize = 20 } = event

  if (!token) {
    return { code: 0, data: [], total: 0 }
  }

  try {
    const userRes = await db.collection('uni-id-users')
      .where({ 'token.token': token })
      .limit(1)
      .field({ _id: true })
      .get()

    if (!userRes.data || userRes.data.length === 0) {
      return { code: 0, data: [], total: 0 }
    }

    const userId = userRes.data[0]._id
    const skip = (page - 1) * pageSize

    const countRes = await db.collection('messages')
      .where({ user_id: userId })
      .count()

    const res = await db.collection('messages')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    return {
      code: 0,
      data: res.data || [],
      total: countRes.total || 0
    }
  } catch (e) {
    return { code: 0, data: [], total: 0 }
  }
}
