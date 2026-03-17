'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const userRes = await db.collection('uni-id-users').where({ 'token.token': event.token }).limit(1).get()
    if (!userRes.data || !userRes.data.length) return { code: 401, msg: '未登录' }
    const user = userRes.data[0]
    if (!user.role || !user.role.includes('admin')) return { code: 403, msg: '无权限' }

    const { id, status } = event
    if (!id) return { code: -1, msg: 'id不能为空' }
    if (!status || !['active', 'disabled'].includes(status)) return { code: -1, msg: 'status必须为active或disabled' }

    await db.collection('campus-models').doc(id).update({
      status
    })
    return { code: 0, msg: '操作成功' }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
