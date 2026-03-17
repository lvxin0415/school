'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const userRes = await db.collection('uni-id-users').where({ 'token.token': event.token }).limit(1).get()
  if (!userRes.data || !userRes.data.length) return { code: 401, msg: '未登录' }
  const user = userRes.data[0]
  if (!user.role || !user.role.includes('admin')) return { code: 403, msg: '无权限' }

  const { id, status } = event
  if (!id || status === undefined) return { code: -1, msg: '参数错误' }
  try {
    const updateData = { status }
    if (status === 1) {
      updateData.token = []
    }
    await db.collection('uni-id-users').doc(id).update(updateData)
    return { code: 0, msg: status === 1 ? '已封禁' : '已解封' }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
