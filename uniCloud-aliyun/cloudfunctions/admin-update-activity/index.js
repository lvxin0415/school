'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const userRes = await db.collection('uni-id-users').where({ 'token.token': event.token }).limit(1).get()
  if (!userRes.data || !userRes.data.length) return { code: 401, msg: '未登录' }
  const user = userRes.data[0]
  if (!user.role || !user.role.includes('admin')) return { code: 403, msg: '无权限' }

  const { id, title, content, location, start_time, end_time, cover_url, is_top, is_banner } = event
  if (!id) return { code: -1, msg: '缺少活动ID' }
  if (!title) return { code: -1, msg: '标题不能为空' }

  try {
    await db.collection('activities').doc(id).update({
      title,
      content: content || '',
      location: location || '',
      start_time: start_time || '',
      end_time: end_time || '',
      cover_url: cover_url || '',
      is_top: !!is_top,
      is_banner: !!is_banner,
      updated_at: Date.now()
    })
    return { code: 0, msg: '更新成功' }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
