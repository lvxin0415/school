'use strict'

const db = uniCloud.database()

exports.main = async (event, context) => {
  const { token } = event

  if (!token) {
    return { code: 0, count: 0 }
  }

  try {
    const userRes = await db.collection('uni-id-users')
      .where({ 'token.token': token })
      .limit(1)
      .field({ _id: true })
      .get()

    if (!userRes.data || userRes.data.length === 0) {
      return { code: 0, count: 0 }
    }

    const userId = userRes.data[0]._id

    const countRes = await db.collection('messages')
      .where({
        user_id: userId,
        read: false
      })
      .count()

    return {
      code: 0,
      count: countRes.total || 0
    }
  } catch (e) {
    return { code: 0, count: 0 }
  }
}
