'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const userRes = await db.collection('uni-id-users').where({ 'token.token': event.token }).limit(1).get()
  if (!userRes.data || !userRes.data.length) return { code: 401, msg: '未登录' }
  const user = userRes.data[0]
  if (!user.role || !user.role.includes('admin')) return { code: 403, msg: '无权限' }

  const { id } = event
  if (!id) return { code: -1, msg: '缺少帖子ID' }
  try {
    await db.collection('posts').doc(id).update({ status: 'approved', updated_at: Date.now() })
    return { code: 0, msg: '已保留帖子' }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
