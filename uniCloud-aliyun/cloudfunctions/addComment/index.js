'use strict'
const db = uniCloud.database()
const dbCmd = db.command

exports.main = async (event, context) => {
  const { post_id, content, anonymous_name, avatar_color } = event
  const { uid } = context.auth || {}
  if (!uid) return { code: -1, msg: '请先登录' }
  if (!post_id || !content?.trim()) return { code: -1, msg: '参数不完整' }

  try {
    const res = await db.collection('comments').add({
      post_id,
      user_id: uid,
      content: content.trim(),
      anonymous_name: anonymous_name || '匿名用户',
      avatar_color: avatar_color || '#94C1D6',
      created_at: Date.now()
    })

    await db.collection('posts').doc(post_id).update({
      comment_count: dbCmd.inc(1)
    })

    const postRes = await db.collection('posts').doc(post_id).get()
    const post = postRes.data[0]
    if (post && post.user_id !== uid) {
      await db.collection('messages').add({
        user_id: post.user_id,
        type: 'comment',
        content: content.trim().slice(0, 50),
        post_id,
        from_user_id: uid,
        read: false,
        created_at: Date.now()
      })
    }

    return { code: 0, data: { id: res.id } }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
