'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  try {
    const userRes = await db.collection('uni-id-users').where({ 'token.token': event.token }).limit(1).get()
    if (!userRes.data || !userRes.data.length) return { code: 401, msg: '未登录' }
    const user = userRes.data[0]
    if (!user.role || !user.role.includes('admin')) return { code: 403, msg: '无权限' }

    const { title, content, target = 'all' } = event
    if (!title || !content) return { code: -1, msg: '标题和内容不能为空' }

    await db.collection('notices').add({
      title,
      content,
      target,
      created_at: Date.now()
    })

    if (target === 'all') {
      const msgContent = title + ' - ' + content
      const PAGE_SIZE = 100
      let skip = 0
      let hasMore = true

      while (hasMore) {
        const batch = await db.collection('uni-id-users')
          .field({ _id: true })
          .skip(skip)
          .limit(PAGE_SIZE)
          .get()

        const users = batch.data || []
        if (users.length === 0) {
          hasMore = false
          break
        }

        const msgList = users.map(u => ({
          user_id: u._id,
          type: 'system',
          content: msgContent,
          read: false,
          created_at: Date.now()
        }))

        const tasks = msgList.map(msg => db.collection('messages').add(msg))
        await Promise.all(tasks)

        skip += PAGE_SIZE
        if (users.length < PAGE_SIZE) hasMore = false
      }
    }

    return { code: 0, msg: '通知发送成功' }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
