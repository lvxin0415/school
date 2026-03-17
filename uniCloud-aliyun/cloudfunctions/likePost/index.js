'use strict'
const db = uniCloud.database()
const dbCmd = db.command

exports.main = async (event, context) => {
  const { id } = event
  const { uid } = context.auth || {}
  if (!uid) return { code: -1, msg: '请先登录' }
  if (!id) return { code: -1, msg: '缺少帖子ID' }

  try {
    const postRes = await db.collection('posts').doc(id).get()
    const post = postRes.data[0]
    if (!post) return { code: -1, msg: '帖子不存在' }

    const isLiked = (post.liked_users || []).includes(uid)

    if (isLiked) {
      await db.collection('posts').doc(id).update({
        likes: dbCmd.inc(-1),
        liked_users: dbCmd.pull(uid)
      })
      return { code: 0, data: { isLiked: false, likes: post.likes - 1 } }
    } else {
      await db.collection('posts').doc(id).update({
        likes: dbCmd.inc(1),
        liked_users: dbCmd.push(uid)
      })
      if (post.user_id !== uid) {
        await db.collection('messages').add({
          user_id: post.user_id,
          type: 'like',
          content: '有人点赞了你的帖子',
          post_id: id,
          from_user_id: uid,
          read: false,
          created_at: Date.now()
        })
      }
      return { code: 0, data: { isLiked: true, likes: post.likes + 1 } }
    }
  } catch (e) {
    return { code: -1, msg: e.message }
  }
}
