'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const { id, ids, action, status, tab = 'pending', page = 1, pageSize = 20 } = event

  if (action === 'list') {
    const where = {}
    if (tab === 'pending') where.status = 'pending'
    else if (tab === 'approved') where.status = 'approved'
    else if (tab === 'reported') where.status = 'reported'

    const skip = (page - 1) * pageSize
    try {
      const countRes = await db.collection('posts').where(where).count()
      const res = await db.collection('posts')
        .where(where)
        .orderBy('created_at', 'desc')
        .skip(skip)
        .limit(pageSize)
        .get()
      return { code: 0, data: res.data, total: countRes.total }
    } catch (e) {
      return { code: -1, msg: e.message }
    }
  }

  const targetStatus = status || (action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : null)

  if (targetStatus === 'approved' || targetStatus === 'rejected') {
    const targetIds = ids || (id ? [id] : [])
    if (!targetIds.length) return { code: -1, msg: '缺少帖子ID' }

    try {
      for (const pid of targetIds) {
        await db.collection('posts').doc(pid).update({ status: targetStatus, updated_at: Date.now() })
      }
      return { code: 0, msg: `已${targetStatus === 'approved' ? '通过' : '拒绝'}${targetIds.length}条` }
    } catch (e) {
      return { code: -1, msg: e.message }
    }
  }

  if (action === 'delete') {
    const targetIds = ids || (id ? [id] : [])
    try {
      for (const pid of targetIds) {
        await db.collection('posts').doc(pid).remove()
      }
      return { code: 0, msg: `已删除${targetIds.length}条` }
    } catch (e) {
      return { code: -1, msg: e.message }
    }
  }

  return { code: -1, msg: '未知操作' }
}
