'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const userRes = await db.collection('uni-id-users').where({ 'token.token': event.token }).limit(1).get()
  if (!userRes.data || !userRes.data.length) return { code: 401, msg: '未登录' }
  const user = userRes.data[0]
  if (!user.role || !user.role.includes('admin')) return { code: 403, msg: '无权限' }

  const { title, content, location, start_time, end_time, cover_url, is_top, is_banner } = event
  if (!title) return { code: -1, msg: '标题不能为空' }

  try {
    const res = await db.collection('activities').add({
      title,
      content: content || '',
      location: location || '',
      start_time: start_time || '',
      end_time: end_time || '',
      cover_url: cover_url || '',
      is_top: !!is_top,
      is_banner: !!is_banner,
      status: 'active',
      created_at: Date.now(),
      created_by: user._id
    })
    return { code: 0, msg: '发布成功', data: { id: res.id } }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
