'use strict'

const db = uniCloud.database()

exports.main = async (event, context) => {
  const { token } = event

  if (!token) {
    return { code: -1, msg: '未登录' }
  }

  try {
    const userRes = await db.collection('uni-id-users')
      .where({ 'token.token': token })
      .limit(1)
      .field({ _id: true })
      .get()

    if (!userRes.data || userRes.data.length === 0) {
      return { code: -1, msg: '用户不存在' }
    }

    const userId = userRes.data[0]._id

    await db.collection('messages')
      .where({ user_id: userId, read: false })
      .update({ read: true })

    return { code: 0, msg: '已全部标记已读' }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
