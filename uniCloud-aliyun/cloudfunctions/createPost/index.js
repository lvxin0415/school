'use strict'
const db = uniCloud.database()

exports.main = async (event, context) => {
  const { content, images = [], tags = [], anonymous_name, avatar_color } = event
  const { uid } = context.auth || {}

  if (!uid) return { code: -1, msg: '请先登录' }
  if (!content || !content.trim()) return { code: -1, msg: '内容不能为空' }

  try {
    const res = await db.collection('posts').add({
      user_id: uid,
      content: content.trim(),
      images,
      tags,
      anonymous_name: anonymous_name || '匿名用户',
      avatar_color: avatar_color || '#94C1D6',
      likes: 0,
      liked_users: [],
      comment_count: 0,
      status: 'pending',
      is_top: false,
      created_at: Date.now(),
      updated_at: Date.now()
    })

    return { code: 0, data: { id: res.id }, msg: '发布成功，等待审核' }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
