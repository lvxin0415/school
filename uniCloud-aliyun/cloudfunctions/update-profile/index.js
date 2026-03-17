'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const { nickname, avatar, token } = event
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

    const updateData = {}
    if (nickname !== undefined) updateData.nickname = nickname
    if (avatar !== undefined) updateData.avatar = avatar

    if (Object.keys(updateData).length === 0) {
      return { code: -1, msg: '无有效更新字段' }
    }

    await db.collection('uni-id-users').doc(userId).update(updateData)

    const curRes = await db.collection('uni-id-users').doc(userId).field({ nickname: true, avatar: true }).get()
    const user = curRes.data && curRes.data[0] ? curRes.data[0] : {}
    return { code: 0, msg: '更新成功', data: { nickname: user.nickname, avatar: user.avatar } }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
