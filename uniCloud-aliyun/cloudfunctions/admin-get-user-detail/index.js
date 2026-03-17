'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const userRes = await db.collection('uni-id-users').where({ 'token.token': event.token }).limit(1).get()
  if (!userRes.data || !userRes.data.length) return { code: 401, msg: '未登录' }
  const user = userRes.data[0]
  if (!user.role || !user.role.includes('admin')) return { code: 403, msg: '无权限' }

  const { id } = event
  if (!id) return { code: -1, msg: '缺少用户ID' }
  try {
    const targetRes = await db.collection('uni-id-users')
      .doc(id)
      .field({ password: false, token: false })
      .get()
    if (!targetRes.data || !targetRes.data.length) return { code: -1, msg: '用户不存在' }
    const targetUser = targetRes.data[0]

    const postCountRes = await db.collection('posts').where({ user_id: id }).count()
    const commentCountRes = await db.collection('comments').where({ user_id: id }).count()

    return {
      code: 0,
      data: {
        ...targetUser,
        postCount: postCountRes.total,
        commentCount: commentCountRes.total
      }
    }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
