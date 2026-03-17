'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const userRes = await db.collection('uni-id-users').where({ 'token.token': event.token }).limit(1).get()
  if (!userRes.data || !userRes.data.length) return { code: 401, msg: '未登录' }
  const user = userRes.data[0]
  if (!user.role || !user.role.includes('admin')) return { code: 403, msg: '无权限' }

  const { ids = [], status } = event
  if (!ids.length || !status || !['approved', 'rejected'].includes(status)) {
    return { code: -1, msg: '参数错误' }
  }
  try {
    const tasks = ids.map(id =>
      db.collection('posts').doc(id).update({ status, updated_at: Date.now() })
    )
    await Promise.all(tasks)
    return { code: 0, msg: '批量操作成功' }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
